<?php
// API untuk mengambil data penulis/authors
// File: api/get_authors.php

require_once 'config.php';

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get authors with news count
    $query = "
        SELECT 
            p.id_penulis,
            p.nama_lengkap,
            p.username,
            p.email,
            p.created_at,
            COUNT(b.id_berita) as total_berita
        FROM penulis p
        LEFT JOIN berita b ON p.id_penulis = b.id_penulis
        GROUP BY p.id_penulis, p.nama_lengkap, p.username, p.email, p.created_at
        ORDER BY p.nama_lengkap ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $authors = $stmt->fetchAll();
    
    // Process data
    foreach ($authors as &$author) {
        $author['total_berita'] = (int)$author['total_berita'];
        
        // Format created_at if exists
        if ($author['created_at']) {
            $author['created_at'] = formatDateIndonesian($author['created_at']);
        }
        
        // Add avatar URL (placeholder for now)
        $author['avatar_url'] = null;
    }
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $authors,
        'total' => count($authors)
    ];
    
    sendJsonResponse($response);
    
} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
?>