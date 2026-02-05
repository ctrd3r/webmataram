<?php
/**
 * Test by directly including the API file
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Test Include API</h1>";
echo "<pre>";

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_GET['action'] = 'add';

// Simulate POST data
$testData = [
    'judul' => 'Test Include API',
    'isi_berita' => 'Konten test',
    'id_kategori' => 1,
    'status' => 'draft',
    'gambar' => '',
    'id_penulis' => 1
];

// Create a temporary file with JSON data
$tempFile = tempnam(sys_get_temp_dir(), 'test');
file_put_contents($tempFile, json_encode($testData));

// Override php://input
stream_wrapper_unregister("php");
stream_wrapper_register("php", "MockPhpStream");

class MockPhpStream {
    public $position;
    public $varname;
    
    function stream_open($path, $mode, $options, &$opened_path) {
        global $testData;
        $this->varname = json_encode($testData);
        $this->position = 0;
        return true;
    }
    
    function stream_read($count) {
        $ret = substr($this->varname, $this->position, $count);
        $this->position += strlen($ret);
        return $ret;
    }
    
    function stream_eof() {
        return $this->position >= strlen($this->varname);
    }
    
    function stream_stat() {
        return [];
    }
}

echo "Simulating POST request with data:\n";
print_r($testData);
echo "\n\n";

echo "Including api/manage_news.php...\n";
echo "========================================\n\n";

// Capture output
ob_start();

try {
    include 'api/manage_news.php';
    $output = ob_get_clean();
    
    echo "Output received:\n";
    echo "Length: " . strlen($output) . " bytes\n";
    echo "Content:\n";
    echo htmlspecialchars($output);
    echo "\n\n";
    
    // Try to decode JSON
    $decoded = json_decode($output, true);
    if ($decoded) {
        echo "✅ Valid JSON response:\n";
        print_r($decoded);
    } else {
        echo "❌ Invalid JSON\n";
        echo "JSON Error: " . json_last_error_msg() . "\n";
    }
    
} catch (Exception $e) {
    $output = ob_get_clean();
    echo "❌ Exception caught:\n";
    echo $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    
    if ($output) {
        echo "\nOutput before exception:\n";
        echo htmlspecialchars($output);
    }
}

echo "</pre>";
?>
