<?php
// API untuk mengambil data kategori berita
// File: api/get_categories.php

require_once 'config.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get parameters
    $with_count = isset($_GET['with_count']) ? (bool)$_GET['with_count'] : false;
    
    if ($with_count) {
        // Get categories with news count
        $query = "
            SELECT 
                k.id_kategori,
                k.nama_kategori,
                k.slug_kategori,
                k.deskripsi,
                COUNT(b.id_berita) as jumlah_berita
            FROM kategori k
            LEFT JOIN berita b ON k.id_kategori = b.id_kategori AND b.status = 'publish'
            GROUP BY k.id_kategori, k.nama_kategori, k.slug_kategori, k.deskripsi
            ORDER BY k.nama_kategori ASC
        ";
    } else {
        // Get categories only
        $query = "
            SELECT 
                id_kategori,
                nama_kategori,
                slug_kategori,
                deskripsi
            FROM kategori
            ORDER BY nama_kategori ASC
        ";
    }
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    // Process data
    foreach ($categories as &$category) {
        if (!$with_count) {
            // Get news count for each category if not already included
            $count_query = "
                SELECT COUNT(*) as total 
                FROM berita 
                WHERE id_kategori = :id_kategori AND status = 'publish'
            ";
            $count_stmt = $db->prepare($count_query);
            $count_stmt->bindValue(':id_kategori', $category['id_kategori'], PDO::PARAM_INT);
            $count_stmt->execute();
            $category['jumlah_berita'] = (int)$count_stmt->fetch()['total'];
        } else {
            $category['jumlah_berita'] = (int)$category['jumlah_berita'];
        }
        
        // Add category URL
        $category['category_url'] = 'berita.html?category=' . $category['slug_kategori'];
    }
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $categories,
        'total' => count($categories)
    ];
    
    sendJsonResponse($response);
    
} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
?>