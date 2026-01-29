# Panduan Manajemen User Admin BMKG News

Panduan lengkap untuk membuat, mengelola, dan memaintain user admin dalam sistem berita BMKG.

## 🔐 Cara Membuat User Admin Baru

### 1. Menggunakan Script SQL Langsung

```sql
-- Jalankan script ini di MySQL/phpMyAdmin
source database/create_admin_users.sql;
```

### 2. Membuat User Manual dengan SQL

```sql
-- Template dasar
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Nama Lengkap User', 'username', 'email@bmkg.go.id', 'PASSWORD_HASH', 'Bio user', ROLE_ID, 'aktif');
```

**Role ID:**
- `1` = Super Admin (akses penuh)
- `2` = Admin (manajemen konten)
- `3` = Editor (tulis & edit berita)
- `4` = Viewer (hanya baca)

### 3. Generate Password Hash

**Menggunakan PHP:**
```php
// Jalankan: php database/password_generator.php
echo password_hash('password_anda', PASSWORD_DEFAULT);
```

**Menggunakan Online Tool:**
- Buka: https://www.php.net/manual/en/function.password-hash.php
- Atau gunakan script password_generator.php yang sudah disediakan

## 👥 Contoh User yang Sudah Dibuat

### Default Admin Accounts
```
1. Super Admin
   Username: superadmin
   Password: SuperAdmin2024!
   Email: superadmin@bmkg.go.id

2. Admin BMKG
   Username: admin_bmkg
   Password: AdminBMKG2024!
   Email: admin@bmkg.go.id

3. Editor Senior
   Username: editor_senior
   Password: EditorSenior2024!
   Email: editor.senior@bmkg.go.id

4. Editor Gempa
   Username: editor_gempa
   Password: EditorGempa2024!
   Email: editor.gempa@bmkg.go.id

5. Editor Cuaca
   Username: editor_cuaca
   Password: EditorCuaca2024!
   Email: editor.cuaca@bmkg.go.id
```

**⚠️ PENTING:** Ganti semua password default setelah login pertama!

## 🛠️ Operasi User Management

### Melihat Semua User
```sql
SELECT 
    p.id_penulis,
    p.nama_lengkap,
    p.username,
    p.email,
    p.status,
    r.role_name,
    p.created_at
FROM penulis p
LEFT JOIN user_roles r ON p.role_id = r.id
ORDER BY p.created_at DESC;
```

### Update Password User
```sql
-- Ganti 'username' dengan username yang sebenarnya
UPDATE penulis 
SET password = '$2y$10$NEW_HASH_PASSWORD_HERE' 
WHERE username = 'username';
```

### Update Role User
```sql
-- Ubah role user (1=Super Admin, 2=Admin, 3=Editor, 4=Viewer)
UPDATE penulis 
SET role_id = 2 
WHERE username = 'username';
```

### Nonaktifkan User
```sql
-- Soft delete (nonaktifkan user)
UPDATE penulis 
SET status = 'nonaktif' 
WHERE username = 'username';
```

### Aktifkan User Kembali
```sql
UPDATE penulis 
SET status = 'aktif' 
WHERE username = 'username';
```

### Hapus User Permanen
```sql
-- HATI-HATI! Ini akan menghapus user secara permanen
DELETE FROM penulis WHERE username = 'username';
```

## 🔍 Monitoring & Security

### Melihat Session Aktif
```sql
SELECT 
    s.id,
    p.username,
    p.nama_lengkap,
    s.ip_address,
    s.created_at,
    s.expires_at,
    CASE 
        WHEN s.expires_at > NOW() THEN 'Active'
        ELSE 'Expired'
    END as status
FROM admin_sessions s
JOIN penulis p ON s.user_id = p.id_penulis
ORDER BY s.created_at DESC;
```

### Melihat Log Keamanan
```sql
SELECT 
    event_type,
    JSON_EXTRACT(event_data, '$.username') as username,
    ip_address,
    created_at
FROM security_logs
WHERE event_type IN ('login_success', 'login_failed', 'logout')
ORDER BY created_at DESC
LIMIT 50;
```

