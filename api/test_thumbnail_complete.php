<?php
/**
 * Complete Thumbnail Test
 * Tests database, API response, and file existence
 */

require_once 'config.php';

header('Content-Type: application/json');

try {
    $conn = getDBConnection();
    if (!$conn) {
        die(json_encode(['error' => 'Database connection failed', 'success' => false]));
    }
    
    // 1. Check if images/news directory exists
    $images_dir = __DIR__ . '/../images/news';
    $dir_exists = is_dir($images_dir);
    $dir_writable = is_writable($images_dir);
    
    // 2. Get first news item
    $result = $conn->query("SELECT id_berita, judul, gambar_utama FROM berita LIMIT 1");
    
    if ($result->num_rows === 0) {
        die(json_encode([
            'success' => false,
            'error' => 'No news found in database',
            'directory_check' => [
                'path' => $images_dir,
                'exists' => $dir_exists,
                'writable' => $dir_writable
            ]
        ]));
    }
    
    $news = $result->fetch_assoc();
    $gambar_utama = $news['gambar_utama'];
    $file_path = $images_dir . '/' . $gambar_utama;
    $file_exists = file_exists($file_path);
    $file_size = $file_exists ? filesize($file_path) : 0;
    
    // 3. Simulate API response
    $api_response = $news;
    if (!isset($api_response['gambar_url']) && isset($api_response['gambar_utama'])) {
        $api_response['gambar_url'] = $api_response['gambar_utama'];
    }
    
    // 4. Test frontend path construction
    $frontend_path_admin = '../images/news/' . ($api_response['gambar_url'] || $api_response['gambar_utama'] || 'placeholder-news.jpg');
    
    echo json_encode([
        'success' => true,
        'database' => [
            'id_berita' => $news['id_berita'],
            'judul' => $news['judul'],
            'gambar_utama' => $gambar_utama,
            'gambar_utama_empty' => empty($gambar_utama),
            'gambar_utama_null' => is_null($gambar_utama)
        ],
        'api_response' => $api_response,
        'file_system' => [
            'images_dir' => $images_dir,
            'dir_exists' => $dir_exists,
            'dir_writable' => $dir_writable,
            'file_path' => $file_path,
            'file_exists' => $file_exists,
            'file_size_bytes' => $file_size,
            'file_size_kb' => round($file_size / 1024, 2)
        ],
        'frontend_paths' => [
            'admin_panel_path' => $frontend_path_admin,
            'expected_full_path' => 'images/news/' . $gambar_utama
        ],
        'diagnostics' => [
            'issue_1_empty_filename' => empty($gambar_utama) ? 'YES - gambar_utama is empty!' : 'NO - filename exists',
            'issue_2_file_missing' => !$file_exists ? 'YES - file not found at ' . $file_path : 'NO - file exists',
            'issue_3_path_construction' => 'Frontend constructs: ' . $frontend_path_admin,
            'recommendation' => $file_exists ? 'File exists - check browser console for errors' : 'File missing - check upload process'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
