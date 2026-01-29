<?php
// API untuk mengambil data berita
// File: api/get_news.php

require_once 'config.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
    $category = isset($_GET['category']) ? sanitizeInput($_GET['category']) : '';
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    $sort = isset($_GET['sort']) ? sanitizeInput($_GET['sort']) : 'newest';
    $featured = isset($_GET['featured']) ? (bool)$_GET['featured'] : false;
    
    // Validate parameters
    $page = max(1, $page);
    $limit = min(50, max(1, $limit)); // Max 50 items per page
    $offset = ($page - 1) * $limit;
    
    // Build WHERE clause
    $where_conditions = ["b.status = 'publish'"];
    $params = [];
    
    if ($featured) {
        $where_conditions[] = "b.featured = 1";
    }
    
    if (!empty($category)) {
        $where_conditions[] = "k.slug_kategori = :category";
        $params[':category'] = $category;
    }
    
    if (!empty($search)) {
        $where_conditions[] = "(b.judul LIKE :search OR b.ringkasan LIKE :search OR b.tags LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    $where_clause = implode(' AND ', $where_conditions);
    
    // Build ORDER BY clause
    $order_by = "b.tanggal_publish DESC"; // default
    switch ($sort) {
        case 'oldest':
            $order_by = "b.tanggal_publish ASC";
            break;
        case 'popular':
            $order_by = "b.views DESC, b.tanggal_publish DESC";
            break;
        case 'newest':
        default:
            $order_by = "b.tanggal_publish DESC";
            break;
    }
    
    // Count total items
    $count_query = "
        SELECT COUNT(*) as total 
        FROM berita b 
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori 
        LEFT JOIN penulis p ON b.id_penulis = p.id_penulis 
        WHERE $where_clause
    ";
    
    $count_stmt = $db->prepare($count_query);
    $count_stmt->execute($params);
    $total_items = $count_stmt->fetch()['total'];
    
    // Get news data
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
        WHERE $where_clause
        ORDER BY $order_by
        LIMIT :limit OFFSET :offset
    ";
    
    $stmt = $db->prepare($query);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
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
            $item['gambar_url'] = 'images/news/' . $item['gambar_utama'];
        } else {
            $item['gambar_url'] = 'images/placeholder-news.jpg';
        }
        
        // Add detail URL
        $item['detail_url'] = 'detail-berita.html?slug=' . $item['slug'];
        
        // Convert featured to boolean
        $item['featured'] = (bool)$item['featured'];
    }
    
    // Get pagination data
    $pagination = getPaginationData($total_items, $page, $limit);
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $news,
        'pagination' => $pagination,
        'filters' => [
            'category' => $category,
            'search' => $search,
            'sort' => $sort,
            'featured' => $featured
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