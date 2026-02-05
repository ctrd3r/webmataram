<?php
/**
 * Step-by-step API test
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Step-by-Step API Test</h1>";
echo "<pre>";

// Step 1: Check config.php
echo "Step 1: Loading config.php...\n";
try {
    require_once 'api/config.php';
    echo "✅ config.php loaded\n\n";
} catch (Exception $e) {
    echo "❌ Failed to load config.php: " . $e->getMessage() . "\n";
    exit;
}

// Step 2: Check database connection
echo "Step 2: Testing database connection...\n";
try {
    $conn = getDBConnection();
    if ($conn === null) {
        echo "❌ getDBConnection() returned null\n";
        exit;
    }
    if ($conn->connect_error) {
        echo "❌ Connection error: " . $conn->connect_error . "\n";
        exit;
    }
    echo "✅ Database connected\n";
    echo "   Host: " . DB_HOST . "\n";
    echo "   Database: " . DB_NAME . "\n";
    echo "   User: " . DB_USER . "\n\n";
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    exit;
}

// Step 3: Check if berita table exists
echo "Step 3: Checking berita table...\n";
try {
    $result = $conn->query("SHOW TABLES LIKE 'berita'");
    if ($result->num_rows > 0) {
        echo "✅ berita table exists\n\n";
    } else {
        echo "❌ berita table not found\n";
        exit;
    }
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    exit;
}

// Step 4: Check berita table structure
echo "Step 4: Checking berita table columns...\n";
try {
    $result = $conn->query("DESCRIBE berita");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    echo "✅ Columns: " . implode(', ', $columns) . "\n\n";
    
    // Check required columns
    $required = ['id_berita', 'judul', 'slug', 'isi_berita', 'id_kategori', 'id_penulis', 'gambar_utama', 'status', 'tanggal_publish'];
    $missing = array_diff($required, $columns);
    if (!empty($missing)) {
        echo "⚠️ Missing columns: " . implode(', ', $missing) . "\n\n";
    }
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    exit;
}

// Step 5: Test slug generation
echo "Step 5: Testing slug generation...\n";
try {
    // Define the function inline for testing
    function testGenerateSlug($title) {
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');
        return $slug;
    }
    
    $testTitle = "Test Berita 123";
    $slug = testGenerateSlug($testTitle);
    echo "✅ Slug generated: '$testTitle' → '$slug'\n\n";
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    exit;
}

// Step 6: Test INSERT query
echo "Step 6: Testing INSERT query...\n";
try {
    $judul = "Test Berita Step by Step";
    $slug = testGenerateSlug($judul);
    $isi_berita = "Ini adalah konten test.";
    $id_kategori = 1;
    $id_penulis = 1;
    $gambar = "";
    $status = "draft";
    
    $stmt = $conn->prepare("INSERT INTO berita (judul, slug, isi_berita, id_kategori, id_penulis, gambar_utama, status, tanggal_publish) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    
    if (!$stmt) {
        echo "❌ Prepare failed: " . $conn->error . "\n";
        exit;
    }
    
    $stmt->bind_param("sssiiss", $judul, $slug, $isi_berita, $id_kategori, $id_penulis, $gambar, $status);
    
    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        echo "✅ INSERT successful!\n";
        echo "   New ID: $newId\n";
        echo "   Slug: $slug\n\n";
        
        // Clean up - delete the test record
        $conn->query("DELETE FROM berita WHERE id_berita = $newId");
        echo "✅ Test record deleted\n\n";
    } else {
        echo "❌ Execute failed: " . $stmt->error . "\n";
        exit;
    }
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    exit;
}

echo "========================================\n";
echo "✅ ALL TESTS PASSED!\n";
echo "========================================\n";
echo "\nThe database and queries are working correctly.\n";
echo "The issue might be in the API file itself.\n";

echo "</pre>";
?>
