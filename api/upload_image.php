<?php
/**
 * Image Upload API with Optimization
 * Handles image uploads with automatic compression and resizing
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'image_optimizer.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No image file uploaded']);
        exit();
    }
    
    // Get optional parameters
    $prefix = isset($_POST['prefix']) ? $_POST['prefix'] : 'news';
    $maxWidth = isset($_POST['maxWidth']) ? intval($_POST['maxWidth']) : 1920;
    $maxHeight = isset($_POST['maxHeight']) ? intval($_POST['maxHeight']) : 1080;
    $quality = isset($_POST['quality']) ? intval($_POST['quality']) : 85;
    
    // Configure optimizer
    $config = [
        'maxWidth' => $maxWidth,
        'maxHeight' => $maxHeight,
        'jpegQuality' => $quality,
        'webpQuality' => $quality,
        'createWebP' => true
    ];
    
    // Optimize and upload image
    $result = optimizeImage($_FILES['image'], $prefix, $config);
    
    if ($result['success']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Image uploaded and optimized successfully',
            'data' => [
                'filename' => $result['filename'],
                'webp_filename' => $result['webp_filename'],
                'url' => 'images/news/' . $result['filename'],
                'webp_url' => $result['webp_filename'] ? 'images/news/' . $result['webp_filename'] : null,
                'original_size' => formatBytes($result['original_size']),
                'optimized_size' => formatBytes($result['optimized_size']),
                'savings' => $result['savings_percent'] . '%',
                'dimensions' => $result['new_dimensions'],
                'resized' => $result['resized']
            ]
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $result['message']
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

/**
 * Format bytes to human readable
 */
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}
?>
