<?php
// API untuk mengambil data komentar
// File: api/get_comments.php

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
    
    // Get parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : '';
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    
    $offset = ($page - 1) * $limit;
    
    // Build query
    $whereConditions = [];
    $params = [];
    
    if (!empty($status)) {
        $whereConditions[] = "k.status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(k.nama_pengunjung LIKE ? OR k.email LIKE ? OR k.isi_komentar LIKE ? OR b.judul LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countQuery = "
        SELECT COUNT(*) as total
        FROM komentar k
        LEFT JOIN berita b ON k.id_berita = b.id_berita
        $whereClause
    ";
    
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $totalItems = $countStmt->fetch()['total'];
    
    // Get comments with news info
    $query = "
        SELECT 
            k.id_komentar,
            k.id_berita,
            k.nama_pengunjung,
            k.email,
            k.isi_komentar,
            k.status,
            k.tanggal_komentar,
            k.ip_address,
            b.judul as judul_berita,
            b.slug as slug_berita
        FROM komentar k
        LEFT JOIN berita b ON k.id_berita = b.id_berita
        $whereClause
        ORDER BY k.tanggal_komentar DESC
        LIMIT $limit OFFSET $offset
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $comments = $stmt->fetchAll();
    
    // Process data
    foreach ($comments as &$comment) {
        $comment['tanggal_komentar_formatted'] = formatDateIndonesian($comment['tanggal_komentar']);
        
        // Truncate long comments for table display
        if (strlen($comment['isi_komentar']) > 100) {
            $comment['isi_komentar_short'] = substr($comment['isi_komentar'], 0, 100) . '...';
        } else {
            $comment['isi_komentar_short'] = $comment['isi_komentar'];
        }
        
        // Add status badge info
        $comment['status_badge'] = [
            'pending' => ['class' => 'bg-yellow-100 text-yellow-800', 'text' => 'PENDING'],
            'approved' => ['class' => 'bg-green-100 text-green-800', 'text' => 'DISETUJUI'],
            'rejected' => ['class' => 'bg-red-100 text-red-800', 'text' => 'DITOLAK']
        ][$comment['status']] ?? ['class' => 'bg-gray-100 text-gray-800', 'text' => 'UNKNOWN'];
    }
    
    // Prepare pagination
    $pagination = getPaginationData($totalItems, $page, $limit);
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $comments,
        'pagination' => $pagination,
        'filters' => [
            'status' => $status,
            'search' => $search
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