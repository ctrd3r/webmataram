<?php
// IMMEDIATE SECURITY FIXES - Apply these changes NOW
// File: security-fixes-immediate.php

// 1. SECURE CONFIG TEMPLATE
// Create this as api/config-secure.php and replace config.php

/*
<?php
// Secure Configuration for BMKG News CMS
// File: api/config-secure.php

// Load environment variables (install vlucas/phpdotenv first)
// require_once __DIR__ . '/../vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
// $dotenv->load();

// For now, use more secure approach than hardcoded values
$config = [
    'db_host' => $_ENV['DB_HOST'] ?? 'localhost',
    'db_name' => $_ENV['DB_NAME'] ?? 'db_berita',
    'db_user' => $_ENV['DB_USER'] ?? 'bmkg_user',
    // NOTE: Do NOT hardcode production passwords in the repo. Set DB_PASS in environment.
    'db_pass' => $_ENV['DB_PASS'] ?? '',
    'db_charset' => 'utf8mb4'
];

// Database Configuration
define('DB_HOST', $config['db_host']);
define('DB_NAME', $config['db_name']);
define('DB_USER', $config['db_user']);
define('DB_PASS', $config['db_pass']);
define('DB_CHARSET', $config['db_charset']);

// SECURITY: Disable error reporting in production
error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// Security Headers
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    // Only use HTTPS in production
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// Call security headers for all API requests
setSecurityHeaders();

// Rest of config.php content...
*/

// 2. ENHANCED INPUT VALIDATION
function secureValidateInput($data, $type = 'string', $options = []) {
    if ($data === null || $data === '') {
        return $options['allow_empty'] ?? false ? '' : false;
    }
    
    // Trim whitespace
    $data = trim($data);
    
    switch ($type) {
        case 'email':
            $email = filter_var($data, FILTER_VALIDATE_EMAIL);
            return $email !== false ? $email : false;
            
        case 'int':
            $int = filter_var($data, FILTER_VALIDATE_INT, [
                'options' => [
                    'min_range' => $options['min'] ?? 0,
                    'max_range' => $options['max'] ?? PHP_INT_MAX
                ]
            ]);
            return $int !== false ? $int : false;
            
        case 'slug':
            // For URL slugs
            if (!preg_match('/^[a-z0-9\-]+$/', $data)) {
                return false;
            }
            return $data;
            
        case 'username':
            // Alphanumeric + underscore, 3-30 chars
            if (!preg_match('/^[a-zA-Z0-9_]{3,30}$/', $data)) {
                return false;
            }
            return $data;
            
        case 'filename':
            // Safe filename
            $data = preg_replace('/[^a-zA-Z0-9\-_\.]/', '', $data);
            return $data;
            
        case 'html':
            // Allow limited HTML tags
            $allowed_tags = $options['allowed_tags'] ?? '<p><br><strong><em><ul><ol><li>';
            return strip_tags($data, $allowed_tags);
            
        case 'string':
        default:
            // Basic string sanitization
            $data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            
            // Length limits
            $max_length = $options['max_length'] ?? 1000;
            if (strlen($data) > $max_length) {
                return false;
            }
            
            return $data;
    }
}

// 3. SECURE FILE UPLOAD FUNCTION
function secureFileUpload($file, $upload_dir = '../images/news/', $prefix = 'news') {
    // Validate file upload
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return ['success' => false, 'message' => 'Invalid file upload'];
    }
    
    // Check file size (5MB max)
    $max_size = 5 * 1024 * 1024;
    if ($file['size'] > $max_size) {
        return ['success' => false, 'message' => 'File too large (max 5MB)'];
    }
    
    // Validate MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $allowed_mimes = [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/gif'
    ];
    
    if (!in_array($mime_type, $allowed_mimes)) {
        return ['success' => false, 'message' => 'Invalid file type'];
    }
    
    // Validate file extension
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    if (!in_array($extension, $allowed_extensions)) {
        return ['success' => false, 'message' => 'Invalid file extension'];
    }
    
    // Generate secure filename
    $filename = $prefix . '_' . bin2hex(random_bytes(16)) . '.' . $extension;
    $filepath = $upload_dir . $filename;
    
    // Create directory if needed
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            return ['success' => false, 'message' => 'Cannot create upload directory'];
        }
    }
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Set secure file permissions
        chmod($filepath, 0644);
        
        // Verify it's actually an image
        if (!getimagesize($filepath)) {
            unlink($filepath);
            return ['success' => false, 'message' => 'File is not a valid image'];
        }
        
        return ['success' => true, 'filename' => $filename, 'filepath' => $filepath];
    }
    
    return ['success' => false, 'message' => 'Upload failed'];
}

