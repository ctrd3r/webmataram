<?php
/**
 * Simple File-Based Cache Helper
 * Improves API performance by caching responses
 */

class SimpleCache {
    private $cacheDir;
    private $defaultTTL = 300; // 5 minutes
    
    public function __construct($cacheDir = null) {
        $this->cacheDir = $cacheDir ?? sys_get_temp_dir() . '/bmkg_cache';
        
        // Create cache directory if not exists
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }
    
    /**
     * Get cached data or execute callback
     */
    public function remember($key, $callback, $ttl = null) {
        $ttl = $ttl ?? $this->defaultTTL;
        $cacheFile = $this->getCacheFile($key);
        
        // Check if cache exists and is valid
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
            $data = file_get_contents($cacheFile);
            return json_decode($data, true);
        }
        
        // Execute callback and cache result
        $data = $callback();
        file_put_contents($cacheFile, json_encode($data));
        
        return $data;
    }
    
    /**
     * Get data from cache
     */
    public function get($key) {
        $cacheFile = $this->getCacheFile($key);
        
        if (file_exists($cacheFile)) {
            $data = file_get_contents($cacheFile);
            return json_decode($data, true);
        }
        
        return null;
    }
    
    /**
     * Store data in cache
     */
    public function put($key, $data, $ttl = null) {
        $cacheFile = $this->getCacheFile($key);
        file_put_contents($cacheFile, json_encode($data));
        
        // Set file modification time for TTL
        if ($ttl !== null) {
            touch($cacheFile, time());
        }
        
        return true;
    }
    
    /**
     * Check if cache exists and is valid
     */
    public function has($key, $ttl = null) {
        $ttl = $ttl ?? $this->defaultTTL;
        $cacheFile = $this->getCacheFile($key);
        
        return file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $ttl;
    }
    
    /**
     * Delete cache
     */
    public function forget($key) {
        $cacheFile = $this->getCacheFile($key);
        
        if (file_exists($cacheFile)) {
            return unlink($cacheFile);
        }
        
        return false;
    }
    
    /**
     * Clear all cache
     */
    public function flush() {
        $files = glob($this->cacheDir . '/*');
        
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        
        return true;
    }
    
    /**
     * Clear expired cache
     */
    public function clearExpired($ttl = null) {
        $ttl = $ttl ?? $this->defaultTTL;
        $files = glob($this->cacheDir . '/*');
        $cleared = 0;
        
        foreach ($files as $file) {
            if (is_file($file) && (time() - filemtime($file)) > $ttl) {
                unlink($file);
                $cleared++;
            }
        }
        
        return $cleared;
    }
    
    /**
     * Get cache file path
     */
    private function getCacheFile($key) {
        return $this->cacheDir . '/' . md5($key) . '.cache';
    }
    
    /**
     * Get cache statistics
     */
    public function getStats() {
        $files = glob($this->cacheDir . '/*');
        $totalSize = 0;
        $totalFiles = 0;
        
        foreach ($files as $file) {
            if (is_file($file)) {
                $totalSize += filesize($file);
                $totalFiles++;
            }
        }
        
        return [
            'total_files' => $totalFiles,
            'total_size' => $totalSize,
            'total_size_mb' => round($totalSize / 1024 / 1024, 2),
            'cache_dir' => $this->cacheDir
        ];
    }
}

/**
 * Global cache instance
 */
function cache() {
    static $cache = null;
    
    if ($cache === null) {
        $cache = new SimpleCache();
    }
    
    return $cache;
}
?>
