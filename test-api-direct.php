<?php
/**
 * Direct API Test - bypasses JavaScript
 */

echo "<h1>Direct API Test</h1>";
echo "<pre>";

// Test data
$newsData = [
    'judul' => 'Test Berita Direct',
    'isi_berita' => 'Ini adalah konten test berita.',
    'id_kategori' => 1,
    'status' => 'draft',
    'gambar' => '',
    'id_penulis' => 1
];

echo "Sending data:\n";
print_r($newsData);
echo "\n\n";

// Make API call
$url = 'http://10.21.224.146/api/manage_news.php?action=add';
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($newsData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response Length: " . strlen($response) . " bytes\n";
echo "Response (first 500 chars):\n";
echo htmlspecialchars(substr($response, 0, 500));
echo "\n\n";

if (strlen($response) == 0) {
    echo "⚠️ EMPTY RESPONSE - This means PHP fatal error\n";
    echo "Check Apache error log at:\n";
    echo "- XAMPP: C:\\xampp\\apache\\logs\\error.log\n";
    echo "- Linux: /var/log/apache2/error.log\n\n";
}

echo "Response (hex first 100 bytes):\n";
echo bin2hex(substr($response, 0, 100));
echo "\n\n";

if ($error) {
    echo "cURL Error: $error\n";
}

// Try to decode JSON
$decoded = json_decode($response, true);
if ($decoded) {
    echo "Decoded JSON:\n";
    print_r($decoded);
} else {
    echo "Failed to decode JSON\n";
    echo "JSON Error: " . json_last_error_msg() . "\n";
}

echo "</pre>";
?>
