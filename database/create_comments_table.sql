-- Membuat tabel komentar untuk sistem berita BMKG
-- File: database/create_comments_table.sql

CREATE TABLE IF NOT EXISTS `komentar` (
  `id_komentar` int(11) NOT NULL AUTO_INCREMENT,
  `id_berita` int(11) NOT NULL,
  `nama_pengunjung` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `isi_komentar` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `tanggal_komentar` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  PRIMARY KEY (`id_komentar`),
  KEY `idx_berita` (`id_berita`),
  KEY `idx_status` (`status`),
  KEY `idx_tanggal` (`tanggal_komentar`),
  FOREIGN KEY (`id_berita`) REFERENCES `berita` (`id_berita`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menambahkan beberapa komentar contoh
INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(1, 'Ahmad Wijaya', 'ahmad@email.com', 'Terima kasih atas informasi gempa bumi yang sangat berguna. Semoga BMKG terus memberikan update terkini.', 'approved', '2026-02-05 08:30:00', '192.168.1.100'),
(1, 'Siti Nurhaliza', 'siti@email.com', 'Apakah ada kemungkinan gempa susulan? Mohon informasinya.', 'approved', '2026-02-05 09:15:00', '192.168.1.101'),
(2, 'Budi Santoso', 'budi@email.com', 'Prakiraan cuaca sangat membantu untuk aktivitas sehari-hari. Terima kasih BMKG!', 'approved', '2026-02-05 10:00:00', '192.168.1.102'),
(1, 'Rina Kusuma', 'rina@email.com', 'Informasi yang sangat bermanfaat, semoga masyarakat lebih waspada.', 'pending', '2026-02-05 11:30:00', '192.168.1.103'),
(2, 'Dedi Kurniawan', 'dedi@email.com', 'Cuaca hari ini memang tidak menentu, terima kasih infonya.', 'pending', '2026-02-05 12:00:00', '192.168.1.104'),
(1, 'Spam User', 'spam@spam.com', 'Ini adalah komentar spam yang tidak relevan dengan berita.', 'rejected', '2026-02-05 13:00:00', '192.168.1.105');

-- Menambahkan index untuk performa yang lebih baik
CREATE INDEX idx_komentar_berita_status ON komentar(id_berita, status);
CREATE INDEX idx_komentar_email ON komentar(email);