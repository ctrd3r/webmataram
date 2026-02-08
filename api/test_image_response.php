<?php
/**
 * Test Image Response
 * Debug what API returns for images
 */

require_once 'config.php';

header('Content-Type: application/json');

try {
    $conn = getDBConnection();
    if (!$conn) {
        die(json_encode(['error' => 'Database connection failed']));
    }
    
    // Get first news item
    $result = $conn->query("SELECT id_berita, judul, gambar_utama FROM berita LIMIT 1");
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'database_row' => $row,
            'gambar_utama_value' => $row['gambar_utama'],
            'gambar_utama_type' => gettype($row['gambar_utama']),
            'gambar_utama_empty' => empty($row['gambar_utama']),
            'gambar_utama_is_null' => is_null($row['gambar_utama']),
            'test_mapping' => [
                'original' => $row['gambar_utama'],
                'mapped' => 'images/news/' . $row['gambar_utama']
            ]
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode(['error' => 'No news found in database']);
    }
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
