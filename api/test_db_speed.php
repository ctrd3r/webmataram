<?php
/**
 * Database Speed Test
 * Test query performance
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
require_once 'config.php';

try {
    $conn = getDBConnection();
    
    if (!$conn) {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed'
        ]);
        exit;
    }
    
    $tests = [];
    
    // Test 1: Simple SELECT
    $start = microtime(true);
    $result = $conn->query("SELECT COUNT(*) as total FROM berita");
    $end = microtime(true);
    $tests['simple_select'] = round(($end - $start) * 1000, 2);
    
    // Test 2: SELECT with WHERE
    $start = microtime(true);
    $result = $conn->query("SELECT * FROM berita WHERE status = 'publish' LIMIT 10");
    $end = microtime(true);
    $tests['select_with_where'] = round(($end - $start) * 1000, 2);
    
    // Test 3: SELECT with JOIN
    $start = microtime(true);
    $result = $conn->query("
        SELECT b.*, k.nama_kategori, p.nama_lengkap 
        FROM berita b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
        LIMIT 10
    ");
    $end = microtime(true);
    $tests['select_with_join'] = round(($end - $start) * 1000, 2);
    
    // Test 4: SELECT with ORDER BY
    $start = microtime(true);
    $result = $conn->query("
        SELECT * FROM berita 
        WHERE status = 'publish' 
        ORDER BY tanggal_publish DESC 
        LIMIT 10
    ");
    $end = microtime(true);
    $tests['select_with_order'] = round(($end - $start) * 1000, 2);
    
    // Calculate average
    $average = round(array_sum($tests) / count($tests), 2);
    
    echo json_encode([
        'success' => true,
        'tests' => $tests,
        'average' => $average,
        'unit' => 'ms'
    ]);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
