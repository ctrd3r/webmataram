<?php
/**
 * News Management API - Simplified Version
 */

// TEMPORARY: Display errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start output buffering
ob_start();

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Response function
function sendResponse($code, $success, $message, $data = null) {
    if (ob_get_length()) ob_clean();
    http_response_code($code);
    $response = ['success' => $success, 'message' => $message];
    if ($data !== null) $response['data'] = $data;
    echo json_encode($response);
    exit();
}

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    $conn = getDBConnection();
    if (!$conn) {
        sendResponse(500, false, 'Database connection failed');
    }
    
    // Route requests
    if ($method === 'GET') {
        if ($action === 'list') {
            getNewsList($conn);
        } elseif ($action === 'detail' && isset($_GET['id'])) {
            getNewsDetail($conn, $_GET['id']);
        } elseif ($action === 'stats') {
            getNewsStats($conn);
        } else {
            getNewsList($conn);
        }
    } elseif ($method === 'POST' && $action === 'add') {
        addNews($conn);
    } elseif ($method === 'POST') {
        // Handle JSON POST requests for featured news management
        $data = json_decode(file_get_contents('php://input'), true);
        $postAction = isset($data['action']) ? $data['action'] : '';
        
        if ($postAction === 'set_featured') {
            setFeaturedNews($conn, $data);
        } elseif ($postAction === 'remove_featured') {
            removeFeaturedNews($conn, $data);
        } elseif ($postAction === 'remove_all_featured') {
            removeAllFeaturedNews($conn);
        } else {
            sendResponse(400, false, 'Invalid action');
        }
    } elseif ($method === 'PUT' && $action === 'update') {
        updateNews($conn);
    } elseif ($method === 'DELETE' && $action === 'delete' && isset($_GET['id'])) {
        deleteNews($conn, $_GET['id']);
    } else {
        sendResponse(405, false, 'Method not allowed');
    }
    
} catch (Exception $e) {
    error_log('Exception: ' . $e->getMessage());
    sendResponse(500, false, 'Server error: ' . $e->getMessage());
}

// Functions
function getNewsList($conn) {
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    $sql = "SELECT b.*, k.nama_kategori, p.nama_lengkap as penulis 
            FROM berita b
            LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
            LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
            WHERE 1=1";
    
    if ($status) $sql .= " AND b.status = '" . $conn->real_escape_string($status) . "'";
    if ($search) $sql .= " AND b.judul LIKE '%" . $conn->real_escape_string($search) . "%'";
    
    $sql .= " ORDER BY b.tanggal_publish DESC LIMIT 50";
    
    $result = $conn->query($sql);
    $news = [];
    while ($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
    sendResponse(200, true, 'Success', $news);
}

function getNewsDetail($conn, $id) {
    $stmt = $conn->prepare("SELECT b.*, k.nama_kategori, p.nama_lengkap as penulis 
                            FROM berita b
                            LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
                            LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
                            WHERE b.id_berita = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        sendResponse(200, true, 'Success', $result->fetch_assoc());
    } else {
        sendResponse(404, false, 'News not found');
    }
}

function getNewsStats($conn) {
    $stats = [];
    $stats['total_news'] = $conn->query("SELECT COUNT(*) as c FROM berita")->fetch_assoc()['c'];
    $stats['total_views'] = $conn->query("SELECT SUM(views) as c FROM berita")->fetch_assoc()['c'] ?? 0;
    $stats['published_news'] = $conn->query("SELECT COUNT(*) as c FROM berita WHERE status='publish'")->fetch_assoc()['c'];
    $stats['draft_news'] = $conn->query("SELECT COUNT(*) as c FROM berita WHERE status='draft'")->fetch_assoc()['c'];
    sendResponse(200, true, 'Success', $stats);
}

function addNews($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['judul']) || empty($data['isi_berita']) || empty($data['id_kategori'])) {
        sendResponse(400, false, 'Missing required fields');
    }
    
    $judul = trim($data['judul']);
    $isi_berita = trim($data['isi_berita']);
    $id_kategori = intval($data['id_kategori']);
    $id_penulis = isset($data['id_penulis']) ? intval($data['id_penulis']) : 1;
    $gambar = isset($data['gambar']) ? trim($data['gambar']) : '';
    $status = isset($data['status']) ? $data['status'] : 'draft';
    
    // Generate slug
    $slug = strtolower($judul);
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');
    
    // Make slug unique
    $originalSlug = $slug;
    $counter = 1;
    while (true) {
        $check = $conn->query("SELECT id_berita FROM berita WHERE slug = '" . $conn->real_escape_string($slug) . "'");
        if ($check->num_rows == 0) break;
        $slug = $originalSlug . '-' . $counter++;
    }
    
    // Insert
    $stmt = $conn->prepare("INSERT INTO berita (judul, slug, isi_berita, id_kategori, id_penulis, gambar_utama, status, tanggal_publish) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssiiss", $judul, $slug, $isi_berita, $id_kategori, $id_penulis, $gambar, $status);
    
    if ($stmt->execute()) {
        sendResponse(201, true, 'Berita berhasil ditambahkan', ['id_berita' => $conn->insert_id, 'slug' => $slug]);
    } else {
        sendResponse(500, false, 'Failed: ' . $stmt->error);
    }
}

