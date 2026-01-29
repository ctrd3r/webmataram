<?php
// Authentication API
// File: api/auth.php

require_once 'config.php';

// Handle different authentication actions
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'verify_session':
        verifySession();
        break;
    case 'forgot_password':
        handleForgotPassword();
        break;
    case 'reset_password':
        handleResetPassword();
        break;
    default:
        sendJsonResponse(['success' => false, 'message' => 'Invalid action'], 400);
}

function handleLogin() {
    try {
        // Get input data
        $username = sanitizeInput($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $remember_me = isset($_POST['remember_me']) ? (bool)$_POST['remember_me'] : false;
        
        // Validate required fields
        if (empty($username) || empty($password)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Username dan password harus diisi'
            ], 400);
        }
        
        // Check rate limiting
        if (isRateLimited($username)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.'
            ], 429);
        }
        
        // Initialize database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Get user from database
        $query = "SELECT * FROM penulis WHERE username = :username AND status = 'aktif'";
        $stmt = $db->prepare($query);
        $stmt->bindValue(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch();
        
        if (!$user || !verifyPassword($password, $user['password'])) {
            // Log failed attempt
            logFailedAttempt($username, getClientIP());
            
            sendJsonResponse([
                'success' => false,
                'message' => 'Username atau password salah'
            ], 401);
        }
        
        // Generate session token
        $session_token = generateSessionToken();
        $expires_at = date('Y-m-d H:i:s', time() + ($remember_me ? 30 * 24 * 3600 : 2 * 3600)); // 30 days or 2 hours
        
        // Store session in database
        $session_query = "
            INSERT INTO admin_sessions (user_id, session_token, expires_at, ip_address, user_agent, created_at) 
            VALUES (:user_id, :session_token, :expires_at, :ip_address, :user_agent, NOW())
            ON DUPLICATE KEY UPDATE 
            session_token = :session_token, 
            expires_at = :expires_at, 
            ip_address = :ip_address,
            user_agent = :user_agent,
            updated_at = NOW()
        ";
        
        $session_stmt = $db->prepare($session_query);
        $session_stmt->bindValue(':user_id', $user['id_penulis']);
        $session_stmt->bindValue(':session_token', $session_token);
        $session_stmt->bindValue(':expires_at', $expires_at);
        $session_stmt->bindValue(':ip_address', getClientIP());
        $session_stmt->bindValue(':user_agent', $_SERVER['HTTP_USER_AGENT'] ?? '');
        $session_stmt->execute();
        
        // Update last login
        $update_query = "UPDATE penulis SET updated_at = NOW() WHERE id_penulis = :id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindValue(':id', $user['id_penulis']);
        $update_stmt->execute();
        
        // Log successful login
        logSecurityEvent('login_success', [
            'user_id' => $user['id_penulis'],
            'username' => $username,
            'ip_address' => getClientIP()
        ]);
        
        // Clear failed attempts
        clearFailedAttempts($username);
        
        // Prepare response data
        $response_data = [
            'id' => $user['id_penulis'],
            'username' => $user['username'],
            'name' => $user['nama_lengkap'],
            'email' => $user['email'],
            'role' => getUserRole($user['id_penulis']),
            'session_token' => $session_token,
            'expires_at' => $expires_at,
            'permissions' => getUserPermissions($user['id_penulis']),
            'last_login' => date('Y-m-d H:i:s')
        ];
        
        sendJsonResponse([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => $response_data
        ]);
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        sendJsonResponse([
            'success' => false,
            'message' => 'Terjadi kesalahan sistem'
        ], 500);
    }
}

