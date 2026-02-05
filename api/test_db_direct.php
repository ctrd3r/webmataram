<?php
/**
 * Direct Database Connection Test
 * Test koneksi database tanpa config.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Direct Database Connection Test</h1>";

// Database credentials - sesuaikan dengan server Anda
$db_host = 'localhost';
$db_user = 'bmkg_user';  // Ganti jika berbeda
$db_pass = 'bmkg_pass_2024';  // Ganti jika berbeda
$db_name = 'db_berita';

echo "<h2>Test 1: MySQLi Connection</h2>";
echo "Host: $db_host<br>";
echo "User: $db_user<br>";
echo "Database: $db_name<br><br>";

// Test mysqli connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo "❌ Connection failed: " . $conn->connect_error . "<br>";
    echo "<p style='color: red;'>GAGAL! Periksa kredensial database Anda.</p>";
    exit;
} else {
    echo "✅ Database connected successfully!<br>";
    echo "Character set: " . $conn->character_set_name() . "<br>";
}

echo "<h2>Test 2: Check Table 'kategori'</h2>";
$result = $conn->query("SHOW TABLES LIKE 'kategori'");
if ($result->num_rows > 0) {
    echo "✅ Table 'kategori' exists<br><br>";
    
    // Show table structure
    $result = $conn->query("DESCRIBE kategori");
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    echo "<tr style='background: #f0f0f0;'><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['Field'] . "</td>";
        echo "<td>" . $row['Type'] . "</td>";
        echo "<td>" . $row['Null'] . "</td>";
        echo "<td>" . $row['Key'] . "</td>";
        echo "</tr>";
    }
    echo "</table><br>";
} else {
    echo "❌ Table 'kategori' does not exist<br>";
    echo "<p style='color: red;'>Jalankan database/db_berita.sql terlebih dahulu!</p>";
    exit;
}

echo "<h2>Test 3: Count Categories</h2>";
$result = $conn->query("SELECT COUNT(*) as total FROM kategori");
$row = $result->fetch_assoc();
echo "Total categories: <strong>" . $row['total'] . "</strong><br><br>";

// Show all categories
$result = $conn->query("SELECT * FROM kategori ORDER BY id_kategori");
if ($result->num_rows > 0) {
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    echo "<tr style='background: #f0f0f0;'><th>ID</th><th>Nama</th><th>Slug</th><th>Deskripsi</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id_kategori'] . "</td>";
        echo "<td>" . $row['nama_kategori'] . "</td>";
        echo "<td>" . $row['slug_kategori'] . "</td>";
        echo "<td>" . ($row['deskripsi'] ?? '-') . "</td>";
        echo "</tr>";
    }
    echo "</table><br>";
} else {
    echo "<p>Belum ada kategori.</p>";
}

echo "<h2>Test 4: Test INSERT</h2>";
$test_name = "Test Kategori " . date('His');
$test_slug = "test-kategori-" . date('His');
$test_desc = "Test deskripsi";

$stmt = $conn->prepare("INSERT INTO kategori (nama_kategori, slug_kategori, deskripsi) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $test_name, $test_slug, $test_desc);

if ($stmt->execute()) {
    $new_id = $conn->insert_id;
    echo "✅ Test INSERT berhasil! ID: $new_id<br>";
    
    // Delete test data
    $conn->query("DELETE FROM kategori WHERE id_kategori = $new_id");
    echo "✅ Test data berhasil dihapus<br>";
} else {
    echo "❌ Test INSERT gagal: " . $stmt->error . "<br>";
}

echo "<h2>✅ All Tests Completed!</h2>";
echo "<p style='color: green; font-weight: bold;'>Database connection dan table kategori berfungsi dengan baik!</p>";
echo "<p>Sekarang coba tambah kategori dari admin panel.</p>";

$conn->close();
?>
