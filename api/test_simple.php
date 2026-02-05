<?php
/**
 * Direct test of simple API
 */

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_GET['action'] = 'add';

// Create test data
$testData = [
    'judul' => 'Test Direct',
    'isi_berita' => 'Konten test',
    'id_kategori' => 1,
    'status' => 'draft',
    'gambar' => '',
    'id_penulis' => 1
];

// Mock php://input
file_put_contents('php://temp/test_input', json_encode($testData));

// Include the API
include 'manage_news_simple.php';
?>
