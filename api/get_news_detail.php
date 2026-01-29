<?php
// API untuk mengambil detail berita berdasarkan slug
// File: api/get_news_detail.php

require_once 'config.php';

try {
    // Get slug parameter
    $slug = isset($_GET['slug']) ? sanitizeInput($_GET['slug']) : '';
    
    if (empty($slug)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Slug parameter is required'
        ], 400);
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get news detail
    $query = "
        SELECT 
            b.id_berita,
            b.judul,
            b.slug,
            b.ringkasan,
            b.isi_berita,
            b.gambar_utama,
            b.alt_gambar,
            b.meta_description,
            b.tags,
            b.views,
            b.tanggal_publish,
            b.featured,
            b.created_at,
            b.updated_at,
            k.nama_kategori as kategori,
            k.slug_kategori,
            k.deskripsi as kategori_deskripsi,
            p.nama_lengkap as penulis,
            p.foto_profil as foto_penulis,
            p.bio as bio_penulis
        FROM berita b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
        WHERE b.slug = :slug AND b.status = 'publish'
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindValue(':slug', $slug);
    $stmt->execute();
    $news = $stmt->fetch();
    
    if (!$news) {
        sendJsonResponse([
            'success' => false,
            'message' => 'News not found'
        ], 404);
    }
    
    // Update view count
    $update_views = "UPDATE berita SET views = views + 1 WHERE id_berita = :id";
    $update_stmt = $db->prepare($update_views);
    $update_stmt->bindValue(':id', $news['id_berita'], PDO::PARAM_INT);
    $update_stmt->execute();
    
    // Increment views in response
    $news['views'] = (int)$news['views'] + 1;
    
    // Process news data
    $news['tanggal_publish_formatted'] = formatDateIndonesian($news['tanggal_publish']);
    
    // Process tags
    if (!empty($news['tags'])) {
        $news['tags'] = explode(',', $news['tags']);
        $news['tags'] = array_map('trim', $news['tags']);
    } else {
        $news['tags'] = [];
    }
    
    // Add image URL
    if (!empty($news['gambar_utama'])) {
        $news['gambar_url'] = 'images/news/' . $news['gambar_utama'];
    } else {
        $news['gambar_url'] = 'images/placeholder-news.jpg';
    }
    
    // Convert featured to boolean
    $news['featured'] = (bool)$news['featured'];
    
    // Get related news (same category, exclude current news)
    $related_query = "
        SELECT 
            b.id_berita,
            b.judul,
            b.slug,
            b.ringkasan,
            b.gambar_utama,
            b.views,
            b.tanggal_publish,
            k.nama_kategori as kategori,
            p.nama_lengkap as penulis
        FROM berita b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
        WHERE b.id_kategori = :kategori_id 
        AND b.id_berita != :current_id 
        AND b.status = 'publish'
        ORDER BY b.tanggal_publish DESC
        LIMIT 4
    ";
    
    $related_stmt = $db->prepare($related_query);
    $related_stmt->bindValue(':kategori_id', $news['id_kategori'] ?? 0, PDO::PARAM_INT);
    $related_stmt->bindValue(':current_id', $news['id_berita'], PDO::PARAM_INT);
    $related_stmt->execute();
    $related_news = $related_stmt->fetchAll();
    
    // Process related news
    foreach ($related_news as &$related) {
        $related['tanggal_publish_formatted'] = formatDateIndonesian($related['tanggal_publish']);
        
        if (!empty($related['gambar_utama'])) {
            $related['gambar_url'] = 'images/news/' . $related['gambar_utama'];
        } else {
            $related['gambar_url'] = 'images/placeholder-news.jpg';
        }
        
        $related['detail_url'] = 'detail-berita.html?slug=' . $related['slug'];
    }
    
    // Get comments (if comments table exists)
    $comments = [];
    try {
        $comments_query = "
            SELECT 
                id_komentar,
                nama_pengunjung,
                isi_komentar,
                created_at
            FROM komentar
            WHERE id_berita = :id_berita AND status = 'approved'
            ORDER BY created_at DESC
            LIMIT 10
        ";
        
        $comments_stmt = $db->prepare($comments_query);
        $comments_stmt->bindValue(':id_berita', $news['id_berita'], PDO::PARAM_INT);
        $comments_stmt->execute();
        $comments = $comments_stmt->fetchAll();
        
        // Format comment dates
        foreach ($comments as &$comment) {
            $comment['created_at_formatted'] = formatDateIndonesian($comment['created_at']);
        }
    } catch (Exception $e) {
        // Comments table might not exist, ignore error
        $comments = [];
    }
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $news,
        'related_news' => $related_news,
        'comments' => $comments,
        'meta' => [
            'title' => $news['judul'],
            'description' => $news['meta_description'] ?: $news['ringkasan'],
            'keywords' => implode(', ', $news['tags']),
            'author' => $news['penulis'],
            'published_time' => $news['tanggal_publish'],
            'image' => $news['gambar_url']
        ]
    ];
    
    sendJsonResponse($response);
    
} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
?>