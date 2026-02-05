# Cara Setup Database Komentar - Step by Step

## 🚨 **ERROR YANG TERJADI:**
```
#1054 - Unknown column 'email' in 'field list'
```

**Penyebab:** Tabel `komentar` belum dibuat dengan benar atau tidak ada sama sekali.

---

## ✅ **SOLUSI STEP-BY-STEP:**

### **STEP 1: Buka phpMyAdmin**
1. Buka browser: `http://localhost/phpmyadmin`
2. Login dengan username/password database
3. Klik database `db_berita` di sidebar kiri

### **STEP 2: Cek Apakah Tabel Komentar Sudah Ada**
1. Lihat di daftar tabel, apakah ada tabel `komentar`?
2. Jika **ADA** tabel `komentar`:
   - Klik tabel `komentar`
   - Klik tab **"Structure"**
   - Cek apakah ada kolom `email`
   - Jika struktur tidak sesuai, **hapus tabel** dengan: `DROP TABLE komentar;`

### **STEP 3: Buat Tabel Komentar (Cara Manual)**
1. Klik tab **"SQL"** di phpMyAdmin
2. Copy-paste script berikut:

```sql
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
```

3. Klik **"Go"** atau **"Jalankan"**

### **STEP 4: Tambahkan Index**
```sql
ALTER TABLE `komentar` ADD INDEX `idx_berita` (`id_berita`);
ALTER TABLE `komentar` ADD INDEX `idx_status` (`status`);
ALTER TABLE `komentar` ADD INDEX `idx_tanggal` (`tanggal_komentar`);
```

### **STEP 5: Verifikasi Tabel Berhasil Dibuat**
```sql
DESCRIBE komentar;
```

**Expected Result:**
```
+-------------------+----------------------------------+------+-----+-------------------+
| Field             | Type                             | Null | Key | Default           |
+-------------------+----------------------------------+------+-----+-------------------+
| id_komentar       | int(11)                          | NO   | PRI | NULL              |
| id_berita         | int(11)                          | NO   | MUL | NULL              |
| nama_pengunjung   | varchar(100)                     | NO   |     | NULL              |
| email             | varchar(100)                     | YES  |     | NULL              |
| isi_komentar      | text                             | NO   |     | NULL              |
| status            | enum('pending','approved','rejected') | NO   | MUL | pending           |
| tanggal_komentar  | timestamp                        | NO   | MUL | CURRENT_TIMESTAMP |
| ip_address        | varchar(45)                      | YES  |     | NULL              |
| user_agent        | text                             | YES  |     | NULL              |
+-------------------+----------------------------------+------+-----+-------------------+
```

### **STEP 6: Insert Sample Data**
```sql
INSERT INTO `komentar` (`id_berita`, `nama_pengunjung`, `email`, `isi_komentar`, `status`, `tanggal_komentar`, `ip_address`) VALUES
(1, 'Ahmad Wijaya', 'ahmad@email.com', 'Terima kasih atas informasi gempa bumi yang sangat berguna. Semoga BMKG terus memberikan update terkini.', 'approved', '2026-02-05 08:30:00', '192.168.1.100'),
(1, 'Siti Nurhaliza', 'siti@email.com', 'Apakah ada kemungkinan gempa susulan? Mohon informasinya.', 'approved', '2026-02-05 09:15:00', '192.168.1.101'),
(2, 'Budi Santoso', 'budi@email.com', 'Prakiraan cuaca sangat membantu untuk aktivitas sehari-hari. Terima kasih BMKG!', 'approved', '2026-02-05 10:00:00', '192.168.1.102'),
(1, 'Rina Kusuma', 'rina@email.com', 'Informasi yang sangat bermanfaat, semoga masyarakat lebih waspada.', 'pending', '2026-02-05 11:30:00', '192.168.1.103'),
(2, 'Dedi Kurniawan', 'dedi@email.com', 'Cuaca hari ini memang tidak menentu, terima kasih infonya.', 'pending', '2026-02-05 12:00:00', '192.168.1.104'),
(1, 'Spam User', 'spam@spam.com', 'Ini adalah komentar spam yang tidak relevan dengan berita.', 'rejected', '2026-02-05 13:00:00', '192.168.1.105');
```

### **STEP 7: Verifikasi Data Berhasil Diinsert**
```sql
SELECT COUNT(*) as total_comments FROM komentar;
SELECT status, COUNT(*) as count FROM komentar GROUP BY status;
```

**Expected Result:**
```
total_comments: 6

status    | count
----------|------
approved  | 3
pending   | 2
rejected  | 1
```

---

## 🧪 **TESTING:**

### **1. Test API Komentar:**
Buka: `http://10.21.224.146/api/get_comments.php`

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "id_komentar": "1",
      "nama_pengunjung": "Ahmad Wijaya",
      "email": "ahmad@email.com",
      "isi_komentar": "Terima kasih atas informasi...",
      "status": "approved",
      "judul_berita": "Gempa Bumi Magnitudo 5.2..."
    }
  ]
}
```

### **2. Test Admin Panel:**
1. Buka: `http://10.21.224.146/admin/index.html`
2. Klik menu **"Komentar"**
3. Seharusnya menampilkan tabel dengan 6 komentar

### **3. Test Debug Tool:**
Buka: `http://10.21.224.146/admin/debug-sections.html`

---

## 🚨 **TROUBLESHOOTING:**

### **Jika Masih Error "Unknown column 'email'":**
1. **Hapus tabel lama:**
   ```sql
   DROP TABLE IF EXISTS komentar;
   ```

2. **Buat ulang dengan script di atas**

### **Jika Error Foreign Key:**
```sql
-- Jangan gunakan foreign key dulu, buat tabel tanpa constraint:
-- Skip bagian FOREIGN KEY saat membuat tabel
```

### **Jika Berita ID 1 dan 2 Tidak Ada:**
```sql
-- Cek berita yang ada:
SELECT id_berita, judul FROM berita LIMIT 5;

-- Gunakan ID yang ada untuk sample data
```

---

## ✅ **SETELAH BERHASIL:**

1. **Admin panel komentar** akan menampilkan 6 komentar sample
2. **Filter status** akan berfungsi (pending/approved/rejected)
3. **API komentar** akan return JSON yang benar
4. **Semua section admin** akan berfungsi dengan baik

Ikuti step-by-step di atas dengan hati-hati, dan admin panel komentar akan berfungsi dengan sempurna! 🎉