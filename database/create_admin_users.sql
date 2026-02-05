-- Script untuk membuat user admin BMKG News
-- File: database/create_admin_users.sql

USE db_berita;

-- ========================================
-- MEMBUAT USER ADMIN BARU
-- ========================================

-- 1. Membuat Super Admin
-- Password: superadmin123 (ganti setelah login pertama)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Super Administrator', 'superadmin', 'superadmin@bmkg.go.id', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Super Administrator dengan akses penuh sistem', 1, 'aktif');

-- 2. Membuat Admin BMKG
-- Password: bmkgadmin2024 (ganti setelah login pertama)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Administrator BMKG', 'admin_bmkg', 'admin@bmkg.go.id', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Administrator utama sistem berita BMKG', 2, 'aktif');

-- 3. Membuat Editor Senior
-- Password: editor2024 (ganti setelah login pertama)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Editor Senior BMKG', 'editor_senior', 'editor.senior@bmkg.go.id', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Editor senior untuk review dan publikasi berita', 3, 'aktif');

-- 4. Membuat Editor Junior
-- Password: junior2024 (ganti setelah login pertama)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Editor Junior BMKG', 'editor_junior', 'editor.junior@bmkg.go.id', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Editor junior untuk penulisan dan editing berita', 3, 'aktif');

-- 5. Membuat Moderator
-- Password: moderator2024 (ganti setelah login pertama)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Moderator Konten', 'moderator', 'moderator@bmkg.go.id', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Moderator untuk mengelola komentar dan konten', 4, 'aktif');

-- ========================================
-- MEMBUAT USER DENGAN PASSWORD CUSTOM
-- ========================================

-- Contoh membuat user dengan password yang sudah di-hash
-- Untuk generate password hash, gunakan PHP:
-- echo password_hash('password_anda', PASSWORD_DEFAULT);

-- Contoh user dengan password kustom
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Nama User Baru', 'username_baru', 'email@bmkg.go.id', 
 'HASH_PASSWORD_DISINI', 
 'Deskripsi user', 2, 'aktif');

-- ========================================
-- QUERY UNTUK MELIHAT USER YANG ADA
-- ========================================

-- Melihat semua user dengan role
SELECT 
    p.id_penulis,
    p.nama_lengkap,
    p.username,
    p.email,
    p.status,
    r.role_name,
    r.description as role_description,
    p.created_at
FROM penulis p
LEFT JOIN user_roles r ON p.role_id = r.id
ORDER BY p.created_at DESC;

-- ========================================
-- QUERY UNTUK UPDATE USER
-- ========================================

-- Update password user (ganti 'username' dengan username yang sebenarnya)
-- UPDATE penulis SET password = '$2y$10$NEW_HASH_PASSWORD' WHERE username = 'username';

-- Update role user
-- UPDATE penulis SET role_id = 2 WHERE username = 'username';

-- Update status user (aktif/nonaktif)
-- UPDATE penulis SET status = 'nonaktif' WHERE username = 'username';

-- Update informasi user
-- UPDATE penulis SET 
--     nama_lengkap = 'Nama Baru',
--     email = 'email_baru@bmkg.go.id',
--     bio = 'Bio baru'
-- WHERE username = 'username';

-- ========================================
-- QUERY UNTUK HAPUS USER
-- ========================================

-- Soft delete (nonaktifkan user)
-- UPDATE penulis SET status = 'nonaktif' WHERE username = 'username';

-- Hard delete (hapus permanen) - HATI-HATI!
-- DELETE FROM penulis WHERE username = 'username';

-- ========================================
-- QUERY UNTUK RESET PASSWORD
-- ========================================

-- Reset password ke default (password: reset123)
-- UPDATE penulis SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
-- WHERE username = 'username';

-- ========================================
-- QUERY MONITORING & SECURITY
-- ========================================

-- Melihat session aktif
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

-- Melihat log keamanan terbaru
SELECT 
    event_type,
    event_data,
    ip_address,
    created_at
FROM security_logs
ORDER BY created_at DESC
LIMIT 50;

-- Melihat failed login attempts
SELECT 
    JSON_EXTRACT(event_data, '$.username') as username,
    COUNT(*) as failed_attempts,
    MAX(created_at) as last_attempt
FROM security_logs
WHERE event_type = 'login_failed'
AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
GROUP BY JSON_EXTRACT(event_data, '$.username')
ORDER BY failed_attempts DESC;

-- ========================================
-- MAINTENANCE QUERIES
-- ========================================

-- Hapus session yang expired
DELETE FROM admin_sessions WHERE expires_at < NOW();

-- Hapus token reset password yang expired
DELETE FROM password_reset_tokens WHERE expires_at < NOW();

-- Hapus log keamanan yang lebih dari 30 hari
DELETE FROM security_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ========================================
-- BACKUP USER DATA
-- ========================================

-- Backup semua user data
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

-- ========================================
-- STATISTIK USER
-- ========================================

-- Jumlah user per role
SELECT 
    r.role_name,
    COUNT(p.id_penulis) as jumlah_user
FROM user_roles r
LEFT JOIN penulis p ON r.id = p.role_id AND p.status = 'aktif'
GROUP BY r.id, r.role_name
ORDER BY jumlah_user DESC;

-- User yang belum pernah login
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

-- User yang aktif dalam 7 hari terakhir
SELECT DISTINCT
    p.username,
    p.nama_lengkap,
    MAX(s.updated_at) as last_activity
FROM penulis p
JOIN admin_sessions s ON p.id_penulis = s.user_id
WHERE s.updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY p.id_penulis, p.username, p.nama_lengkap
ORDER BY last_activity DESC;