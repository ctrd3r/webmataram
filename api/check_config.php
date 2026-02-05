<?php
/**
 * Check Config File Status
 * Verifikasi apakah config.php sudah benar
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Config File Checker</h1>";
echo "<style>
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .warning { color: orange; font-weight: bold; }
    pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; }
</style>";

// Check if config.php exists
echo "<h2>1. Check File Exists</h2>";
if (file_exists('config.php')) {
    echo "<p class='success'>✅ config.php exists</p>";
} else {
    echo "<p class='error'>❌ config.php NOT FOUND!</p>";
    exit;
}

// Check if file is readable
echo "<h2>2. Check File Readable</h2>";
if (is_readable('config.php')) {
    echo "<p class='success'>✅ config.php is readable</p>";
} else {
    echo "<p class='error'>❌ config.php is NOT readable!</p>";
    exit;
}

// Check file size
echo "<h2>3. Check File Size</h2>";
$filesize = filesize('config.php');
echo "<p>File size: <strong>" . number_format($filesize) . " bytes</strong></p>";
if ($filesize < 1000) {
    echo "<p class='warning'>⚠️ File seems too small. Expected ~6-7 KB</p>";
}

// Check last modified
echo "<h2>4. Check Last Modified</h2>";
$mtime = filemtime('config.php');
echo "<p>Last modified: <strong>" . date('Y-m-d H:i:s', $mtime) . "</strong></p>";

// Try to include config.php
echo "<h2>5. Try to Include config.php</h2>";
try {
    // Suppress headers for this test
    ob_start();
    require_once 'config.php';
    $output = ob_get_clean();
    
    echo "<p class='success'>✅ config.php included successfully</p>";
    
    if (!empty($output)) {
        echo "<p class='warning'>⚠️ Config file produced output (headers):</p>";
        echo "<pre>" . htmlspecialchars($output) . "</pre>";
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Error including config.php: " . $e->getMessage() . "</p>";
    exit;
}

// Check if constants are defined
echo "<h2>6. Check Constants</h2>";
$constants = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_CHARSET'];
foreach ($constants as $const) {
    if (defined($const)) {
        $value = constant($const);
        if ($const === 'DB_PASS') {
            $value = str_repeat('*', strlen($value)); // Hide password
        }
        echo "<p class='success'>✅ $const = '$value'</p>";
    } else {
        echo "<p class='error'>❌ $const NOT DEFINED!</p>";
    }
}

// Check if getDBConnection function exists
echo "<h2>7. Check getDBConnection Function</h2>";
if (function_exists('getDBConnection')) {
    echo "<p class='success'>✅ getDBConnection() function EXISTS!</p>";
    
    // Try to call it
    echo "<h3>7.1 Test getDBConnection()</h3>";
    try {
        $conn = getDBConnection();
        if ($conn) {
            echo "<p class='success'>✅ getDBConnection() returned connection object</p>";
            echo "<p>Connection type: " . get_class($conn) . "</p>";
            echo "<p>Character set: " . $conn->character_set_name() . "</p>";
            
            // Test query
            $result = $conn->query("SELECT 1 as test");
            if ($result) {
                echo "<p class='success'>✅ Test query successful</p>";
            } else {
                echo "<p class='error'>❌ Test query failed</p>";
            }
            
            $conn->close();
        } else {
            echo "<p class='error'>❌ getDBConnection() returned NULL</p>";
            echo "<p>Check database credentials!</p>";
        }
    } catch (Exception $e) {
        echo "<p class='error'>❌ Error calling getDBConnection(): " . $e->getMessage() . "</p>";
    }
} else {
    echo "<p class='error'>❌ getDBConnection() function NOT FOUND!</p>";
    echo "<p class='warning'>⚠️ This is the problem! Function needs to be added to config.php</p>";
    
    echo "<h3>Solution:</h3>";
    echo "<p>Add this function to config.php (before the closing ?>):</p>";
    echo "<pre>";
    echo htmlspecialchars('
// Helper function for mysqli connection
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        error_log(\'Database connection failed: \' . $conn->connect_error);
        return null;
    }
    
    $conn->set_charset(DB_CHARSET);
    return $conn;
}
');
    echo "</pre>";
}

// Check Database class
echo "<h2>8. Check Database Class</h2>";
if (class_exists('Database')) {
    echo "<p class='success'>✅ Database class exists</p>";
} else {
    echo "<p class='error'>❌ Database class NOT FOUND!</p>";
}

// List all functions in config.php
echo "<h2>9. All Functions Defined</h2>";
$functions = get_defined_functions()['user'];
$config_functions = array_filter($functions, function($func) {
    return !in_array($func, ['__autoload']); // Filter out autoload
});

echo "<ul>";
foreach ($config_functions as $func) {
    echo "<li>$func()</li>";
}
echo "</ul>";

echo "<h2>✅ Diagnostic Complete</h2>";
echo "<p>If getDBConnection() is missing, you need to update config.php on the server.</p>";
echo "<p>Use the file: <strong>api/config_new.php</strong> as reference.</p>";
?>
