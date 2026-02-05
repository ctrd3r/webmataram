<?php
/**
 * Add Sample News Data
 * Run this file once to add sample news to database
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../api/config.php';

echo "<h1>Add Sample News Data</h1>";
echo "<style>
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .info { color: blue; }
</style>";

$conn = getDBConnection();

if (!$conn) {
    echo "<p class='error'>❌ Database connection failed!</p>";
    exit;
}

// Check if we already have news
$result = $conn->query("SELECT COUNT(*) as total FROM berita");
$row = $result->fetch_assoc();
$existingNews = $row['total'];

echo "<p class='info'>Existing news: <strong>$existingNews</strong></p>";

if ($existingNews > 0) {
    echo "<p class='error'>⚠️ Database already has news data!</p>";
    echo "<p>Do you want to add more sample news? <a href='?force=yes'>Yes, add sample news</a></p>";
    
    if (!isset($_GET['force']) || $_GET['force'] !== 'yes') {
        exit;
    }
}

// Get first category ID
$result = $conn->query("SELECT id_kategori, nama_kategori FROM kategori ORDER BY id_kategori LIMIT 3");
$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

if (count($categories) == 0) {
    echo "<p class='error'>❌ No categories found! Please add categories first.</p>";
    exit;
}

echo "<h2>Available Categories:</h2>";
echo "<ul>";
foreach ($categories as $cat) {
    echo "<li>ID: {$cat['id_kategori']} - {$cat['nama_kategori']}</li>";
}
echo "</ul>";

// Sample news data
$sampleNews = [
    [
        'judul' => 'Gempa Bumi Magnitudo 5.2 Guncang Lombok',
        'slug' => 'gempa-bumi-magnitudo-52-guncang-lombok',
        'ringkasan' => 'Gempa bumi dengan magnitudo 5.2 mengguncang wilayah Lombok, Nusa Tenggara Barat pada pagi hari ini.',
        'isi_berita' => '<p>Gempa bumi dengan magnitudo 5.2 mengguncang wilayah Lombok, Nusa Tenggara Barat pada pagi hari ini pukul 08:30 WITA. Pusat gempa berada di kedalaman 10 km dengan episentrum di koordinat 8.5 LS dan 116.3 BT.</p>

<p>Berdasarkan analisis BMKG, gempa ini tidak berpotensi tsunami. Namun masyarakat diimbau untuk tetap waspada terhadap kemungkinan gempa susulan.</p>

<p>Getaran gempa dirasakan hingga wilayah Mataram dan sekitarnya dengan intensitas III-IV MMI. Beberapa warga melaporkan adanya kerusakan ringan pada bangunan.</p>

<p>Tim BMKG terus memantau aktivitas seismik di wilayah tersebut dan akan memberikan update informasi secara berkala.</p>',
        'gambar' => 'images/gedung1.jpg',
        'alt_gambar' => 'Ilustrasi gempa bumi di Lombok',
        'meta_description' => 'Gempa bumi magnitudo 5.2 mengguncang Lombok, NTB. BMKG melaporkan tidak ada potensi tsunami.',
        'tags' => 'gempa bumi, lombok, ntb, bmkg, seismik',
        'id_kategori' => $categories[0]['id_kategori'],
        'status' => 'publish',
        'featured' => 1,
        'views' => 150
    ],
    [
        'judul' => 'Prakiraan Cuaca Hari Ini: Hujan Lebat di Wilayah NTB',
        'slug' => 'prakiraan-cuaca-hari-ini-hujan-lebat-ntb',
        'ringkasan' => 'BMKG memprakirakan cuaca hari ini akan didominasi hujan lebat di sebagian besar wilayah Nusa Tenggara Barat.',
        'isi_berita' => '<p>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) memprakirakan cuaca hari ini akan didominasi hujan lebat di sebagian besar wilayah Nusa Tenggara Barat.</p>

<p>Berdasarkan analisis citra satelit dan data cuaca terkini, terdapat pertumbuhan awan konvektif yang signifikan di wilayah NTB.</p>

<h3>Wilayah yang Berpotensi Hujan Lebat:</h3>
<ul>
<li>Kota Mataram: Hujan lebat disertai petir (siang-sore)</li>
<li>Lombok Barat: Hujan sedang-lebat (pagi-siang)</li>
<li>Lombok Timur: Hujan ringan-sedang (sore-malam)</li>
<li>Sumbawa: Hujan lebat disertai angin kencang (siang-malam)</li>
</ul>

<p>Masyarakat diimbau untuk waspada terhadap potensi banjir, tanah longsor, dan angin kencang.</p>',
        'gambar' => 'images/gedung1.jpg',
        'alt_gambar' => 'Prakiraan cuaca hujan di NTB',
        'meta_description' => 'BMKG prakirakan hujan lebat di wilayah NTB hari ini. Waspada potensi banjir dan tanah longsor.',
        'tags' => 'cuaca, hujan lebat, ntb, prakiraan, bmkg',
        'id_kategori' => isset($categories[1]) ? $categories[1]['id_kategori'] : $categories[0]['id_kategori'],
        'status' => 'publish',
        'featured' => 0,
        'views' => 85
    ],
    [
        'judul' => 'BMKG Tingkatkan Sistem Peringatan Dini Tsunami',
        'slug' => 'bmkg-tingkatkan-sistem-peringatan-dini-tsunami',
        'ringkasan' => 'BMKG terus mengembangkan dan meningkatkan sistem peringatan dini tsunami untuk meningkatkan kesiapsiagaan masyarakat.',
        'isi_berita' => '<p>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) terus mengembangkan dan meningkatkan sistem peringatan dini tsunami untuk meningkatkan kesiapsiagaan masyarakat pesisir Indonesia.</p>

<h3>Peningkatan Sistem:</h3>
<ol>
<li><strong>Sensor Tsunami Modern:</strong> Penambahan sensor tsunami generasi terbaru dengan akurasi tinggi</li>
<li><strong>Sistem Komunikasi:</strong> Upgrade sistem komunikasi untuk penyebaran informasi lebih cepat</li>
<li><strong>Aplikasi Mobile:</strong> Pengembangan aplikasi mobile untuk notifikasi real-time</li>
<li><strong>Edukasi Masyarakat:</strong> Program sosialisasi dan simulasi evakuasi tsunami</li>
</ol>

<p>Dengan sistem yang lebih canggih ini, BMKG dapat mengeluarkan peringatan dini tsunami dalam waktu kurang dari 5 menit setelah gempa bumi terjadi.</p>',
        'gambar' => 'images/gedung1.jpg',
        'alt_gambar' => 'Sistem peringatan dini tsunami BMKG',
        'meta_description' => 'BMKG tingkatkan sistem peringatan dini tsunami dengan teknologi modern untuk kesiapsiagaan masyarakat.',
        'tags' => 'tsunami, peringatan dini, bmkg, teknologi, kebencanaan',
        'id_kategori' => isset($categories[2]) ? $categories[2]['id_kategori'] : $categories[0]['id_kategori'],
        'status' => 'publish',
        'featured' => 0,
        'views' => 42
    ]
];

echo "<h2>Inserting Sample News...</h2>";

$inserted = 0;
$failed = 0;

foreach ($sampleNews as $news) {
    $stmt = $conn->prepare("
        INSERT INTO berita (
            judul, slug, ringkasan, isi_berita, gambar, alt_gambar, 
            meta_description, tags, id_kategori, id_penulis, 
            status, featured, views, tanggal_publish
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, NOW())
    ");
    
    $stmt->bind_param(
        "ssssssssissi",
        $news['judul'],
        $news['slug'],
        $news['ringkasan'],
        $news['isi_berita'],
        $news['gambar'],
        $news['alt_gambar'],
        $news['meta_description'],
        $news['tags'],
        $news['id_kategori'],
        $news['status'],
        $news['featured'],
        $news['views']
    );
    
    if ($stmt->execute()) {
        echo "<p class='success'>✅ Added: {$news['judul']}</p>";
        $inserted++;
    } else {
        echo "<p class='error'>❌ Failed: {$news['judul']} - " . $stmt->error . "</p>";
        $failed++;
    }
}

echo "<h2>Summary</h2>";
echo "<p class='success'>✅ Successfully inserted: <strong>$inserted</strong> news</p>";
if ($failed > 0) {
    echo "<p class='error'>❌ Failed: <strong>$failed</strong> news</p>";
}

// Show all news
echo "<h2>All News in Database:</h2>";
$result = $conn->query("
    SELECT b.id_berita, b.judul, k.nama_kategori, b.status, b.featured, b.views, b.tanggal_publish
    FROM berita b
    LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
    ORDER BY b.tanggal_publish DESC
");

echo "<table border='1' cellpadding='5' style='border-collapse: collapse; width: 100%;'>";
echo "<tr style='background: #f0f0f0;'>";
echo "<th>ID</th><th>Judul</th><th>Kategori</th><th>Status</th><th>Featured</th><th>Views</th><th>Tanggal</th>";
echo "</tr>";

while ($row = $result->fetch_assoc()) {
    $featured = $row['featured'] ? '⭐ Yes' : 'No';
    echo "<tr>";
    echo "<td>{$row['id_berita']}</td>";
    echo "<td>{$row['judul']}</td>";
    echo "<td>{$row['nama_kategori']}</td>";
    echo "<td>{$row['status']}</td>";
    echo "<td>$featured</td>";
    echo "<td>{$row['views']}</td>";
    echo "<td>{$row['tanggal_publish']}</td>";
    echo "</tr>";
}
echo "</table>";

echo "<h2>Next Steps:</h2>";
echo "<ol>";
echo "<li>Open <a href='/admin/index.html' target='_blank'>Admin Panel</a> - You should see the news</li>";
echo "<li>Open <a href='/berita.html' target='_blank'>Berita Page</a> - News should be displayed</li>";
echo "<li>Test <a href='/api/get_news.php' target='_blank'>News API</a></li>";
echo "</ol>";

$conn->close();
?>