function handleLogout() {
    try {
        $session_token = $_POST['session_token'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (empty($session_token)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Session token required'
            ], 400);
        }
        
        // Clean session token format
        $session_token = str_replace('Bearer ', '', $session_token);
        
        // Initialize database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Get session info before deletion
        $query = "SELECT user_id FROM admin_sessions WHERE session_token = :token";
        $stmt = $db->prepare($query);
        $stmt->bindValue(':token', $session_token);
        $stmt->execute();
        $session = $stmt->fetch();
        
        // Delete session from database
        $delete_query = "DELETE FROM admin_sessions WHERE session_token = :token";
        $delete_stmt = $db->prepare($delete_query);
        $delete_stmt->bindValue(':token', $session_token);
        $delete_stmt->execute();
        
        // Log logout
        if ($session) {
            logSecurityEvent('logout', [
                'user_id' => $session['user_id'],
                'ip_address' => getClientIP()
            ]);
        }
        
        sendJsonResponse([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
        
    } catch (Exception $e) {
        error_log("Logout error: " . $e->getMessage());
        sendJsonResponse([
            'success' => false,
            'message' => 'Terjadi kesalahan sistem'
        ], 500);
    }
}

function verifySession() {
    try {
        $session_token = $_POST['session_token'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (empty($session_token)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Session token required'
            ], 401);
        }
        
        // Clean session token format
        $session_token = str_replace('Bearer ', '', $session_token);
        
        // Initialize database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Verify session
        $query = "
            SELECT s.*, p.username, p.nama_lengkap, p.email 
            FROM admin_sessions s 
            JOIN penulis p ON s.user_id = p.id_penulis 
            WHERE s.session_token = :token 
            AND s.expires_at > NOW() 
            AND p.status = 'aktif'
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':token', $session_token);
        $stmt->execute();
        $session = $stmt->fetch();
        
        if (!$session) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Session tidak valid atau telah berakhir'
            ], 401);
        }
        
        // Update session activity
        $update_query = "UPDATE admin_sessions SET updated_at = NOW() WHERE session_token = :token";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindValue(':token', $session_token);
        $update_stmt->execute();
        
        // Prepare response
        $response_data = [
            'id' => $session['user_id'],
            'username' => $session['username'],
            'name' => $session['nama_lengkap'],
            'email' => $session['email'],
            'role' => getUserRole($session['user_id']),
            'permissions' => getUserPermissions($session['user_id']),
            'session_expires' => $session['expires_at']
        ];
        
        sendJsonResponse([
            'success' => true,
            'data' => $response_data
        ]);
        
    } catch (Exception $e) {
        error_log("Session verification error: " . $e->getMessage());
        sendJsonResponse([
            'success' => false,
            'message' => 'Terjadi kesalahan sistem'
        ], 500);
    }
}

function handleForgotPassword() {
    try {
        $email = sanitizeInput($_POST['email'] ?? '');
        
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Email tidak valid'
            ], 400);
        }
        
        // Initialize database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Check if email exists
        $query = "SELECT id_penulis, username, nama_lengkap FROM penulis WHERE email = :email AND status = 'aktif'";
        $stmt = $db->prepare($query);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch();
        
        if (!$user) {
            // Don't reveal if email exists or not for security
            sendJsonResponse([
                'success' => true,
                'message' => 'Jika email terdaftar, link reset password akan dikirim'
            ]);
            return;
        }
        
        // Generate reset token
        $reset_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', time() + 3600); // 1 hour
        
        // Store reset token
        $token_query = "
            INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at) 
            VALUES (:user_id, :token, :expires_at, NOW())
            ON DUPLICATE KEY UPDATE 
            token = :token, 
            expires_at = :expires_at, 
            created_at = NOW()
        ";
        
        $token_stmt = $db->prepare($token_query);
        $token_stmt->bindValue(':user_id', $user['id_penulis']);
        $token_stmt->bindValue(':token', $reset_token);
        $token_stmt->bindValue(':expires_at', $expires_at);
        $token_stmt->execute();
        
        // Send reset email (implement your email sending logic here)
        $reset_link = "http://" . $_SERVER['HTTP_HOST'] . "/admin/reset-password.html?token=" . $reset_token;
        
        // Log password reset request
        logSecurityEvent('password_reset_requested', [
            'user_id' => $user['id_penulis'],
            'email' => $email,
            'ip_address' => getClientIP()
        ]);
        
        // In production, send actual email
        // sendPasswordResetEmail($email, $user['nama_lengkap'], $reset_link);
        
        sendJsonResponse([
            'success' => true,
            'message' => 'Link reset password telah dikirim ke email Anda',
            'reset_link' => $reset_link // Remove this in production
        ]);
        
    } catch (Exception $e) {
        error_log("Forgot password error: " . $e->getMessage());
        sendJsonResponse([
            'success' => false,
            'message' => 'Terjadi kesalahan sistem'
        ], 500);
    }
}

