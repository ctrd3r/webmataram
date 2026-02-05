<?php
/**
 * Simplified News Management API for debugging
 */

// Start output buffering
ob_start();

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Send headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Simple response function
function sendResponse($code, $success, $message, $data = null) {
    if (ob_get_length()) ob_clean();
    http_response_code($code);
    $response = ['success' => $success, 'message' => $message];
    if ($data !== null) $response['data'] = $data;
    echo json_encode($response);
    exit();
}

// Catch fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) ob_clean();
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Fatal: ' . $error['message'] . ' in ' . basename($error['file']) . ':' . $error['line']
        ]);
    }
});

try {
    // Load config
    require_once 'config.php';
    
    // Get connection
    $conn = getDBConnection();
    if (!$conn) {
        sendResponse(500, false, 'Database connection failed');
    }
    
    // Check method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(405, false, 'Method not allowed');
    }
    
    // Get action
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    if ($action !== 'add') {
        sendResponse(400, false, 'Invalid action');
    }
    
    // Get POST data
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    
    if (!$data) {
        sendResponse(400, false, 'Invalid JSON data');
    }
    
    // Validate required fields
    if (empty($data['judul']) || empty($data['isi_berita']) || empty($data['id_kategori'])) {
        sendResponse(400, false, 'Missing required fields: judul, isi_berita, id_kategori');
    }
    
    // Extract data
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
    
    // Check if slug exists and make unique
    $originalSlug = $slug;
    $counter = 1;
    $checkStmt = $conn->prepare("SELECT id_berita FROM berita WHERE slug = ?");
    while (true) {
        $checkStmt->bind_param("s", $slug);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        if ($result->num_rows == 0) break;
        $slug = $originalSlug . '-' . $counter;
        $counter++;
    }
    
    // Insert news
    $stmt = $conn->prepare("INSERT INTO berita (judul, slug, isi_berita, id_kategori, id_penulis, gambar_utama, status, tanggal_publish) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    
    if (!$stmt) {
        sendResponse(500, false, 'Prepare failed: ' . $conn->error);
    }
    
    $stmt->bind_param("sssiiss", $judul, $slug, $isi_berita, $id_kategori, $id_penulis, $gambar, $status);
    
    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        sendResponse(201, true, 'Berita berhasil ditambahkan', ['id_berita' => $newId, 'slug' => $slug]);
    } else {
        sendResponse(500, false, 'Execute failed: ' . $stmt->error);
    }
    
} catch (Exception $e) {
    sendResponse(500, false, 'Exception: ' . $e->getMessage());
}
?>