// 4. RATE LIMITING CLASS
class SimpleRateLimiter {
    private $storage_dir;
    
    public function __construct($storage_dir = null) {
        $this->storage_dir = $storage_dir ?: sys_get_temp_dir() . '/rate_limits/';
        if (!is_dir($this->storage_dir)) {
            mkdir($this->storage_dir, 0755, true);
        }
    }
    
    public function isAllowed($identifier, $max_attempts = 5, $time_window = 900) {
        $file = $this->storage_dir . md5($identifier) . '.json';
        
        $data = ['attempts' => 0, 'reset_time' => time() + $time_window];
        
        if (file_exists($file)) {
            $stored = json_decode(file_get_contents($file), true);
            if ($stored && $stored['reset_time'] > time()) {
                $data = $stored;
            }
        }
        
        if ($data['attempts'] >= $max_attempts) {
            return false;
        }
        
        $data['attempts']++;
        file_put_contents($file, json_encode($data));
        
        return true;
    }
    
    public function reset($identifier) {
        $file = $this->storage_dir . md5($identifier) . '.json';
        if (file_exists($file)) {
            unlink($file);
        }
    }
}

// 5. SECURITY LOGGING
function logSecurityEvent($event_type, $data = [], $severity = 'INFO') {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'event_type' => $event_type,
        'severity' => $severity,
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    $log_file = __DIR__ . '/../logs/security.log';
    $log_dir = dirname($log_file);
    
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    file_put_contents($log_file, json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
}

// 6. CSRF PROTECTION
class CSRFProtection {
    private static $token_name = 'csrf_token';
    
    public static function generateToken() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $token = bin2hex(random_bytes(32));
        $_SESSION[self::$token_name] = $token;
        
        return $token;
    }
    
    public static function validateToken($token) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION[self::$token_name])) {
            return false;
        }
        
        $valid = hash_equals($_SESSION[self::$token_name], $token);
        
        // Regenerate token after use
        if ($valid) {
            unset($_SESSION[self::$token_name]);
        }
        
        return $valid;
    }
}

// 7. SQL INJECTION PREVENTION HELPER
class SecureDB {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function select($table, $conditions = [], $columns = '*', $limit = null) {
        $sql = "SELECT $columns FROM " . $this->escapeIdentifier($table);
        $params = [];
        
        if (!empty($conditions)) {
            $where_clauses = [];
            foreach ($conditions as $column => $value) {
                $where_clauses[] = $this->escapeIdentifier($column) . ' = ?';
                $params[] = $value;
            }
            $sql .= ' WHERE ' . implode(' AND ', $where_clauses);
        }
        
        if ($limit) {
            $sql .= ' LIMIT ' . (int)$limit;
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function insert($table, $data) {
        $columns = array_keys($data);
        $placeholders = array_fill(0, count($columns), '?');
        
        $sql = "INSERT INTO " . $this->escapeIdentifier($table) . 
               " (" . implode(', ', array_map([$this, 'escapeIdentifier'], $columns)) . ") " .
               "VALUES (" . implode(', ', $placeholders) . ")";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(array_values($data));
    }
    
    private function escapeIdentifier($identifier) {
        // Remove any non-alphanumeric characters except underscore
        $identifier = preg_replace('/[^a-zA-Z0-9_]/', '', $identifier);
        return "`$identifier`";
    }
}

// USAGE EXAMPLES:

/*
// 1. Use secure validation
$email = secureValidateInput($_POST['email'], 'email');
if ($email === false) {
    die('Invalid email');
}

// 2. Use rate limiting
$rate_limiter = new SimpleRateLimiter();
if (!$rate_limiter->isAllowed($_SERVER['REMOTE_ADDR'] . '_login')) {
    die('Too many attempts');
}

// 3. Use secure file upload
if (isset($_FILES['image'])) {
    $result = secureFileUpload($_FILES['image']);
    if (!$result['success']) {
        die($result['message']);
    }
}

// 4. Log security events
logSecurityEvent('login_attempt', ['username' => $username], 'INFO');

// 5. Use CSRF protection
// In form:
echo '<input type="hidden" name="csrf_token" value="' . CSRFProtection::generateToken() . '">';

// In processing:
if (!CSRFProtection::validateToken($_POST['csrf_token'])) {
    die('CSRF token invalid');
}
*/

echo "Security fixes template created. Apply these changes to your API files.\n";
?>