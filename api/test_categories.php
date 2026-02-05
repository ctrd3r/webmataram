<?php
/**
 * Test file untuk Category API
 * Buka file ini di browser untuk test koneksi database dan API
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Test Category API</h1>";

// Test 1: Include config
echo "<h2>Test 1: Config File</h2>";
try {
    require_once 'config.php';
    echo "✅ Config file loaded successfully<br>";
} catch (Exception $e) {
    echo "❌ Error loading config: " . $e->getMessage() . "<br>";
    exit;
}

// Test 2: Database Connection
echo "<h2>Test 2: Database Connection</h2>";
try {
    $conn = getDBConnection();
    if ($conn) {
        echo "✅ Database connected successfully<br>";
        echo "Database: " . DB_NAME . "<br>";
        echo "Host: " . DB_HOST . "<br>";
        echo "Character Set: " . $conn->character_set_name() . "<br>";
    } else {
        echo "❌ Database connection failed<br>";
        echo "Check credentials in api/config.php<br>";
        exit;
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 3: Check if kategori table exists
echo "<h2>Test 3: Check Kategori Table</h2>";
try {
    $result = $conn->query("SHOW TABLES LIKE 'kategori'");
    if ($result->num_rows > 0) {
        echo "✅ Table 'kategori' exists<br>";
        
        // Show table structure
        $result = $conn->query("DESCRIBE kategori");
        echo "<table border='1' cellpadding='5'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "<td>" . $row['Default'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "❌ Table 'kategori' does not exist<br>";
        echo "Please run database/db_berita.sql first<br>";
        exit;
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 4: Count existing categories
echo "<h2>Test 4: Existing Categories</h2>";
try {
    $result = $conn->query("SELECT COUNT(*) as total FROM kategori");
    $row = $result->fetch_assoc();
    echo "Total categories: " . $row['total'] . "<br>";
    
    // Show all categories
    $result = $conn->query("SELECT * FROM kategori ORDER BY id_kategori");
    if ($result->num_rows > 0) {
        echo "<table border='1' cellpadding='5'>";
        echo "<tr><th>ID</th><th>Nama</th><th>Slug</th><th>Deskripsi</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['id_kategori'] . "</td>";
            echo "<td>" . $row['nama_kategori'] . "</td>";
            echo "<td>" . $row['slug_kategori'] . "</td>";
            echo "<td>" . ($row['deskripsi'] ?? '-') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 5: Test API endpoint
echo "<h2>Test 5: API Endpoint</h2>";
echo "API URL: <a href='manage_categories.php?action=list' target='_blank'>manage_categories.php?action=list</a><br>";
echo "Click the link above to test the API directly<br>";

echo "<h2>✅ All Tests Completed</h2>";
echo "<p>If all tests passed, the API should work correctly.</p>";
echo "<p>If you still get errors, check:</p>";
echo "<ul>";
echo "<li>Database credentials in api/config.php</li>";
echo "<li>Database 'db_berita' exists and has 'kategori' table</li>";
echo "<li>PHP has mysqli extension enabled</li>";
echo "<li>Browser console for JavaScript errors</li>";
echo "</ul>";

$conn->close();
?>
