<?php
/**
 * Cache Manager
 * Tool untuk manage cache dari admin panel
 */

// Prevent any output before JSON
ob_start();

// Don't include config.php to avoid CORS headers and other output
// require_once 'config.php';
require_once 'cache_helper.php';

// Clear any previous output
ob_end_clean();

// Set JSON header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Simple JSON response function (since we're not including config.php)
function jsonResponse($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Check if user is admin (simple check - enhance with proper auth)
// Disable session for now to avoid errors
// session_start();
// if (!isset($_SESSION['admin_logged_in'])) {
//     jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
// }

$action = isset($_GET['action']) ? $_GET['action'] : 'stats';

try {
    $cache = cache();
    
    switch ($action) {
        case 'stats':
            $stats = $cache->getStats();
            jsonResponse([
                'success' => true,
                'data' => $stats
            ]);
            break;
            
        case 'clear':
            $cache->flush();
            jsonResponse([
                'success' => true,
                'message' => 'Cache cleared successfully'
            ]);
            break;
            
        case 'clear-expired':
            $cleared = $cache->clearExpired(300);
            jsonResponse([
                'success' => true,
                'message' => "Cleared $cleared expired cache files",
                'cleared_count' => $cleared
            ]);
            break;
            
        case 'clear-news':
            // Clear only news cache
            $cacheDir = sys_get_temp_dir() . '/bmkg_cache';
            
            // Create directory if not exists
            if (!is_dir($cacheDir)) {
                mkdir($cacheDir, 0755, true);
            }
            
            $files = glob($cacheDir . '/*');
            $cleared = 0;
            
            if ($files) {
                foreach ($files as $file) {
                    if (is_file($file) && strpos(basename($file), 'news_') === 0) {
                        unlink($file);
                        $cleared++;
                    }
                }
            }
            
            jsonResponse([
                'success' => true,
                'message' => "Cleared $cleared news cache files",
                'cleared_count' => $cleared
            ]);
            break;
            
        default:
            jsonResponse([
                'success' => false,
                'message' => 'Invalid action'
            ], 400);
    }
    
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
?>
