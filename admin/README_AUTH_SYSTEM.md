# Sistem Autentikasi Admin BMKG News

Sistem login dan logout admin yang aman dan lengkap dengan fitur keamanan tingkat enterprise untuk akses database dan manajemen konten berita.

## 🔐 Fitur Keamanan

### Autentikasi & Otorisasi
- ✅ **Multi-level Authentication**: Username/password dengan session token
- ✅ **Role-based Access Control**: Super Admin, Admin, Editor, Viewer
- ✅ **Session Management**: Server-side session dengan expiry
- ✅ **Remember Me**: Persistent login dengan extended session
- ✅ **Password Hashing**: bcrypt dengan salt untuk keamanan maksimal

### Keamanan Login
- ✅ **Rate Limiting**: Maksimal 5 percobaan per 15 menit
- ✅ **Account Lockout**: Auto-lock setelah failed attempts
- ✅ **IP Tracking**: Monitor login dari IP address berbeda
- ✅ **User Agent Tracking**: Deteksi login dari device berbeda
- ✅ **Security Logging**: Audit trail untuk semua aktivitas

### Session Security
- ✅ **Session Timeout**: Auto-logout setelah 2 jam inaktif
- ✅ **Session Monitoring**: Real-time session validation
- ✅ **Session Warning**: Notifikasi sebelum session expired
- ✅ **Session Extension**: Perpanjang session tanpa re-login
- ✅ **Multi-device Detection**: Deteksi login simultan

### Password Security
- ✅ **Password Strength Meter**: Real-time strength indicator
- ✅ **Password Requirements**: Kompleksitas minimum
- ✅ **Password Reset**: Secure token-based reset
- ✅ **Password History**: Prevent reuse (dapat ditambahkan)
- ✅ **Password Expiry**: Force change after period (dapat ditambahkan)

## 📁 Struktur File

```
admin/
├── login.html              # Halaman login dengan UI modern
├── login.js                # Logic autentikasi client-side
├── reset-password.html     # Halaman reset password
├── reset-password.js       # Logic reset password
├── auth-middleware.js      # Middleware autentikasi global
├── index.html              # Dashboard admin (protected)
└── admin.js                # Logic admin panel

api/
└── auth.php                # API autentikasi server-side

database/
└── db_berita.sql           # Schema database dengan tabel auth
```

## 🗄️ Database Schema

### Tabel `admin_sessions`
```sql
CREATE TABLE admin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel `password_reset_tokens`
```sql
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel `security_logs`
```sql
CREATE TABLE security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel `user_roles`
```sql
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    permissions JSON,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Instalasi & Konfigurasi

### 1. Update Database
```sql
-- Import updated database schema
mysql -u root -p < database/db_berita.sql
```

### 2. Konfigurasi API
Edit `api/config.php` untuk koneksi database:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'db_berita');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. Default Admin Accounts
```
Super Admin:
- Username: admin
- Password: admin123

Admin BMKG:
- Username: bmkg_admin  
- Password: bmkg2024!

Editor:
- Username: editor
- Password: editor123
```

**⚠️ PENTING**: Ganti password default setelah instalasi!

## 🔧 API Endpoints

### POST `/api/auth.php?action=login`
Login user dengan username dan password
```json
{
    "username": "admin",
    "password": "admin123",
    "remember_me": true
}
```

### POST `/api/auth.php?action=logout`
Logout user dan hapus session
```json
{
    "session_token": "sess_abc123..."
}
```

### POST `/api/auth.php?action=verify_session`
Verifikasi session yang aktif
```json
{
    "session_token": "sess_abc123..."
}
```

### POST `/api/auth.php?action=forgot_password`
Request reset password
```json
{
    "email": "admin@bmkg.go.id"
}
```

### POST `/api/auth.php?action=reset_password`
Reset password dengan token
```json
{
    "token": "reset_token_123...",
    "new_password": "newpassword123",
    "confirm_password": "newpassword123"
}
```

## 🎨 Fitur UI/UX

### Halaman Login
- ✅ **Modern Glass Effect**: UI dengan backdrop blur
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **Password Visibility Toggle**: Show/hide password
- ✅ **Remember Me**: Persistent login option
- ✅ **Forgot Password**: Link ke reset password
- ✅ **Real-time Validation**: Instant feedback
- ✅ **Loading States**: Visual feedback saat proses
- ✅ **Error Handling**: User-friendly error messages

