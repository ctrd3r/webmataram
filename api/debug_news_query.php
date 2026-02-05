<?php
/**
 * Debug News Query
 * Find exact SQL error
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Debug News Query</h1>";
echo "<style>
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; }
</style>";

require_once 'config.php';

$conn = getDBConnection();

if (!$conn) {
    echo "<p class='error'>❌ Connection failed!</p>";
    exit;
}

// Test 1: Check berita table structure
echo "<h2>Test 1: Berita Table Structure</h2>";
$result = $conn->query("DESCRIBE berita");
echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>{$row['Field']}</td>";
    echo "<td>{$row['Type']}</td>";
    echo "<td>{$row['Null']}</td>";
    echo "<td>{$row['Key']}</td>";
    echo "<td>" . ($row['Default'] ?? 'NULL') . "</td>";
    echo "</tr>";
}
echo "</table>";

// Test 2: Try the exact query from manage_news.php
echo "<h2>Test 2: Execute Exact Query</h2>";

$sql = "SELECT 
            b.id_berita,
            b.judul,
            b.isi_berita,
            b.gambar,
            b.tanggal_publish,
            b.status,
            b.views,
            k.nama_kategori,
            k.id_kategori,
            p.nama_lengkap as penulis
        FROM berita b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
        WHERE 1=1
        ORDER BY b.tanggal_publish DESC
        LIMIT 50";

echo "<p><strong>SQL Query:</strong></p>";
echo "<pre>" . htmlspecialchars($sql) . "</pre>";

$result = $conn->query($sql);

if ($result === false) {
    echo "<p class='error'>❌ Query FAILED!</p>";
    echo "<p><strong>MySQL Error:</strong> " . $conn->error . "</p>";
    echo "<p><strong>MySQL Error Number:</strong> " . $conn->errno . "</p>";
    
    // Try to identify the problem
    echo "<h3>Troubleshooting:</h3>";
    
    // Check if columns exist
    $columns = ['id_berita', 'judul', 'isi_berita', 'gambar', 'tanggal_publish', 'status', 'views'];
    echo "<p>Checking if columns exist in berita table:</p>";
    echo "<ul>";
    foreach ($columns as $col) {
        $check = $conn->query("SHOW COLUMNS FROM berita LIKE '$col'");
        if ($check->num_rows > 0) {
            echo "<li class='success'>✅ $col exists</li>";
        } else {
            echo "<li class='error'>❌ $col NOT FOUND!</li>";
        }
    }
    echo "</ul>";
    
} else {
    echo "<p class='success'>✅ Query SUCCESS!</p>";
    echo "<p>Rows returned: <strong>" . $result->num_rows . "</strong></p>";
    
    if ($result->num_rows > 0) {
        echo "<h3>Results:</h3>";
        echo "<table border='1' cellpadding='5' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr>";
        echo "<th>ID</th><th>Judul</th><th>Kategori</th><th>Penulis</th><th>Status</th><th>Views</th>";
        echo "</tr>";
        
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>{$row['id_berita']}</td>";
            echo "<td>" . htmlspecialchars($row['judul']) . "</td>";
            echo "<td>" . htmlspecialchars($row['nama_kategori'] ?? 'NULL') . "</td>";
            echo "<td>" . htmlspecialchars($row['penulis'] ?? 'NULL') . "</td>";
            echo "<td>{$row['status']}</td>";
            echo "<td>{$row['views']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Show JSON format
        $result->data_seek(0); // Reset pointer
        $news = [];
        while ($row = $result->fetch_assoc()) {
            $news[] = $row;
        }
        
        echo "<h3>JSON Format (what API should return):</h3>";
        echo "<pre>" . json_encode([
            'success' => true,
            'message' => 'News retrieved successfully',
            'data' => $news
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    }
}

// Test 3: Simple query
echo "<h2>Test 3: Simple Query (no joins)</h2>";
$result = $conn->query("SELECT * FROM berita LIMIT 5");
if ($result) {
    echo "<p class='success'>✅ Simple query works! Rows: " . $result->num_rows . "</p>";
} else {
    echo "<p class='error'>❌ Even simple query failed: " . $conn->error . "</p>";
}

// Test 4: Check if views column exists and has correct type
echo "<h2>Test 4: Check 'views' Column</h2>";
$result = $conn->query("SHOW COLUMNS FROM berita LIKE 'views'");
if ($result->num_rows > 0) {
    $col = $result->fetch_assoc();
    echo "<p class='success'>✅ 'views' column exists</p>";
    echo "<p>Type: <strong>{$col['Type']}</strong></p>";
    echo "<p>Default: <strong>" . ($col['Default'] ?? 'NULL') . "</strong></p>";
} else {
    echo "<p class='error'>❌ 'views' column NOT FOUND!</p>";
    echo "<p>This column needs to be added:</p>";
    echo "<pre>ALTER TABLE berita ADD COLUMN views INT DEFAULT 0;</pre>";
}

$conn->close();
?>
