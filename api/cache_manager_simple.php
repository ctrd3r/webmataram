<?php
/**
 * Simple Cache Manager (No Dependencies)
 * Direct implementation without external dependencies
 */

// Disable all error output
error_reporting(0);
ini_set('display_errors', 0);

// Clean any previous output
while (ob_get_level()) {
    ob_end_clean();
}

// Start output buffering
ob_start();

// Set headers first
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Simple JSON response
function respond($data, $code = 200) {
    // Clear any buffered output
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    // Set status code
    http_response_code($code);
    
    // Output JSON
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    
    // Ensure we have valid JSON
    if ($json === false) {
        $json = json_encode(['success' => false, 'message' => 'JSON encoding error']);
    }
    
    echo $json;
    exit;
}

// Get action
$action = isset($_GET['action']) ? $_GET['action'] : 'stats';

// Cache directory
$cacheDir = sys_get_temp_dir() . '/bmkg_cache';

// Create directory if not exists
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}

try {
    switch ($action) {
        case 'stats':
            $files = @glob($cacheDir . '/*') ?: [];
            $totalSize = 0;
            $totalFiles = 0;
            
            foreach ($files as $file) {
                if (is_file($file)) {
                    $totalSize += filesize($file);
                    $totalFiles++;
                }
            }
            
            respond([
                'success' => true,
                'data' => [
                    'total_files' => $totalFiles,
                    'total_size' => $totalSize,
                    'total_size_mb' => round($totalSize / 1024 / 1024, 2),
                    'cache_dir' => $cacheDir
                ]
            ]);
            break;
            
        case 'clear':
            $files = @glob($cacheDir . '/*') ?: [];
            $cleared = 0;
            
            foreach ($files as $file) {
                if (is_file($file)) {
                    @unlink($file);
                    $cleared++;
                }
            }
            
            respond([
                'success' => true,
                'message' => "Cleared $cleared cache files",
                'cleared_count' => $cleared
            ]);
            break;
            
        case 'clear-expired':
            $files = @glob($cacheDir . '/*') ?: [];
            $cleared = 0;
            $ttl = 300; // 5 minutes
            
            foreach ($files as $file) {
                if (is_file($file) && (time() - filemtime($file)) > $ttl) {
                    @unlink($file);
                    $cleared++;
                }
            }
            
            respond([
                'success' => true,
                'message' => "Cleared $cleared expired cache files",
                'cleared_count' => $cleared
            ]);
            break;
            
        case 'clear-news':
            $files = @glob($cacheDir . '/*') ?: [];
            $cleared = 0;
            
            foreach ($files as $file) {
                if (is_file($file) && strpos(basename($file), 'news_') === 0) {
                    @unlink($file);
                    $cleared++;
                }
            }
            
            respond([
                'success' => true,
                'message' => "Cleared $cleared news cache files",
                'cleared_count' => $cleared
            ]);
            break;
            
        default:
            respond([
                'success' => false,
                'message' => 'Invalid action. Use: stats, clear, clear-expired, or clear-news'
            ], 400);
    }
    
} catch (Exception $e) {
    respond([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
?>