function updateNews($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id_berita']) || empty($data['judul']) || empty($data['isi_berita'])) {
        sendResponse(400, false, 'Missing required fields');
    }
    
    $id = intval($data['id_berita']);
    $judul = trim($data['judul']);
    $isi_berita = trim($data['isi_berita']);
    
    $sql = "UPDATE berita SET judul = ?, isi_berita = ?";
    $types = "ss";
    $params = [$judul, $isi_berita];
    
    if (isset($data['id_kategori'])) {
        $sql .= ", id_kategori = ?";
        $types .= "i";
        $params[] = intval($data['id_kategori']);
    }
    
    if (isset($data['gambar'])) {
        $sql .= ", gambar_utama = ?";
        $types .= "s";
        $params[] = trim($data['gambar']);
    }
    
    if (isset($data['status'])) {
        $sql .= ", status = ?";
        $types .= "s";
        $params[] = $data['status'];
    }
    
    $sql .= " WHERE id_berita = ?";
    $types .= "i";
    $params[] = $id;
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        sendResponse(200, true, 'Berita berhasil diupdate');
    } else {
        sendResponse(500, false, 'Failed: ' . $stmt->error);
    }
}

function deleteNews($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM berita WHERE id_berita = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        sendResponse(200, true, 'Berita berhasil dihapus');
    } else {
        sendResponse(500, false, 'Failed: ' . $stmt->error);
    }
}

// Featured News Management Functions
function setFeaturedNews($conn, $data) {
    if (!isset($data['id_berita'])) {
        sendResponse(400, false, 'Missing id_berita parameter');
    }
    
    $id_berita = intval($data['id_berita']);
    
    // First, remove featured status from all news
    $conn->query("UPDATE berita SET featured = 0");
    
    // Then set this news as featured
    $stmt = $conn->prepare("UPDATE berita SET featured = 1 WHERE id_berita = ?");
    $stmt->bind_param("i", $id_berita);
    
    if ($stmt->execute()) {
        sendResponse(200, true, 'Berita berhasil dijadikan berita utama');
    } else {
        sendResponse(500, false, 'Failed: ' . $stmt->error);
    }
}

function removeFeaturedNews($conn, $data) {
    if (!isset($data['id_berita'])) {
        sendResponse(400, false, 'Missing id_berita parameter');
    }
    
    $id_berita = intval($data['id_berita']);
    
    $stmt = $conn->prepare("UPDATE berita SET featured = 0 WHERE id_berita = ?");
    $stmt->bind_param("i", $id_berita);
    
    if ($stmt->execute()) {
        sendResponse(200, true, 'Status berita utama berhasil dihapus');
    } else {
        sendResponse(500, false, 'Failed: ' . $stmt->error);
    }
}

function removeAllFeaturedNews($conn) {
    if ($conn->query("UPDATE berita SET featured = 0")) {
        sendResponse(200, true, 'Semua status berita utama berhasil dihapus');
    } else {
        sendResponse(500, false, 'Failed: ' . $conn->error);
    }
}
?>