function handleResetPassword() {
    try {
        $token = sanitizeInput($_POST['token'] ?? '');
        $new_password = $_POST['new_password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        
        // Validate input
        if (empty($token) || empty($new_password) || empty($confirm_password)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Semua field harus diisi'
            ], 400);
        }
        
        if ($new_password !== $confirm_password) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Password konfirmasi tidak cocok'
            ], 400);
        }
        
        if (strlen($new_password) < 8) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Password minimal 8 karakter'
            ], 400);
        }
        
        // Initialize database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Verify reset token
        $query = "
            SELECT user_id 
            FROM password_reset_tokens 
            WHERE token = :token 
            AND expires_at > NOW()
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':token', $token);
        $stmt->execute();
        $reset_data = $stmt->fetch();
        
        if (!$reset_data) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Token reset tidak valid atau telah berakhir'
            ], 400);
        }
        
        // Update password
        $hashed_password = hashPassword($new_password);
        $update_query = "UPDATE penulis SET password = :password, updated_at = NOW() WHERE id_penulis = :id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindValue(':password', $hashed_password);
        $update_stmt->bindValue(':id', $reset_data['user_id']);
        $update_stmt->execute();
        
        // Delete used token
        $delete_query = "DELETE FROM password_reset_tokens WHERE token = :token";
        $delete_stmt = $db->prepare($delete_query);
        $delete_stmt->bindValue(':token', $token);
        $delete_stmt->execute();
        
        // Invalidate all existing sessions for this user
        $session_delete_query = "DELETE FROM admin_sessions WHERE user_id = :user_id";
        $session_delete_stmt = $db->prepare($session_delete_query);
        $session_delete_stmt->bindValue(':user_id', $reset_data['user_id']);
        $session_delete_stmt->execute();
        
        // Log password reset
        logSecurityEvent('password_reset_completed', [
            'user_id' => $reset_data['user_id'],
            'ip_address' => getClientIP()
        ]);
        
        sendJsonResponse([
            'success' => true,
            'message' => 'Password berhasil direset. Silakan login dengan password baru.'
        ]);
        
    } catch (Exception $e) {
        error_log("Reset password error: " . $e->getMessage());
        sendJsonResponse([
            'success' => false,
            'message' => 'Terjadi kesalahan sistem'
        ], 500);
    }
}

// Helper Functions
function generateSessionToken() {
    return 'sess_' . bin2hex(random_bytes(32)) . '_' . time();
}

function getClientIP() {
    $ip_keys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
    
    foreach ($ip_keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ips = explode(',', $_SERVER[$key]);
            return trim($ips[0]);
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function isRateLimited($username) {
    // Simple rate limiting - 5 attempts per 15 minutes
    $cache_key = 'login_attempts_' . md5($username . getClientIP());
    
    // In production, use Redis or database for rate limiting
    // For now, we'll use a simple file-based approach
    $attempts_file = sys_get_temp_dir() . '/' . $cache_key;
    
    if (file_exists($attempts_file)) {
        $data = json_decode(file_get_contents($attempts_file), true);
        $attempts = $data['attempts'] ?? 0;
        $last_attempt = $data['last_attempt'] ?? 0;
        
        // Reset if more than 15 minutes passed
        if (time() - $last_attempt > 900) {
            unlink($attempts_file);
            return false;
        }
        
        return $attempts >= 5;
    }
    
    return false;
}

function logFailedAttempt($username, $ip) {
    $cache_key = 'login_attempts_' . md5($username . $ip);
    $attempts_file = sys_get_temp_dir() . '/' . $cache_key;
    
    $attempts = 1;
    if (file_exists($attempts_file)) {
        $data = json_decode(file_get_contents($attempts_file), true);
        $attempts = ($data['attempts'] ?? 0) + 1;
    }
    
    $data = [
        'attempts' => $attempts,
        'last_attempt' => time(),
        'username' => $username,
        'ip' => $ip
    ];
    
    file_put_contents($attempts_file, json_encode($data));
    
    // Log security event
    logSecurityEvent('login_failed', [
        'username' => $username,
        'ip_address' => $ip,
        'attempts' => $attempts
    ]);
}

function clearFailedAttempts($username) {
    $cache_key = 'login_attempts_' . md5($username . getClientIP());
    $attempts_file = sys_get_temp_dir() . '/' . $cache_key;
    
    if (file_exists($attempts_file)) {
        unlink($attempts_file);
    }
}

function getUserRole($user_id) {
    // Simple role system - in production, implement proper role management
    return 'admin'; // Default role
}

function getUserPermissions($user_id) {
    // Return permissions based on user role
    return ['read', 'write', 'delete', 'moderate_comments'];
}

function logSecurityEvent($event, $data) {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        $query = "
            INSERT INTO security_logs (event_type, event_data, ip_address, user_agent, created_at) 
            VALUES (:event_type, :event_data, :ip_address, :user_agent, NOW())
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':event_type', $event);
        $stmt->bindValue(':event_data', json_encode($data));
        $stmt->bindValue(':ip_address', getClientIP());
        $stmt->bindValue(':user_agent', $_SERVER['HTTP_USER_AGENT'] ?? '');
        $stmt->execute();
        
    } catch (Exception $e) {
        error_log("Security logging error: " . $e->getMessage());
    }
}
?>