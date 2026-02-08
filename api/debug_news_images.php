<?php
/**
 * Debug News Images
 * Check what's in database and what API returns
 */

require_once 'config.php';

header('Content-Type: application/json');

try {
    $conn = getDBConnection();
    if (!$conn) {
        die(json_encode(['error' => 'Database connection failed']));
    }
    
    // Check database structure
    $columns_result = $conn->query("DESCRIBE berita");
    $columns = [];
    while ($col = $columns_result->fetch_assoc()) {
        $columns[] = $col['Field'];
    }
    
    // Get all news with all fields
    $news_result = $conn->query("SELECT * FROM berita LIMIT 5");
    $news_data = [];
    
    while ($row = $news_result->fetch_assoc()) {
        $news_data[] = $row;
    }
    
    // Test API response
    $api_response = [];
    foreach ($news_data as $item) {
        $api_item = $item;
        // Simulate what API does
        if (!isset($api_item['gambar_url']) && isset($api_item['gambar_utama'])) {
            $api_item['gambar_url'] = 'images/news/' . $api_item['gambar_utama'];
        }
        $api_response[] = $api_item;
    }
    
    echo json_encode([
        'database_columns' => $columns,
        'raw_database_data' => $news_data,
        'api_response_simulation' => $api_response,
        'debug_info' => [
            'total_news' => count($news_data),
            'first_news_gambar_utama' => $news_data[0]['gambar_utama'] ?? 'NOT FOUND',
            'first_news_gambar_utama_empty' => empty($news_data[0]['gambar_utama'] ?? null),
            'first_news_gambar_utama_null' => is_null($news_data[0]['gambar_utama'] ?? null)
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
}
?>
