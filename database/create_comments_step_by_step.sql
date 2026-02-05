-- STEP BY STEP: Membuat tabel komentar untuk sistem berita BMKG
-- Jalankan satu per satu untuk menghindari error

-- STEP 1: Hapus tabel jika sudah ada (opsional)
DROP TABLE IF EXISTS `komentar`;

-- STEP 2: Buat tabel komentar
CREATE TABLE `komentar` (
  `id_komentar` int(11) NOT NULL AUTO_INCREMENT,
  `id_berita` int(11) NOT NULL,
  `nama_pengunjung` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `isi_komentar` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `tanggal_komentar` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  PRIMARY KEY (`id_komentar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- STEP 3: Tambahkan index
ALTER TABLE `komentar` ADD INDEX `idx_berita` (`id_berita`);
ALTER TABLE `komentar` ADD INDEX `idx_status` (`status`);
ALTER TABLE `komentar` ADD INDEX `idx_tanggal` (`tanggal_komentar`);

-- STEP 4: Tambahkan foreign key (jika tabel berita sudah ada)
-- Uncomment baris di bawah jika ingin menambahkan foreign key constraint
-- ALTER TABLE `komentar` ADD CONSTRAINT `fk_komentar_berita` 
-- FOREIGN KEY (`id_berita`) REFERENCES `berita` (`id_berita`) ON DELETE CASCADE;

-- STEP 5: Verifikasi struktur tabel
-- DESCRIBE komentar;