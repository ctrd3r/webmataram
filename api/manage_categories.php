<?php
/**
 * Category Management API
 * Handles CRUD operations for news categories
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to user
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    $conn = getDBConnection();
    
    if (!$conn) {
        sendResponse(500, false, 'Database connection failed');
    }
    
    switch ($method) {
        case 'GET':
            if ($action === 'list') {
                getCategories($conn);
            } elseif ($action === 'detail' && isset($_GET['id'])) {
                getCategoryDetail($conn, $_GET['id']);
            } else {
                getCategories($conn);
            }
            break;
            
        case 'POST':
            if ($action === 'add') {
                addCategory($conn);
            } else {
                sendResponse(400, false, 'Invalid action');
            }
            break;
            
        case 'PUT':
            if ($action === 'update') {
                updateCategory($conn);
            } else {
                sendResponse(400, false, 'Invalid action');
            }
            break;
            
        case 'DELETE':
            if ($action === 'delete' && isset($_GET['id'])) {
                deleteCategory($conn, $_GET['id']);
            } else {
                sendResponse(400, false, 'Invalid action or missing ID');
            }
            break;
            
        default:
            sendResponse(405, false, 'Method not allowed');
    }
    
} catch (Exception $e) {
    error_log('Category API Error: ' . $e->getMessage());
    sendResponse(500, false, 'Server error: ' . $e->getMessage());
}

/**
 * Get all categories
 */
function getCategories($conn) {
    try {
        $sql = "SELECT 
                    k.id_kategori,
                    k.nama_kategori,
                    k.slug_kategori,
                    k.deskripsi,
                    k.created_at,
                    COUNT(b.id_berita) as total_berita
                FROM kategori k
                LEFT JOIN berita b ON k.id_kategori = b.id_kategori
                GROUP BY k.id_kategori
                ORDER BY k.nama_kategori ASC";
        
        $result = $conn->query($sql);
        
        if ($result) {
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }
            sendResponse(200, true, 'Categories retrieved successfully', $categories);
        } else {
            sendResponse(500, false, 'Failed to retrieve categories');
        }
    } catch (Exception $e) {
        sendResponse(500, false, 'Error: ' . $e->getMessage());
    }
}

/**
 * Get category detail
 */
function getCategoryDetail($conn, $id) {
    try {
        $stmt = $conn->prepare("SELECT * FROM kategori WHERE id_kategori = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $category = $result->fetch_assoc();
            sendResponse(200, true, 'Category retrieved successfully', $category);
        } else {
            sendResponse(404, false, 'Category not found');
        }
    } catch (Exception $e) {
        sendResponse(500, false, 'Error: ' . $e->getMessage());
    }
}

/**
 * Add new category
 */
function addCategory($conn) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        if (empty($data['nama_kategori'])) {
            sendResponse(400, false, 'Nama kategori harus diisi');
            return;
        }
        
        $nama_kategori = trim($data['nama_kategori']);
        $slug_kategori = createSlug($nama_kategori);
        $deskripsi = isset($data['deskripsi']) ? trim($data['deskripsi']) : '';
        
        // Check if category already exists
        $checkStmt = $conn->prepare("SELECT id_kategori FROM kategori WHERE nama_kategori = ? OR slug_kategori = ?");
        $checkStmt->bind_param("ss", $nama_kategori, $slug_kategori);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            sendResponse(400, false, 'Kategori dengan nama tersebut sudah ada');
            return;
        }
        
        // Insert new category
        $stmt = $conn->prepare("INSERT INTO kategori (nama_kategori, slug_kategori, deskripsi) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nama_kategori, $slug_kategori, $deskripsi);
        
        if ($stmt->execute()) {
            $newId = $conn->insert_id;
            sendResponse(201, true, 'Kategori berhasil ditambahkan', ['id_kategori' => $newId]);
        } else {
            sendResponse(500, false, 'Gagal menambahkan kategori');
        }
    } catch (Exception $e) {
        sendResponse(500, false, 'Error: ' . $e->getMessage());
    }
}

