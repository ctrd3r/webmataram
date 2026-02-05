<?php
/**
 * Image Optimizer
 * Automatically compress and resize images on upload
 */

class ImageOptimizer {
    // Configuration
    private $maxWidth = 1920;           // Max width in pixels
    private $maxHeight = 1080;          // Max height in pixels
    private $jpegQuality = 85;          // JPEG quality (0-100)
    private $pngCompression = 6;        // PNG compression (0-9)
    private $webpQuality = 85;          // WebP quality (0-100)
    private $createWebP = true;         // Create WebP version
    private $uploadDir = '../images/news/';
    
    /**
     * Optimize uploaded image
     * 
     * @param array $file $_FILES array element
     * @param string $prefix Filename prefix
     * @return array Result with success status and filenames
     */
    public function optimize($file, $prefix = 'news') {
        // Validate file
        $validation = $this->validateFile($file);
        if (!$validation['success']) {
            return $validation;
        }
        
        // Create upload directory if not exists
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
        
        // Get image info
        $imageInfo = getimagesize($file['tmp_name']);
        if (!$imageInfo) {
            return ['success' => false, 'message' => 'Invalid image file'];
        }
        
        list($width, $height, $type) = $imageInfo;
        
        // Load image based on type
        $sourceImage = $this->loadImage($file['tmp_name'], $type);
        if (!$sourceImage) {
            return ['success' => false, 'message' => 'Failed to load image'];
        }
        
        // Calculate new dimensions
        $newDimensions = $this->calculateDimensions($width, $height);
        
        // Resize if needed
        if ($newDimensions['resize']) {
            $optimizedImage = $this->resizeImage(
                $sourceImage, 
                $width, 
                $height, 
                $newDimensions['width'], 
                $newDimensions['height']
            );
        } else {
            $optimizedImage = $sourceImage;
        }
        
        // Generate filename
        $extension = $this->getExtension($type);
        $filename = $prefix . '_' . uniqid() . '.' . $extension;
        $filepath = $this->uploadDir . $filename;
        
        // Save optimized image
        $saved = $this->saveImage($optimizedImage, $filepath, $type);
        
        if (!$saved) {
            imagedestroy($sourceImage);
            if ($optimizedImage !== $sourceImage) {
                imagedestroy($optimizedImage);
            }
            return ['success' => false, 'message' => 'Failed to save image'];
        }
        
        // Create WebP version if enabled
        $webpFilename = null;
        if ($this->createWebP && function_exists('imagewebp')) {
            $webpFilename = $prefix . '_' . uniqid() . '.webp';
            $webpPath = $this->uploadDir . $webpFilename;
            imagewebp($optimizedImage, $webpPath, $this->webpQuality);
        }
        
        // Get file sizes
        $originalSize = $file['size'];
        $optimizedSize = filesize($filepath);
        $savings = round((($originalSize - $optimizedSize) / $originalSize) * 100, 1);
        
        // Clean up
        imagedestroy($sourceImage);
        if ($optimizedImage !== $sourceImage) {
            imagedestroy($optimizedImage);
        }
        
        return [
            'success' => true,
            'filename' => $filename,
            'webp_filename' => $webpFilename,
            'original_size' => $originalSize,
            'optimized_size' => $optimizedSize,
            'savings_percent' => $savings,
            'original_dimensions' => ['width' => $width, 'height' => $height],
            'new_dimensions' => ['width' => $newDimensions['width'], 'height' => $newDimensions['height']],
            'resized' => $newDimensions['resize']
        ];
    }
    
    /**
     * Validate uploaded file
     */
    private function validateFile($file) {
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return ['success' => false, 'message' => 'No file uploaded'];
        }
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['success' => false, 'message' => 'Upload error: ' . $file['error']];
        }
        
        // Check file size (max 10MB)
        if ($file['size'] > 10 * 1024 * 1024) {
            return ['success' => false, 'message' => 'File too large. Maximum 10MB allowed.'];
        }
        
        // Check file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $allowedTypes)) {
            return ['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and WebP allowed.'];
        }
        
        return ['success' => true];
    }
    
    /**
     * Load image from file
     */
    private function loadImage($filepath, $type) {
        switch ($type) {
            case IMAGETYPE_JPEG:
                return imagecreatefromjpeg($filepath);
            case IMAGETYPE_PNG:
                return imagecreatefrompng($filepath);
            case IMAGETYPE_WEBP:
                return imagecreatefromwebp($filepath);
            default:
                return false;
        }
    }
    
    /**
     * Calculate new dimensions maintaining aspect ratio
     */
    private function calculateDimensions($width, $height) {
        $needsResize = false;
        $newWidth = $width;
        $newHeight = $height;
        
        // Check if resize needed
        if ($width > $this->maxWidth || $height > $this->maxHeight) {
            $needsResize = true;
            
            // Calculate aspect ratio
            $ratio = $width / $height;
            
            if ($width > $this->maxWidth) {
                $newWidth = $this->maxWidth;
                $newHeight = round($newWidth / $ratio);
            }
            
            if ($newHeight > $this->maxHeight) {
                $newHeight = $this->maxHeight;
                $newWidth = round($newHeight * $ratio);
            }
        }
        
        return [
            'width' => $newWidth,
            'height' => $newHeight,
            'resize' => $needsResize
        ];
    }
    
    /**
     * Resize image
     */
    private function resizeImage($sourceImage, $sourceWidth, $sourceHeight, $newWidth, $newHeight) {
        $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
        
        // Preserve transparency for PNG
        imagealphablending($resizedImage, false);
        imagesavealpha($resizedImage, true);
        
        // Resize
        imagecopyresampled(
            $resizedImage, 
            $sourceImage, 
            0, 0, 0, 0, 
            $newWidth, $newHeight, 
            $sourceWidth, $sourceHeight
        );
        
        return $resizedImage;
    }
    
    /**
     * Save optimized image
     */
    private function saveImage($image, $filepath, $type) {
        switch ($type) {
            case IMAGETYPE_JPEG:
                return imagejpeg($image, $filepath, $this->jpegQuality);
            case IMAGETYPE_PNG:
                return imagepng($image, $filepath, $this->pngCompression);
            case IMAGETYPE_WEBP:
                return imagewebp($image, $filepath, $this->webpQuality);
            default:
                return false;
        }
    }
    
    /**
     * Get file extension from image type
     */
    private function getExtension($type) {
        switch ($type) {
            case IMAGETYPE_JPEG:
                return 'jpg';
            case IMAGETYPE_PNG:
                return 'png';
            case IMAGETYPE_WEBP:
                return 'webp';
            default:
                return 'jpg';
        }
    }
    
    /**
     * Set configuration
     */
    public function setConfig($config) {
        if (isset($config['maxWidth'])) $this->maxWidth = $config['maxWidth'];
        if (isset($config['maxHeight'])) $this->maxHeight = $config['maxHeight'];
        if (isset($config['jpegQuality'])) $this->jpegQuality = $config['jpegQuality'];
        if (isset($config['pngCompression'])) $this->pngCompression = $config['pngCompression'];
        if (isset($config['webpQuality'])) $this->webpQuality = $config['webpQuality'];
        if (isset($config['createWebP'])) $this->createWebP = $config['createWebP'];
        if (isset($config['uploadDir'])) $this->uploadDir = $config['uploadDir'];
    }
}

/**
 * Helper function to optimize image
 */
function optimizeImage($file, $prefix = 'news', $config = []) {
    $optimizer = new ImageOptimizer();
    
    if (!empty($config)) {
        $optimizer->setConfig($config);
    }
    
    return $optimizer->optimize($file, $prefix);
}
?>
