<?php
/**
 * Cache Manager V2 - Ultra Simple
 * Guaranteed to work with minimal code
 */

// No error display
@ini_set('display_errors', 0);
@error_reporting(0);

// Headers
@header('Content-Type: application/json');
@header('Access-Control-Allow-Origin: *');

// Get action
$action = @$_GET['action'] ?: 'stats';

// Cache directory
$dir = sys_get_temp_dir() . '/bmkg_cache';

// Create if not exists
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
}

// Process action
if ($action === 'stats') {
    $files = @glob($dir . '/*') ?: [];
    $size = 0;
    $count = 0;
    
    foreach ($files as $f) {
        if (@is_file($f)) {
            $size += @filesize($f);
            $count++;
        }
    }
    
    die(json_encode([
        'success' => true,
        'data' => [
            'total_files' => $count,
            'total_size' => $size,
            'total_size_mb' => round($size / 1024 / 1024, 2),
            'cache_dir' => $dir
        ]
    ]));
}

if ($action === 'clear') {
    $files = @glob($dir . '/*') ?: [];
    $cleared = 0;
    
    foreach ($files as $f) {
        if (@is_file($f) && @unlink($f)) {
            $cleared++;
        }
    }
    
    die(json_encode([
        'success' => true,
        'message' => "Cleared $cleared cache files",
        'cleared_count' => $cleared
    ]));
}

if ($action === 'clear-expired') {
    $files = @glob($dir . '/*') ?: [];
    $cleared = 0;
    $ttl = 300;
    
    foreach ($files as $f) {
        if (@is_file($f) && (time() - @filemtime($f)) > $ttl && @unlink($f)) {
            $cleared++;
        }
    }
    
    die(json_encode([
        'success' => true,
        'message' => "Cleared $cleared expired cache files",
        'cleared_count' => $cleared
    ]));
}

if ($action === 'clear-news') {
    $files = @glob($dir . '/*') ?: [];
    $cleared = 0;
    
    foreach ($files as $f) {
        if (@is_file($f) && strpos(basename($f), 'news_') === 0 && @unlink($f)) {
            $cleared++;
        }
    }
    
    die(json_encode([
        'success' => true,
        'message' => "Cleared $cleared news cache files",
        'cleared_count' => $cleared
    ]));
}

// Invalid action
die(json_encode([
    'success' => false,
    'message' => 'Invalid action'
]));
?>
