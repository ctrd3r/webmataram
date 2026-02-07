<?php
/**
 * Database Connection Test
 * File: api/test_db_connection.php
 * 
 * Test database connection and show configuration
 */

// Load config
require_once 'config.php';

// Display configuration (for debugging)
echo "<!DOCTYPE html>";
echo "<html>";
echo "<head>";
echo "<title>Database Connection Test</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; margin: 20px; }";
echo ".container { max-width: 800px; margin: 0 auto; }";
echo ".section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }";
echo ".success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }";
echo ".error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; }";
echo ".info { background-color: #d1ecf1; border-color: #bee5eb; color: #0c5460; }";
echo "h1 { color: #333; }";
echo "h2 { color: #666; font-size: 16px; margin-top: 0; }";
echo "code { background-color: #f4f4f4; padding: 2px 5px; border-radius: 3px; }";
echo "pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }";
echo ".label { font-weight: bold; color: #333; }";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";
echo "<h1>🔧 Database Connection Test</h1>";

// Check .env file
echo "<div class='section info'>";
echo "<h2>1. Environment File Check</h2>";
$env_file = dirname(__DIR__) . '/.env';
if (file_exists($env_file)) {
    echo "<p class='success'>✅ .env file found at: <code>$env_file</code></p>";
    echo "<p><span class='label'>File size:</span> " . filesize($env_file) . " bytes</p>";
    echo "<p><span class='label'>File permissions:</span> " . substr(sprintf('%o', fileperms($env_file)), -4) . "</p>";
} else {
    echo "<p class='error'>❌ .env file NOT found at: <code>$env_file</code></p>";
    echo "<p>Create .env file with database credentials</p>";
}
echo "</div>";

// Display configuration
echo "<div class='section info'>";
echo "<h2>2. Configuration Values</h2>";
echo "<p><span class='label'>DB_HOST:</span> <code>" . DB_HOST . "</code></p>";
echo "<p><span class='label'>DB_NAME:</span> <code>" . DB_NAME . "</code></p>";
echo "<p><span class='label'>DB_USER:</span> <code>" . DB_USER . "</code></p>";
echo "<p><span class='label'>DB_PASS:</span> <code>" . (DB_PASS ? '***' : '(empty)') . "</code></p>";
echo "<p><span class='label'>DB_CHARSET:</span> <code>" . DB_CHARSET . "</code></p>";
echo "</div>";

// Test PDO connection
echo "<div class='section'>";
echo "<h2>3. PDO Connection Test</h2>";

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $conn = new PDO($dsn, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p class='success'>✅ PDO Connection successful!</p>";
    
    // Get database info
    $result = $conn->query("SELECT VERSION() as version");
    $row = $result->fetch();
    echo "<p><span class='label'>MySQL Version:</span> <code>" . $row['version'] . "</code></p>";
    
    // Get database size
    $result = $conn->query("SELECT 
        table_schema as 'Database',
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Size (MB)'
        FROM information_schema.tables
        WHERE table_schema = '" . DB_NAME . "'
        GROUP BY table_schema");
    $row = $result->fetch();
    if ($row) {
        echo "<p><span class='label'>Database Size:</span> <code>" . $row['Size (MB)'] . " MB</code></p>";
    }
    
    // List tables
    $result = $conn->query("SHOW TABLES");
    $tables = $result->fetchAll(PDO::FETCH_COLUMN);
    echo "<p><span class='label'>Tables:</span> " . count($tables) . "</p>";
    if (count($tables) > 0) {
        echo "<pre>";
        foreach ($tables as $table) {
            echo "- $table\n";
        }
        echo "</pre>";
    }
    
} catch(PDOException $e) {
    echo "<p class='error'>❌ PDO Connection failed!</p>";
    echo "<p><span class='label'>Error:</span> " . $e->getMessage() . "</p>";
    echo "<p><span class='label'>Code:</span> " . $e->getCode() . "</p>";
}

// Test MySQLi connection
echo "<div class='section'>";
echo "<h2>4. MySQLi Connection Test</h2>";

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($mysqli->connect_error) {
    echo "<p class='error'>❌ MySQLi Connection failed!</p>";
    echo "<p><span class='label'>Error:</span> " . $mysqli->connect_error . "</p>";
} else {
    echo "<p class='success'>✅ MySQLi Connection successful!</p>";
    
    // Get connection info
    echo "<p><span class='label'>Server Info:</span> <code>" . $mysqli->server_info . "</code></p>";
    echo "<p><span class='label'>Client Info:</span> <code>" . $mysqli->client_info . "</code></p>";
    
    $mysqli->close();
}

echo "</div>";

// Recommendations
echo "<div class='section info'>";
echo "<h2>5. Recommendations</h2>";
echo "<ul>";
echo "<li>If connection fails, verify database credentials in .env</li>";
echo "<li>Ensure database server is running</li>";
echo "<li>Check database user has correct permissions</li>";
echo "<li>Verify database name exists</li>";
echo "<li>Check firewall/network connectivity</li>";
echo "</ul>";
echo "</div>";

echo "</div>";
echo "</body>";
echo "</html>";
?>