/**
 * Update category
 */
function updateCategory($conn) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        if (empty($data['id_kategori']) || empty($data['nama_kategori'])) {
            sendResponse(400, false, 'ID kategori dan nama kategori harus diisi');
            return;
        }
        
        $id_kategori = $data['id_kategori'];
        $nama_kategori = trim($data['nama_kategori']);
        $slug_kategori = createSlug($nama_kategori);
        $deskripsi = isset($data['deskripsi']) ? trim($data['deskripsi']) : '';
        
        // Check if category exists
        $checkStmt = $conn->prepare("SELECT id_kategori FROM kategori WHERE id_kategori = ?");
        $checkStmt->bind_param("i", $id_kategori);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            sendResponse(404, false, 'Kategori tidak ditemukan');
            return;
        }
        
        // Check for duplicate name (excluding current category)
        $dupStmt = $conn->prepare("SELECT id_kategori FROM kategori WHERE (nama_kategori = ? OR slug_kategori = ?) AND id_kategori != ?");
        $dupStmt->bind_param("ssi", $nama_kategori, $slug_kategori, $id_kategori);
        $dupStmt->execute();
        $dupResult = $dupStmt->get_result();
        
        if ($dupResult->num_rows > 0) {
            sendResponse(400, false, 'Kategori dengan nama tersebut sudah ada');
            return;
        }
        
        // Update category
        $stmt = $conn->prepare("UPDATE kategori SET nama_kategori = ?, slug_kategori = ?, deskripsi = ? WHERE id_kategori = ?");
        $stmt->bind_param("sssi", $nama_kategori, $slug_kategori, $deskripsi, $id_kategori);
        
        if ($stmt->execute()) {
            sendResponse(200, true, 'Kategori berhasil diupdate');
        } else {
            sendResponse(500, false, 'Gagal mengupdate kategori');
        }
    } catch (Exception $e) {
        sendResponse(500, false, 'Error: ' . $e->getMessage());
    }
}

/**
 * Delete category
 */
function deleteCategory($conn, $id) {
    try {
        // Check if category exists
        $checkStmt = $conn->prepare("SELECT id_kategori FROM kategori WHERE id_kategori = ?");
        $checkStmt->bind_param("i", $id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            sendResponse(404, false, 'Kategori tidak ditemukan');
            return;
        }
        
        // Check if category is being used
        $usageStmt = $conn->prepare("SELECT COUNT(*) as count FROM berita WHERE id_kategori = ?");
        $usageStmt->bind_param("i", $id);
        $usageStmt->execute();
        $usageResult = $usageStmt->get_result();
        $usage = $usageResult->fetch_assoc();
        
        if ($usage['count'] > 0) {
            sendResponse(400, false, 'Kategori tidak dapat dihapus karena masih digunakan oleh ' . $usage['count'] . ' berita');
            return;
        }
        
        // Delete category
        $stmt = $conn->prepare("DELETE FROM kategori WHERE id_kategori = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            sendResponse(200, true, 'Kategori berhasil dihapus');
        } else {
            sendResponse(500, false, 'Gagal menghapus kategori');
        }
    } catch (Exception $e) {
        sendResponse(500, false, 'Error: ' . $e->getMessage());
    }
}

/**
 * Create URL-friendly slug
 */
function createSlug($text) {
    // Replace non letter or digits by -
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    
    // Transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    
    // Remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
    
    // Trim
    $text = trim($text, '-');
    
    // Remove duplicate -
    $text = preg_replace('~-+~', '-', $text);
    
    // Lowercase
    $text = strtolower($text);
    
    if (empty($text)) {
        return 'n-a';
    }
    
    return $text;
}

/**
 * Send JSON response
 */
function sendResponse($code, $success, $message, $data = null) {
    http_response_code($code);
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit();
}
?>