### Melihat Failed Login Attempts
```sql
SELECT 
    JSON_EXTRACT(event_data, '$.username') as username,
    COUNT(*) as failed_attempts,
    MAX(created_at) as last_attempt
FROM security_logs
WHERE event_type = 'login_failed'
AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
GROUP BY JSON_EXTRACT(event_data, '$.username')
ORDER BY failed_attempts DESC;
```

## 🔧 Maintenance Rutin

### Cleanup Session Expired
```sql
-- Jalankan setiap hari
DELETE FROM admin_sessions WHERE expires_at < NOW();
```

### Cleanup Token Reset Password
```sql
-- Jalankan setiap hari
DELETE FROM password_reset_tokens WHERE expires_at < NOW();
```

### Cleanup Log Lama
```sql
-- Hapus log lebih dari 30 hari
DELETE FROM security_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Backup User Data
```sql
-- Export user data
SELECT 
    p.*,
    r.role_name,
    r.permissions
FROM penulis p
LEFT JOIN user_roles r ON p.role_id = r.id
INTO OUTFILE '/tmp/users_backup.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

## 📊 Statistik User

### User Per Role
```sql
SELECT 
    r.role_name,
    COUNT(p.id_penulis) as jumlah_user
FROM user_roles r
LEFT JOIN penulis p ON r.id = p.role_id AND p.status = 'aktif'
GROUP BY r.id, r.role_name
ORDER BY jumlah_user DESC;
```

### User Aktif 7 Hari Terakhir
```sql
SELECT DISTINCT
    p.username,
    p.nama_lengkap,
    MAX(s.updated_at) as last_activity
FROM penulis p
JOIN admin_sessions s ON p.id_penulis = s.user_id
WHERE s.updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY p.id_penulis, p.username, p.nama_lengkap
ORDER BY last_activity DESC;
```

### User Belum Pernah Login
```sql
SELECT 
    p.username,
    p.nama_lengkap,
    p.email,
    p.created_at
FROM penulis p
LEFT JOIN admin_sessions s ON p.id_penulis = s.user_id
WHERE s.user_id IS NULL
AND p.status = 'aktif'
ORDER BY p.created_at DESC;
```

## 🚀 Quick Setup Commands

### 1. Setup Database Lengkap
```bash
# Import database utama
mysql -u root -p < database/db_berita.sql

# Import user admin
mysql -u root -p < database/create_admin_users.sql
```

### 2. Generate Password Baru
```bash
# Jalankan generator password
php database/password_generator.php
```

### 3. Test Login
```
URL: http://localhost/admin/login.html

Test dengan salah satu akun:
- superadmin / SuperAdmin2024!
- admin_bmkg / AdminBMKG2024!
- editor_senior / EditorSenior2024!
```

## 🔐 Best Practices

### Password Policy
- Minimal 8 karakter
- Kombinasi huruf besar, kecil, angka, dan simbol
- Tidak menggunakan informasi personal
- Ganti password secara berkala

### Security Guidelines
- Selalu gunakan HTTPS di production
- Monitor failed login attempts
- Review user access secara berkala
- Backup data user secara rutin
- Nonaktifkan user yang tidak diperlukan

### Role Assignment
- **Super Admin**: Hanya untuk IT administrator
- **Admin**: Untuk kepala bagian/manager
- **Editor**: Untuk staff yang menulis berita
- **Viewer**: Untuk monitoring/read-only access

## 🆘 Troubleshooting

### User Tidak Bisa Login
1. Check status user: `SELECT status FROM penulis WHERE username = 'username'`
2. Check password hash: Pastikan menggunakan `password_hash()` PHP
3. Check role: Pastikan role_id valid
4. Check session table: Mungkin ada session conflict

### Lupa Password Admin
```sql
-- Reset password ke default (password: reset123)
UPDATE penulis 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE username = 'username';
```

### User Terkunci (Rate Limited)
```sql
-- Hapus failed attempts dari security logs
DELETE FROM security_logs 
WHERE event_type = 'login_failed' 
AND JSON_EXTRACT(event_data, '$.username') = 'username';
```

---

**Catatan:** Selalu backup database sebelum melakukan perubahan besar pada user management!