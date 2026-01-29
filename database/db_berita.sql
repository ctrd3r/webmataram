-- Database untuk Sistem Manajemen Berita
-- Dibuat untuk halaman berita.html

CREATE DATABASE IF NOT EXISTS db_berita;
USE db_berita;

-- Tabel Kategori
CREATE TABLE kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    slug_kategori VARCHAR(50) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Penulis
CREATE TABLE penulis (
    id_penulis INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    foto_profil VARCHAR(255),
    bio TEXT,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Berita
CREATE TABLE berita (
    id_berita INT AUTO_INCREMENT PRIMARY KEY,
    id_kategori INT,
    id_penulis INT,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    ringkasan TEXT,
    isi_berita LONGTEXT NOT NULL,
    gambar_utama VARCHAR(255),
    alt_gambar VARCHAR(255),
    meta_description VARCHAR(160),
    tags VARCHAR(500),
    views INT DEFAULT 0,
    tanggal_publish DATETIME,
    status ENUM('draft', 'publish', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori) ON DELETE SET NULL,
    FOREIGN KEY (id_penulis) REFERENCES penulis(id_penulis) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_tanggal_publish (tanggal_publish),
    INDEX idx_kategori (id_kategori),
    INDEX idx_featured (featured)
);

-- Tabel Komentar (opsional)
CREATE TABLE komentar (
    id_komentar INT AUTO_INCREMENT PRIMARY KEY,
    id_berita INT NOT NULL,
    nama_pengunjung VARCHAR(100) NOT NULL,
    email_pengunjung VARCHAR(100) NOT NULL,
    isi_komentar TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_berita) REFERENCES berita(id_berita) ON DELETE CASCADE
);

-- Insert data sample kategori
INSERT INTO kategori (nama_kategori, slug_kategori, deskripsi) VALUES
('Gempa Bumi', 'gempa-bumi', 'Berita terkait aktivitas gempa bumi di Indonesia'),
('Cuaca', 'cuaca', 'Informasi prakiraan cuaca dan iklim'),
('Tsunami', 'tsunami', 'Peringatan dan informasi tsunami'),
('Teknologi', 'teknologi', 'Berita teknologi meteorologi dan geofisika'),
('Edukasi', 'edukasi', 'Artikel edukatif tentang fenomena alam');

-- Tabel Admin Sessions untuk manajemen login
CREATE TABLE admin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES penulis(id_penulis) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Tabel Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES penulis(id_penulis) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Tabel Security Logs untuk audit trail
CREATE TABLE security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);

-- Tabel User Roles (opsional untuk sistem role yang lebih kompleks)
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    permissions JSON,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO user_roles (role_name, permissions, description) VALUES
('super_admin', '["read", "write", "delete", "manage_users", "manage_settings", "view_logs"]', 'Super Administrator dengan akses penuh'),
('admin', '["read", "write", "delete", "moderate_comments"]', 'Administrator dengan akses manajemen konten'),
('editor', '["read", "write", "moderate_comments"]', 'Editor yang dapat menulis dan mengedit berita'),
('viewer', '["read"]', 'Hanya dapat melihat konten');

-- Tambah kolom role_id ke tabel penulis
ALTER TABLE penulis ADD COLUMN role_id INT DEFAULT 2 AFTER bio;
ALTER TABLE penulis ADD FOREIGN KEY (role_id) REFERENCES user_roles(id);

-- Insert data sample penulis dengan password yang di-hash
INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id) VALUES
('Super Admin', 'admin', 'admin@bmkg.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Administrator sistem berita BMKG', 1),
('Admin BMKG', 'bmkg_admin', 'bmkg_admin@bmkg.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator sistem berita BMKG', 2),
('Editor BMKG', 'editor', 'editor@bmkg.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Editor berita BMKG', 3),
('Tim Redaksi', 'redaksi', 'redaksi@bmkg.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tim redaksi berita BMKG', 3);

-- Insert data sample berita
INSERT INTO berita (id_kategori, id_penulis, judul, slug, ringkasan, isi_berita, gambar_utama, meta_description, tags, tanggal_publish, status, featured) VALUES
(1, 1, 'Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat', 'gempa-bumi-magnitudo-52-guncang-jawa-barat', 'Gempa bumi dengan magnitudo 5.2 mengguncang wilayah Jawa Barat pada pagi hari ini.', 
'<p>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melaporkan terjadinya gempa bumi dengan magnitudo 5.2 yang mengguncang wilayah Jawa Barat pada pukul 08:30 WIB.</p><p>Pusat gempa berada di koordinat 6.85 LS dan 107.12 BT dengan kedalaman 10 km. Gempa ini tidak berpotensi tsunami.</p>', 
'gempa-jabar-2024.jpg', 'Ilustrasi gempa bumi di Jawa Barat', 'gempa bumi, jawa barat, bmkg, magnitudo 5.2', NOW(), 'publish', TRUE),

(2, 2, 'Prakiraan Cuaca Hari Ini: Hujan Lebat di Sebagian Besar Wilayah Indonesia', 'prakiraan-cuaca-hari-ini-hujan-lebat', 'BMKG memprakirakan cuaca hari ini akan didominasi hujan lebat di sebagian besar wilayah Indonesia.', 
'<p>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) memprakirakan kondisi cuaca hari ini akan didominasi oleh hujan lebat hingga sangat lebat di sebagian besar wilayah Indonesia.</p><p>Masyarakat diimbau untuk waspada terhadap potensi banjir dan tanah longsor.</p>', 
'cuaca-hujan-2024.jpg', 'Prakiraan cuaca hujan lebat hari ini', 'cuaca, hujan lebat, prakiraan, bmkg', NOW(), 'publish', FALSE);