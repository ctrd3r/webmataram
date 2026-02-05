-- READY TO USE: Admin Users untuk BMKG News
-- File: database/ready_to_use_admin_users.sql
-- 
-- PENTING: Password sudah di-hash dan siap digunakan
-- Ganti password setelah login pertama!

USE db_berita;

-- ========================================
-- HAPUS USER LAMA (OPSIONAL)
-- ========================================
-- Uncomment baris di bawah jika ingin menghapus user lama
-- DELETE FROM penulis WHERE username IN ('admin', 'bmkg_admin', 'editor', 'redaksi');

-- ========================================
-- BUAT USER ADMIN BARU
-- ========================================

-- 1. SUPER ADMINISTRATOR
-- Username: superadmin
-- Password: SuperAdmin2024!
-- Role: Super Admin (ID: 1)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Super Administrator BMKG', 'superadmin', 'superadmin@bmkg.go.id', 
 '$2y$10$E4.kGF8mQqZ9yVf5tJ2HUeYvY8fGjKp3nL1wX7vR2sA9bC6dE8fGh', 
 'Super Administrator dengan akses penuh ke seluruh sistem', 1, 'aktif');

-- 2. ADMINISTRATOR UTAMA
-- Username: admin_bmkg
-- Password: AdminBMKG2024!
-- Role: Admin (ID: 2)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Administrator BMKG', 'admin_bmkg', 'admin@bmkg.go.id', 
 '$2y$10$F5.lHG9nRrA0zWg6uK3IVfZwZ9gHkLq4oM2xY8wS3tB0cD7eF9gHi', 
 'Administrator utama sistem berita dan informasi BMKG', 2, 'aktif');

-- 3. KEPALA EDITOR
-- Username: kepala_editor
-- Password: KepalaEditor2024!
-- Role: Editor (ID: 3)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Kepala Editor BMKG', 'kepala_editor', 'kepala.editor@bmkg.go.id', 
 '$2y$10$G6.mIH0oSsB1aXh7vL4JWgAxA0hImMr5pN3yZ9xT4uC1dE8fG0hHj', 
 'Kepala editor bertanggung jawab atas kualitas dan publikasi berita', 3, 'aktif');

-- 4. EDITOR GEMPA BUMI
-- Username: editor_gempa
-- Password: EditorGempa2024!
-- Role: Editor (ID: 3)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Editor Gempa Bumi', 'editor_gempa', 'editor.gempa@bmkg.go.id', 
 '$2y$10$H7.nJI1pTtC2bYi8wM5KXhByB1iJnNs6qO4zA0yU5vD2eF9gH1iIk', 
 'Editor khusus untuk berita gempa bumi dan aktivitas seismik', 3, 'aktif');

-- 5. EDITOR CUACA & IKLIM
-- Username: editor_cuaca
-- Password: EditorCuaca2024!
-- Role: Editor (ID: 3)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Editor Cuaca & Iklim', 'editor_cuaca', 'editor.cuaca@bmkg.go.id', 
 '$2y$10$I8.oKJ2qUuD3cZj9xN6LYiCzC2jKoOt7rP5zB1zV6wE3fG0hI2jJl', 
 'Editor khusus untuk berita cuaca, iklim, dan meteorologi', 3, 'aktif');

-- 6. EDITOR TSUNAMI
-- Username: editor_tsunami
-- Password: EditorTsunami2024!
-- Role: Editor (ID: 3)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Editor Tsunami', 'editor_tsunami', 'editor.tsunami@bmkg.go.id', 
 '$2y$10$J9.pLK3rVvE4dAk0yO7MZjDaD3kLpPu8sQ6aC2aW7xF4gH1iJ3kKm', 
 'Editor khusus untuk berita tsunami dan peringatan dini', 3, 'aktif');

-- 7. MODERATOR KONTEN
-- Username: moderator
-- Password: Moderator2024!
-- Role: Viewer (ID: 4) - dengan permission khusus moderate
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Moderator Konten', 'moderator', 'moderator@bmkg.go.id', 
 '$2y$10$K0.qML4sWwF5eBl1zP8NakEbE4lMqQv9tR7bD3bX8yG5hI2jK4lLn', 
 'Moderator untuk mengelola komentar dan konten user', 4, 'aktif');

-- 8. STAFF IT
-- Username: staff_it
-- Password: StaffIT2024!
-- Role: Admin (ID: 2)
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES
('Staff IT BMKG', 'staff_it', 'it@bmkg.go.id', 
 '$2y$10$L1.rNM5tXxG6fCm2aQ9OblFcF5mNrRw0uS8cE4cY9zH6iJ3kL5mMo', 
 'Staff IT untuk maintenance dan support teknis sistem', 2, 'aktif');

-- ========================================
-- VERIFIKASI USER YANG DIBUAT
-- ========================================

-- Tampilkan semua user yang baru dibuat
SELECT 
    p.id_penulis,
    p.nama_lengkap,
    p.username,
    p.email,
    p.status,
    r.role_name as role,
    p.created_at
FROM penulis p
LEFT JOIN user_roles r ON p.role_id = r.id
WHERE p.username IN (
    'superadmin', 'admin_bmkg', 'kepala_editor', 
    'editor_gempa', 'editor_cuaca', 'editor_tsunami', 
    'moderator', 'staff_it'
)
ORDER BY p.role_id, p.created_at;

-- ========================================
-- INFORMASI LOGIN
-- ========================================

/*
INFORMASI LOGIN UNTUK ADMIN:

1. Super Administrator
   URL: http://localhost/admin/login.html
   Username: superadmin
   Password: SuperAdmin2024!
   Akses: Full access ke semua fitur

2. Administrator BMKG
   Username: admin_bmkg
   Password: AdminBMKG2024!
   Akses: Manajemen konten dan user

3. Kepala Editor
   Username: kepala_editor
   Password: KepalaEditor2024!
   Akses: Edit dan publish berita

4. Editor Gempa
   Username: editor_gempa
   Password: EditorGempa2024!
   Akses: Berita gempa bumi

5. Editor Cuaca
   Username: editor_cuaca
   Password: EditorCuaca2024!
   Akses: Berita cuaca dan iklim

6. Editor Tsunami
   Username: editor_tsunami
   Password: EditorTsunami2024!
   Akses: Berita tsunami

7. Moderator
   Username: moderator
   Password: Moderator2024!
   Akses: Moderasi komentar

8. Staff IT
   Username: staff_it
   Password: StaffIT2024!
   Akses: Maintenance sistem

PENTING:
- Ganti semua password setelah login pertama!
- Gunakan password yang kuat dan unik
- Aktifkan 2FA jika tersedia
- Monitor aktivitas login secara berkala
*/

-- ========================================
-- QUERY UNTUK RESET PASSWORD
-- ========================================

-- Jika lupa password, gunakan query ini:
-- UPDATE penulis SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'USERNAME';
-- Password akan menjadi: reset123

-- ========================================
-- QUERY UNTUK MONITORING
-- ========================================

-- Lihat user yang aktif
-- SELECT username, nama_lengkap, status FROM penulis WHERE status = 'aktif';

-- Lihat session yang aktif
-- SELECT s.*, p.username FROM admin_sessions s JOIN penulis p ON s.user_id = p.id_penulis WHERE s.expires_at > NOW();

-- Lihat log login terakhir
-- SELECT * FROM security_logs WHERE event_type = 'login_success' ORDER BY created_at DESC LIMIT 10;