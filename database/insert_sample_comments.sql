-- STEP 6: Insert sample comments (jalankan setelah tabel berhasil dibuat)
-- Pastikan tabel komentar sudah ada dan berita dengan id 1 dan 2 sudah ada

INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(1, 'Ahmad Wijaya', 'ahmad@email.com', 'Terima kasih atas informasi gempa bumi yang sangat berguna. Semoga BMKG terus memberikan update terkini.', 'approved', '2026-02-05 08:30:00', '192.168.1.100');

INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(1, 'Siti Nurhaliza', 'siti@email.com', 'Apakah ada kemungkinan gempa susulan? Mohon informasinya.', 'approved', '2026-02-05 09:15:00', '192.168.1.101');

INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(2, 'Budi Santoso', 'budi@email.com', 'Prakiraan cuaca sangat membantu untuk aktivitas sehari-hari. Terima kasih BMKG!', 'approved', '2026-02-05 10:00:00', '192.168.1.102');

INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(1, 'Rina Kusuma', 'rina@email.com', 'Informasi yang sangat bermanfaat, semoga masyarakat lebih waspada.', 'pending', '2026-02-05 11:30:00', '192.168.1.103');

INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(2, 'Dedi Kurniawan', 'dedi@email.com', 'Cuaca hari ini memang tidak menentu, terima kasih infonya.', 'pending', '2026-02-05 12:00:00', '192.168.1.104');

INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(1, 'Spam User', 'spam@spam.com', 'Ini adalah komentar spam yang tidak relevan dengan berita.', 'rejected', '2026-02-05 13:00:00', '192.168.1.105');

-- Verifikasi data berhasil diinsert
SELECT COUNT(*) as total_comments FROM komentar;
SELECT status, COUNT(*) as count FROM komentar GROUP BY status;