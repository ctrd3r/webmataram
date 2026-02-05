<?php
// Debug file untuk mengecek masalah berita
header('Content-Type: text/html; charset=utf-8');

echo "<h1>Debug Berita System</h1>";

// Test 1: Database Connection
echo "<h2>1. Test Database Connection</h2>";
try {
    require_once 'api/config.php';
    $database = new Database();
    $db = $database->getConnection();
    echo "✅ Database connection: SUCCESS<br>";
} catch (Exception $e) {
    echo "❌ Database connection: FAILED - " . $e->getMessage() . "<br>";
}

// Test 2: Check Tables
echo "<h2>2. Check Database Tables</h2>";
try {
    $tables = ['berita', 'kategori', 'penulis'];
    foreach ($tables as $table) {
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
        $stmt->execute();
        $result = $stmt->fetch();
        echo "✅ Table '$table': {$result['count']} records<br>";
    }
} catch (Exception $e) {
    echo "❌ Table check: FAILED - " . $e->getMessage() . "<br>";
}

// Test 3: Sample News Query
echo "<h2>3. Test News Query</h2>";
try {
    $query = "
        SELECT 
            b.id_berita,
            b.judul,
            b.slug,
            b.ringkasan,
            b.views,
            b.tanggal_publish,
            k.nama_kategori as kategori,
            p.nama_lengkap as penulis
        FROM berita b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
        WHERE b.status = 'publish'
        ORDER BY b.tanggal_publish DESC
        LIMIT 3
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $news = $stmt->fetchAll();
    
    echo "✅ News query: SUCCESS - Found " . count($news) . " articles<br>";
    
    if (count($news) > 0) {
        echo "<h3>Sample Articles:</h3>";
        echo "<ul>";
        foreach ($news as $item) {
            echo "<li><strong>{$item['judul']}</strong> - {$item['kategori']} - {$item['penulis']}</li>";
        }
        echo "</ul>";
    } else {
        echo "⚠️ No published articles found in database<br>";
    }
    
} catch (Exception $e) {
    echo "❌ News query: FAILED - " . $e->getMessage() . "<br>";
}

// Test 4: API Endpoint
echo "<h2>4. Test API Endpoint</h2>";
echo "<a href='api/get_news.php?limit=3' target='_blank'>Test API: api/get_news.php?limit=3</a><br>";

// Test 5: JavaScript Console Check
echo "<h2>5. JavaScript Console Check</h2>";
echo "<p>Open browser console (F12) and check for JavaScript errors when loading berita.html</p>";

// Test 6: File Permissions
echo "<h2>6. File Permissions</h2>";
$files = ['berita.html', 'berita.js', 'api/get_news.php', 'api/config.php'];
foreach ($files as $file) {
    if (file_exists($file)) {
        echo "✅ File '$file': EXISTS<br>";
    } else {
        echo "❌ File '$file': NOT FOUND<br>";
    }
}

echo "<hr>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>If database connection fails, check MySQL service and credentials</li>";
echo "<li>If no articles found, add sample data using admin panel</li>";
echo "<li>If API fails, check PHP error logs</li>";
echo "<li>If JavaScript errors, check browser console</li>";
echo "</ol>";
?>