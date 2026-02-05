<?php
/**
 * Test Berita Synchronization
 * Verify that berita.html will show data from database
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Test Berita Synchronization</h1>";
echo "<style>
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .info { color: blue; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
    pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; overflow-x: auto; }
</style>";

// Test 1: Check if featured column exists
echo "<h2>Test 1: Check 'featured' Column</h2>";
require_once 'config.php';
$conn = getDBConnection();

if (!$conn) {
    echo "<p class='error'>❌ Database connection failed!</p>";
    exit;
}

$result = $conn->query("SHOW COLUMNS FROM berita LIKE 'featured'");
if ($result->num_rows > 0) {
    echo "<p class='success'>✅ Column 'featured' exists</p>";
} else {
    echo "<p class='error'>❌ Column 'featured' NOT FOUND!</p>";
    echo "<p class='info'>Run: <code>database/add_featured_column.sql</code></p>";
}

// Test 2: Check published news count
echo "<h2>Test 2: Published News Count</h2>";
$result = $conn->query("SELECT COUNT(*) as total FROM berita WHERE status = 'publish'");
$row = $result->fetch_assoc();
$totalPublished = $row['total'];

echo "<p>Total published news: <strong>$totalPublished</strong></p>";

if ($totalPublished == 0) {
    echo "<p class='error'>⚠️ No published news found!</p>";
    echo "<p class='info'>Add some news via admin panel with status 'Publish'</p>";
} else {
    echo "<p class='success'>✅ Found $totalPublished published news</p>";
}

// Test 3: Test get_news.php API
echo "<h2>Test 3: Test get_news.php API</h2>";
$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/get_news.php?limit=5';
echo "<p class='info'>URL: <a href='$url' target='_blank'>$url</a></p>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<p>HTTP Status: <strong>$httpCode</strong></p>";

if ($httpCode == 200) {
    echo "<p class='success'>✅ API Response OK</p>";
    $data = json_decode($response, true);
    
    if ($data && isset($data['success']) && $data['success']) {
        echo "<p class='success'>✅ API returned success: true</p>";
        echo "<p>News count: <strong>" . count($data['data']) . "</strong></p>";
        
        if (count($data['data']) > 0) {
            echo "<h3>Sample News Data:</h3>";
            echo "<table>";
            echo "<tr><th>ID</th><th>Judul</th><th>Kategori</th><th>Status</th><th>Views</th><th>Featured</th></tr>";
            foreach ($data['data'] as $news) {
                $featured = $news['featured'] ? '⭐ Yes' : 'No';
                echo "<tr>";
                echo "<td>" . $news['id_berita'] . "</td>";
                echo "<td>" . htmlspecialchars($news['judul']) . "</td>";
                echo "<td>" . htmlspecialchars($news['kategori']) . "</td>";
                echo "<td>Publish</td>";
                echo "<td>" . $news['views'] . "</td>";
                echo "<td>" . $featured . "</td>";
                echo "</tr>";
            }
            echo "</table>";
            
            echo "<h3>Sample JSON Response:</h3>";
            echo "<pre>" . json_encode($data['data'][0], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
        }
    } else {
        echo "<p class='error'>❌ API returned success: false</p>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    }
} else {
    echo "<p class='error'>❌ HTTP Error: $httpCode</p>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
}

// Test 4: Test get_categories.php API
echo "<h2>Test 4: Test get_categories.php API</h2>";
$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/get_categories.php';
echo "<p class='info'>URL: <a href='$url' target='_blank'>$url</a></p>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    $data = json_decode($response, true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "<p class='success'>✅ Categories API OK - " . count($data['data']) . " categories found</p>";
        
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
}

// Test 5: Test featured news
echo "<h2>Test 5: Test Featured News</h2>";
$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/get_news.php?featured=true&limit=1';
echo "<p class='info'>URL: <a href='$url' target='_blank'>$url</a></p>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($data && isset($data['success']) && $data['success']) {
    if (count($data['data']) > 0) {
        echo "<p class='success'>✅ Featured news found!</p>";
        echo "<p><strong>Featured:</strong> " . htmlspecialchars($data['data'][0]['judul']) . "</p>";
    } else {
        echo "<p class='error'>⚠️ No featured news found</p>";
        echo "<p class='info'>Mark a news as featured in admin panel</p>";
    }
}

// Summary
echo "<h2>Summary & Next Steps</h2>";
echo "<div style='background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3;'>";

if ($totalPublished > 0) {
    echo "<p class='success'>✅ berita.html is ready to show data from database!</p>";
    echo "<ol>";
    echo "<li>Open: <a href='/berita.html' target='_blank'>berita.html</a></li>";
    echo "<li>You should see $totalPublished published news</li>";
    echo "<li>Category filter should work</li>";
    echo "<li>Search should work</li>";
    echo "</ol>";
} else {
    echo "<p class='error'>⚠️ No published news to display</p>";
    echo "<p><strong>Action needed:</strong></p>";
    echo "<ol>";
    echo "<li>Login to <a href='/admin/index.html' target='_blank'>Admin Panel</a></li>";
    echo "<li>Go to 'Manajemen Berita'</li>";
    echo "<li>Add some news with status 'Publish'</li>";
    echo "<li>Refresh berita.html</li>";
    echo "</ol>";
}

echo "</div>";

$conn->close();
?>
