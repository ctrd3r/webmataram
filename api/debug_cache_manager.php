<?php
/**
 * Debug Cache Manager
 * Shows actual errors and response
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Debug Cache Manager</h1>";
echo "<hr>";

echo "<h2>Step 1: Check cache_helper.php</h2>";
if (file_exists('cache_helper.php')) {
    echo "✅ cache_helper.php exists<br>";
    require_once 'cache_helper.php';
    echo "✅ cache_helper.php loaded<br>";
} else {
    echo "❌ cache_helper.php NOT FOUND<br>";
    exit;
}

echo "<h2>Step 2: Test cache() function</h2>";
try {
    $cache = cache();
    echo "✅ cache() function works<br>";
    echo "Cache object type: " . get_class($cache) . "<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    exit;
}

echo "<h2>Step 3: Test getStats()</h2>";
try {
    $stats = $cache->getStats();
    echo "✅ getStats() works<br>";
    echo "<pre>";
    print_r($stats);
    echo "</pre>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<h2>Step 4: Test clearExpired()</h2>";
try {
    $cleared = $cache->clearExpired(300);
    echo "✅ clearExpired() works<br>";
    echo "Cleared: $cleared files<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<h2>Step 5: Test JSON Response</h2>";
$testData = [
    'success' => true,
    'message' => 'Test message',
    'data' => ['test' => 123]
];

echo "JSON output:<br>";
echo "<pre>";
echo json_encode($testData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
echo "</pre>";

echo "<h2>Step 6: Test cache_manager.php directly</h2>";
echo "<a href='cache_manager.php?action=stats' target='_blank'>Open cache_manager.php?action=stats</a><br>";
echo "<a href='cache_manager.php?action=clear-expired' target='_blank'>Open cache_manager.php?action=clear-expired</a><br>";

echo "<h2>Step 7: Check cache directory</h2>";
$cacheDir = sys_get_temp_dir() . '/bmkg_cache';
echo "Cache directory: $cacheDir<br>";

if (is_dir($cacheDir)) {
    echo "✅ Directory exists<br>";
    echo "Writable: " . (is_writable($cacheDir) ? "✅ Yes" : "❌ No") . "<br>";
    
    $files = glob($cacheDir . '/*');
    echo "Files count: " . count($files) . "<br>";
    
    if ($files) {
        echo "<ul>";
        foreach ($files as $file) {
            echo "<li>" . basename($file) . " (" . filesize($file) . " bytes)</li>";
        }
        echo "</ul>";
    }
} else {
    echo "❌ Directory does not exist<br>";
    echo "Attempting to create...<br>";
    
    if (mkdir($cacheDir, 0755, true)) {
        echo "✅ Directory created successfully<br>";
    } else {
        echo "❌ Failed to create directory<br>";
    }
}

echo "<hr>";
echo "<h2>✅ Debug Complete</h2>";
?>
