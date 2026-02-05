<?php
/**
 * Test Manage News API
 * Debug why admin panel shows empty data
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Test Manage News API</h1>";
echo "<style>
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .info { color: blue; }
    pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
</style>";

require_once 'config.php';

// Test 1: Check database directly
echo "<h2>Test 1: Check Database Directly</h2>";
$conn = getDBConnection();

if (!$conn) {
    echo "<p class='error'>❌ Database connection failed!</p>";
    exit;
}

$result = $conn->query("SELECT COUNT(*) as total FROM berita");
$row = $result->fetch_assoc();
echo "<p>Total berita in database: <strong>{$row['total']}</strong></p>";

if ($row['total'] == 0) {
    echo "<p class='error'>❌ No news in database!</p>";
    echo "<p>Run: <a href='/database/add_sample_news.php'>Add Sample News</a></p>";
    exit;
}

// Show all news
echo "<h3>All News in Database:</h3>";
$result = $conn->query("
    SELECT 
        b.id_berita,
        b.judul,
        b.slug,
        b.status,
        b.id_kategori,
        b.id_penulis,
        k.nama_kategori,
        p.nama_lengkap as penulis
    FROM berita b
    LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
    LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
    ORDER BY b.id_berita DESC
");

echo "<table>";
echo "<tr><th>ID</th><th>Judul</th><th>Kategori</th><th>Penulis</th><th>Status</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>{$row['id_berita']}</td>";
    echo "<td>" . htmlspecialchars($row['judul']) . "</td>";
    echo "<td>" . ($row['nama_kategori'] ?? 'NULL') . " (ID: {$row['id_kategori']})</td>";
    echo "<td>" . ($row['penulis'] ?? 'NULL') . " (ID: {$row['id_penulis']})</td>";
    echo "<td>{$row['status']}</td>";
    echo "</tr>";
}
echo "</table>";

// Test 2: Check if penulis table has data
echo "<h2>Test 2: Check Penulis Table</h2>";
$result = $conn->query("SELECT COUNT(*) as total FROM penulis");
$row = $result->fetch_assoc();
echo "<p>Total penulis: <strong>{$row['total']}</strong></p>";

if ($row['total'] == 0) {
    echo "<p class='error'>⚠️ No penulis (authors) in database!</p>";
    echo "<p>This might cause issues. Adding default penulis...</p>";
    
    // Add default penulis
    $conn->query("
        INSERT INTO penulis (nama_lengkap, email, bio, foto_profil)
        VALUES ('Admin BMKG', 'admin@bmkg.go.id', 'Administrator BMKG', 'admin.jpg')
    ");
    
    echo "<p class='success'>✅ Default penulis added</p>";
}

// Test 3: Test API endpoint directly
echo "<h2>Test 3: Test API Endpoint</h2>";
$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/manage_news.php?action=list';
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
    
    if ($data === null) {
        echo "<p class='error'>❌ Invalid JSON response!</p>";
        echo "<h3>Raw Response:</h3>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    } else {
        if (isset($data['success']) && $data['success']) {
            echo "<p class='success'>✅ API returned success: true</p>";
            echo "<p>News count in response: <strong>" . count($data['data']) . "</strong></p>";
            
            if (count($data['data']) > 0) {
                echo "<h3>News Data from API:</h3>";
                echo "<table>";
                echo "<tr><th>ID</th><th>Judul</th><th>Kategori</th><th>Penulis</th><th>Status</th></tr>";
                foreach ($data['data'] as $news) {
                    echo "<tr>";
                    echo "<td>{$news['id_berita']}</td>";
                    echo "<td>" . htmlspecialchars($news['judul']) . "</td>";
                    echo "<td>" . htmlspecialchars($news['nama_kategori'] ?? 'N/A') . "</td>";
                    echo "<td>" . htmlspecialchars($news['penulis'] ?? 'N/A') . "</td>";
                    echo "<td>{$news['status']}</td>";
                    echo "</tr>";
                }
                echo "</table>";
                
                echo "<h3>Sample JSON:</h3>";
                echo "<pre>" . json_encode($data['data'][0], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
            } else {
                echo "<p class='error'>❌ API returned empty data array!</p>";
            }
        } else {
            echo "<p class='error'>❌ API returned success: false</p>";
            echo "<p>Message: " . ($data['message'] ?? 'No message') . "</p>";
        }
        
        echo "<h3>Full API Response:</h3>";
        echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    }
} else {
    echo "<p class='error'>❌ HTTP Error: $httpCode</p>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
}

// Test 4: Test stats endpoint
echo "<h2>Test 4: Test Stats Endpoint</h2>";
$url = 'http://' . $_SERVER['HTTP_HOST'] . '/api/manage_news.php?action=stats';
echo "<p class='info'>URL: <a href='$url' target='_blank'>$url</a></p>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($data && isset($data['success']) && $data['success']) {
    echo "<p class='success'>✅ Stats API OK</p>";
    echo "<pre>" . json_encode($data['data'], JSON_PRETTY_PRINT) . "</pre>";
}

// Test 5: Check browser console simulation
echo "<h2>Test 5: JavaScript Fetch Simulation</h2>";
echo "<p>This simulates what admin panel JavaScript does:</p>";
echo "<button onclick='testAdminFetch()'>Test Admin Panel Fetch</button>";
echo "<div id='fetchResult'></div>";

echo "<script>
async function testAdminFetch() {
    const resultDiv = document.getElementById('fetchResult');
    resultDiv.innerHTML = '<p>Loading...</p>';
    
    try {
        const response = await fetch('../api/manage_news.php?action=list');
        const result = await response.json();
        
        if (result.success) {
            resultDiv.innerHTML = `
                <p style='color: green; font-weight: bold;'>✅ Fetch successful!</p>
                <p>News count: <strong>${result.data.length}</strong></p>
                <pre>${JSON.stringify(result, null, 2)}</pre>
            `;
        } else {
            resultDiv.innerHTML = `
                <p style='color: red; font-weight: bold;'>❌ API returned error</p>
                <p>Message: ${result.message}</p>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <p style='color: red; font-weight: bold;'>❌ Fetch error</p>
            <p>${error.message}</p>
        `;
    }
}
</script>";

echo "<h2>Summary</h2>";
echo "<p>If API returns data but admin panel is empty, check:</p>";
echo "<ol>";
echo "<li>Browser console (F12) for JavaScript errors</li>";
echo "<li>Network tab to see if API is being called</li>";
echo "<li>Clear browser cache (Ctrl+Shift+Delete)</li>";
echo "<li>Hard refresh admin panel (Ctrl+F5)</li>";
echo "</ol>";

$conn->close();
?>
