<?php
// API untuk mengambil data berita secara random
// File: api/get_random_news.php

require_once 'config.php';

// Try to load cache helper
$cacheEnabled = false;
if (file_exists('cache_helper.php')) {
    try {
        require_once 'cache_helper.php';
        $cacheEnabled = true;
    } catch (Exception $e) {
        error_log('Cache helper failed to load: ' . $e->getMessage());
    }
}

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 3;
    
    // Validate parameters
    $limit = min(10, max(1, $limit)); // Max 10 items, min 1
    
    // Create cache key
    $cacheKey = 'random_news_' . md5($limit);
    
    // Try to get from cache (10 minutes TTL)
    if ($cacheEnabled && function_exists('cache')) {
        $cachedData = cache()->get($cacheKey);
        if ($cachedData !== null && cache()->has($cacheKey, 600)) {
            sendJsonResponse($cachedData);
            exit;
        }
    }
    
    // Get random news data
    $query = "
        SELECT 
            b.id_berita,
            b.judul,
            b.slug,
            b.ringkasan,
            b.gambar_utama,
            b.alt_gambar,
            b.meta_description,
            b.tags,
            b.views,
            b.tanggal_publish,
            b.featured,
            k.nama_kategori as kategori,
            k.slug_kategori,
            p.nama_lengkap as penulis,
            p.foto_profil as foto_penulis
        FROM berita b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
        WHERE b.status = 'publish'
        ORDER BY RAND()
        LIMIT :limit
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $news = $stmt->fetchAll();
    
    // Process news data
    foreach ($news as &$item) {
        // Format date
        $item['tanggal_publish_formatted'] = formatDateIndonesian($item['tanggal_publish']);
        
        // Process tags
        if (!empty($item['tags'])) {
            $item['tags'] = explode(',', $item['tags']);
            $item['tags'] = array_map('trim', $item['tags']);
        } else {
            $item['tags'] = [];
        }
        
        // Add image URL
        if (!empty($item['gambar_utama'])) {
            // Check if path already contains 'images/'
            if (strpos($item['gambar_utama'], 'images/') === 0) {
                $item['gambar_url'] = $item['gambar_utama'];
            } else {
                $item['gambar_url'] = 'images/news/' . $item['gambar_utama'];
            }
        } else {
            $item['gambar_url'] = 'images/placeholder-news.jpg';
        }
        
        // Add detail URL
        $item['detail_url'] = 'detail-berita.html?slug=' . $item['slug'];
        
        // Convert featured to boolean
        $item['featured'] = (bool)$item['featured'];
    }
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $news,
        'count' => count($news),
        'cached' => false
    ];
    
    // Store in cache if enabled
    if ($cacheEnabled && function_exists('cache')) {
        try {
            cache()->put($cacheKey, $response, 600);
        } catch (Exception $e) {
            error_log('Cache put failed: ' . $e->getMessage());
        }
    }
    
    sendJsonResponse($response);
    
} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
?>