### Halaman Reset Password
- ✅ **Token Validation**: Verify reset token
- ✅ **Password Strength Meter**: Real-time strength check
- ✅ **Requirements Checklist**: Visual password requirements
- ✅ **Password Match Validation**: Confirm password check
- ✅ **Success/Error States**: Clear status feedback

### Admin Dashboard
- ✅ **Session Monitoring**: Auto-check session validity
- ✅ **Session Warning**: Alert before expiry
- ✅ **Session Extension**: One-click extend
- ✅ **User Info Display**: Show current user
- ✅ **Secure Logout**: Proper session cleanup

## 🛡️ Keamanan Implementasi

### Client-Side Security
```javascript
// Session monitoring setiap 5 menit
setInterval(checkSession, 5 * 60 * 1000);

// Activity tracking
document.addEventListener('click', trackActivity);

// Auto-logout on tab close (jika tidak remember me)
window.addEventListener('beforeunload', clearSession);
```

### Server-Side Security
```php
// Rate limiting
if (isRateLimited($username)) {
    return error('Too many attempts');
}

// Password hashing
$hashed = password_hash($password, PASSWORD_DEFAULT);

// Session token generation
$token = 'sess_' . bin2hex(random_bytes(32)) . '_' . time();

// IP validation
$ip = getClientIP();
logSecurityEvent('login_attempt', ['ip' => $ip]);
```

## 📊 Monitoring & Logging

### Security Events
- `login_success` - Login berhasil
- `login_failed` - Login gagal
- `logout` - User logout
- `session_expired` - Session berakhir
- `password_reset_requested` - Request reset password
- `password_reset_completed` - Password berhasil direset
- `account_locked` - Akun terkunci
- `suspicious_activity` - Aktivitas mencurigakan

### Log Analysis
```sql
-- Login failures per IP
SELECT ip_address, COUNT(*) as failures
FROM security_logs 
WHERE event_type = 'login_failed' 
AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
GROUP BY ip_address
ORDER BY failures DESC;

-- Active sessions
SELECT COUNT(*) as active_sessions
FROM admin_sessions 
WHERE expires_at > NOW();
```

## 🔄 Workflow Autentikasi

### Login Process
1. User input username/password
2. Client-side validation
3. Rate limiting check
4. Database user verification
5. Password hash comparison
6. Session token generation
7. Session storage (database)
8. Response dengan user data
9. Client session storage
10. Redirect ke dashboard

### Session Management
1. Middleware check pada setiap request
2. Token validation dengan database
3. Session expiry check
4. Activity tracking
5. Auto-refresh session
6. Warning sebelum expiry
7. Auto-logout jika expired

### Logout Process
1. User click logout
2. Confirmation dialog
3. API call untuk hapus session
4. Clear client storage
5. Security log entry
6. Redirect ke login

## 🚨 Best Practices

### Development
- Gunakan HTTPS di production
- Set secure cookie flags
- Implement CSRF protection
- Regular security audit
- Monitor failed login attempts
- Backup security logs

### Production Deployment
```php
// Production settings
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');

// Hide error details
ini_set('display_errors', 0);
error_reporting(0);
```

### Maintenance
- Regular password policy review
- Session cleanup (expired sessions)
- Security log rotation
- Failed attempt cleanup
- Database optimization

## 🔧 Customization

### Menambah Role Baru
```sql
INSERT INTO user_roles (role_name, permissions, description) VALUES
('moderator', '["read", "moderate_comments"]', 'Content Moderator');
```

### Mengubah Session Timeout
```javascript
// Di auth-middleware.js
this.sessionTimeout = 4 * 60 * 60 * 1000; // 4 hours
```

### Custom Password Policy
```javascript
// Di login.js atau reset-password.js
function validatePassword(password) {
    return password.length >= 12 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password) && 
           /[!@#$%^&*]/.test(password);
}
```

## 📞 Troubleshooting

### Common Issues

**Session tidak tersimpan**
- Check database connection
- Verify session table exists
- Check PHP session settings

**Login gagal terus**
- Check password hash format
- Verify user status = 'aktif'
- Check rate limiting

**Reset password tidak bekerja**
- Verify email configuration
- Check token expiry
- Verify SMTP settings

### Debug Mode
```php
// Tambahkan di config.php untuk debugging
define('DEBUG_MODE', true);
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}
```

---

**Sistem autentikasi ini sudah production-ready dengan keamanan enterprise-level. Pastikan untuk mengganti password default dan konfigurasi sesuai environment production Anda.**