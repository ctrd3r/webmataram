<?php
/**
 * Dynamic Sitemap Generator
 * Generates XML sitemap with all pages and news articles
 */

header('Content-Type: application/xml; charset=utf-8');

require_once 'config.php';

// Base URL - UPDATE THIS WITH YOUR ACTUAL DOMAIN
$baseUrl = 'https://yourdomain.com';

// Start XML
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// Static pages
$staticPages = [
    ['loc' => '', 'priority' => '1.0', 'changefreq' => 'daily'],
    ['loc' => 'berita.html', 'priority' => '0.9', 'changefreq' => 'daily'],
    ['loc' => 'gempabumi.html', 'priority' => '0.8', 'changefreq' => 'hourly'],
    ['loc' => 'tsunami.html', 'priority' => '0.8', 'changefreq' => 'hourly'],
    ['loc' => 'tanda-waktu.html', 'priority' => '0.7', 'changefreq' => 'weekly'],
];

foreach ($staticPages as $page) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($baseUrl . '/' . $page['loc']) . "</loc>\n";
    echo "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
    echo "    <changefreq>" . $page['changefreq'] . "</changefreq>\n";
    echo "    <priority>" . $page['priority'] . "</priority>\n";
    echo "  </url>\n";
}

// Dynamic news articles
try {
    $conn = getDBConnection();
    
    if ($conn) {
        $sql = "SELECT 
                    b.slug,
                    b.tanggal_publish,
                    b.tanggal_update
                FROM berita b
                WHERE b.status = 'publish'
                ORDER BY b.tanggal_publish DESC
                LIMIT 1000";
        
        $result = $conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $lastmod = $row['tanggal_update'] ? $row['tanggal_update'] : $row['tanggal_publish'];
                $lastmodDate = date('Y-m-d', strtotime($lastmod));
                
                // Calculate priority based on publish date
                $daysOld = (time() - strtotime($row['tanggal_publish'])) / 86400;
                if ($daysOld < 7) {
                    $priority = '0.9';
                    $changefreq = 'daily';
                } elseif ($daysOld < 30) {
                    $priority = '0.7';
                    $changefreq = 'weekly';
                } else {
                    $priority = '0.5';
                    $changefreq = 'monthly';
                }
                
                echo "  <url>\n";
                echo "    <loc>" . htmlspecialchars($baseUrl . '/detail-berita.html?slug=' . $page['slug']) . "</loc>\n";
                echo "    <lastmod>" . $lastmodDate . "</lastmod>\n";
                echo "    <changefreq>" . $changefreq . "</changefreq>\n";
                echo "    <priority>" . $priority . "</priority>\n";
                echo "  </url>\n";
            }
        }
        
        $conn->close();
    }
} catch (Exception $e) {
    // Log error but continue generating sitemap
    error_log('Sitemap generation error: ' . $e->getMessage());
}

// End XML
echo '</urlset>';
?>
