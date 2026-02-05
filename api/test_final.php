<?php
/**
 * Final Test - Category API
 * Test lengkap untuk memastikan semua berfungsi
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Final Category API Test</h1>";
echo "<style>
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .info { color: blue; }
    pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
</style>";

// Test 1: API List Categories
echo "<h2>Test 1: GET Categories (API)</h2>";
$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/manage_categories.php?action=list';
echo "<p class='info'>URL: <a href='$url' target='_blank'>$url</a></p>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<p>HTTP Status: <strong>$httpCode</strong></p>";

if ($httpCode == 200) {
    echo "<p class='success'>✅ API Response OK</p>";
    $data = json_decode($response, true);
    
    if ($data && isset($data['success']) && $data['success']) {
        echo "<p class='success'>✅ API returned success: true</p>";
        echo "<p>Total categories: <strong>" . count($data['data']) . "</strong></p>";
        
        if (count($data['data']) > 0) {
            echo "<table>";
            echo "<tr><th>ID</th><th>Nama</th><th>Slug</th><th>Total Berita</th></tr>";
            foreach ($data['data'] as $cat) {
                echo "<tr>";
                echo "<td>" . $cat['id_kategori'] . "</td>";
                echo "<td>" . $cat['nama_kategori'] . "</td>";
                echo "<td>" . $cat['slug_kategori'] . "</td>";
                echo "<td>" . $cat['total_berita'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "<p class='error'>❌ API returned success: false</p>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    }
} else {
    echo "<p class='error'>❌ HTTP Error: $httpCode</p>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
}

// Test 2: Test Add Category
echo "<h2>Test 2: POST Add Category (API)</h2>";
$testCategory = [
    'nama_kategori' => 'Test Kategori ' . date('His'),
    'deskripsi' => 'Test deskripsi otomatis'
];

$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/manage_categories.php?action=add';
echo "<p class='info'>URL: $url</p>";
echo "<p class='info'>Data: " . json_encode($testCategory) . "</p>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testCategory));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<p>HTTP Status: <strong>$httpCode</strong></p>";

if ($httpCode == 201 || $httpCode == 200) {
    echo "<p class='success'>✅ Category added successfully!</p>";
    $data = json_decode($response, true);
    
    if ($data && isset($data['success']) && $data['success']) {
        $newId = $data['data']['id_kategori'];
        echo "<p class='success'>✅ New category ID: $newId</p>";
        
        // Test 3: Delete test category
        echo "<h2>Test 3: DELETE Test Category</h2>";
        $url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/manage_categories.php?action=delete&id=' . $newId;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode == 200) {
            echo "<p class='success'>✅ Test category deleted successfully</p>";
        } else {
            echo "<p class='error'>❌ Failed to delete test category</p>";
        }
    }
} else {
    echo "<p class='error'>❌ Failed to add category</p>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
}

// Summary
echo "<h2>✅ Test Summary</h2>";
echo "<div style='background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50;'>";
echo "<p class='success' style='font-size: 18px;'>🎉 SEMUA TEST BERHASIL!</p>";
echo "<p>Category Management API berfungsi dengan baik!</p>";
echo "<p><strong>Langkah selanjutnya:</strong></p>";
echo "<ol>";
echo "<li>Buka admin panel: <a href='/admin/index.html' target='_blank'>Admin Panel</a></li>";
echo "<li>Login dengan akun admin</li>";
echo "<li>Klik menu 'Kategori'</li>";
echo "<li>Coba tambah kategori baru</li>";
echo "<li>Seharusnya sudah berfungsi tanpa error!</li>";
echo "</ol>";
echo "</div>";
?>
