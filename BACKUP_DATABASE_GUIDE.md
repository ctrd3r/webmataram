# 📦 Panduan Backup Database SQL di Hosting

## 🎯 3 Cara Backup Database

---

## 1️⃣ Cara Manual via phpMyAdmin (Paling Mudah)

### Langkah-langkah:

1. **Login ke cPanel/Hosting Panel**
   - Buka: `https://yourdomain.com/cpanel`
   - Login dengan username & password hosting

2. **Buka phpMyAdmin**
   - Cari menu "Databases" atau "Database"
   - Klik "phpMyAdmin"

3. **Pilih Database**
   - Di sidebar kiri, klik nama database Anda (contoh: `db_berita`)

4. **Export Database**
   - Klik tab "Export" di menu atas
   - Pilih metode: **Quick** (untuk backup cepat) atau **Custom** (untuk opsi lengkap)

5. **Pilih Format**
   - Format: **SQL**
   - Compression: **gzip** (untuk file lebih kecil)

6. **Download**
   - Klik tombol "Go" atau "Export"
   - File akan terdownload: `db_berita.sql.gz` atau `db_berita.sql`

### Kelebihan:
✅ Mudah, tidak perlu coding
✅ Bisa pilih tabel tertentu
✅ Bisa compress otomatis (gzip)
✅ Tersedia di semua hosting

### Kekurangan:
❌ Manual (harus dilakukan sendiri)
❌ Tidak otomatis
❌ Bisa timeout untuk database besar

---

## 2️⃣ Cara Otomatis via PHP Script

### Buat File: `backup_database.php`

```php
<?php
/**
 * Automatic Database Backup Script
 * Usage: Jalankan via browser atau cron job
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'db_berita');
define('DB_USER', 'bmkg_user');
define('DB_PASS', 'bmkg_pass_2024');

// Backup Configuration
$backupDir = __DIR__ . '/backups/';
$backupFile = 'backup_' . DB_NAME . '_' . date('Y-m-d_H-i-s') . '.sql';
$backupPath = $backupDir . $backupFile;

// Create backup directory if not exists
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Build mysqldump command
$command = sprintf(
    'mysqldump --host=%s --user=%s --password=%s %s > %s',
    escapeshellarg(DB_HOST),
    escapeshellarg(DB_USER),
    escapeshellarg(DB_PASS),
    escapeshellarg(DB_NAME),
    escapeshellarg($backupPath)
);

// Execute backup
exec($command, $output, $returnVar);

if ($returnVar === 0) {
    // Success
    $fileSize = filesize($backupPath);
    $fileSizeMB = round($fileSize / 1024 / 1024, 2);
    
    echo "✅ Backup berhasil!\n";
    echo "📁 File: $backupFile\n";
    echo "📊 Size: $fileSizeMB MB\n";
    echo "📍 Path: $backupPath\n";
    
    // Optional: Compress with gzip
    if (function_exists('gzencode')) {
        $compressed = gzencode(file_get_contents($backupPath), 9);
        file_put_contents($backupPath . '.gz', $compressed);
        unlink($backupPath); // Delete uncompressed file
        
        $compressedSize = filesize($backupPath . '.gz');
        $compressedSizeMB = round($compressedSize / 1024 / 1024, 2);
        
        echo "🗜️ Compressed: $backupFile.gz\n";
        echo "📊 Compressed Size: $compressedSizeMB MB\n";
    }
    
    // Optional: Delete old backups (keep last 7 days)
    $files = glob($backupDir . 'backup_*.sql*');
    $now = time();
    foreach ($files as $file) {
        if (is_file($file)) {
            if ($now - filemtime($file) >= 7 * 24 * 60 * 60) { // 7 days
                unlink($file);
                echo "🗑️ Deleted old backup: " . basename($file) . "\n";
            }
        }
    }
    
} else {
    echo "❌ Backup gagal!\n";
    echo "Error: " . implode("\n", $output) . "\n";
}
?>
```

### Cara Menggunakan:

**Via Browser:**
```
http://yourdomain.com/backup_database.php
```

**Via Cron Job (Otomatis):**
```bash
# Backup setiap hari jam 2 pagi
0 2 * * * /usr/bin/php /path/to/backup_database.php
```

### Kelebihan:
✅ Bisa otomatis via cron job
✅ Bisa compress otomatis
✅ Bisa hapus backup lama otomatis
✅ Tidak timeout

### Kekurangan:
❌ Perlu akses mysqldump di server
❌ Perlu setup cron job untuk otomatis

---

## 3️⃣ Cara via Command Line (SSH)

### Jika Punya Akses SSH:

**1. Login SSH:**
```bash
ssh username@yourdomain.com
```

**2. Backup Database:**
```bash
mysqldump -u bmkg_user -p db_berita > backup_$(date +%Y%m%d_%H%M%S).sql
```

**3. Compress (Optional):**
```bash
gzip backup_*.sql
```

**4. Download via SCP:**
```bash
# Dari komputer lokal
scp username@yourdomain.com:/path/to/backup_*.sql.gz ./
```

### Backup Semua Database Sekaligus:
```bash
mysqldump -u bmkg_user -p --all-databases > backup_all_$(date +%Y%m%d_%H%M%S).sql
```

### Kelebihan:
✅ Paling cepat
✅ Bisa backup semua database sekaligus
✅ Bisa otomatis via cron

### Kekurangan:
❌ Perlu akses SSH
❌ Perlu pengetahuan command line

---

## 🔄 Backup Otomatis dengan Cron Job

### Setup di cPanel:

1. **Buka Cron Jobs**
   - Login cPanel
   - Cari "Cron Jobs"

2. **Add New Cron Job**
   - Common Settings: **Once Per Day (0 0 * * *)**
   - Command:
   ```bash
   /usr/bin/php /home/username/public_html/backup_database.php
   ```

3. **Save**

### Jadwal Backup yang Disarankan:

```bash
# Setiap hari jam 2 pagi
0 2 * * * /usr/bin/php /path/to/backup_database.php

# Setiap 6 jam
0 */6 * * * /usr/bin/php /path/to/backup_database.php

# Setiap Minggu (Minggu jam 3 pagi)
0 3 * * 0 /usr/bin/php /path/to/backup_database.php

# Setiap Bulan (tanggal 1 jam 4 pagi)
0 4 1 * * /usr/bin/php /path/to/backup_database.php
```

---

## 📥 Restore Database dari Backup

### Via phpMyAdmin:

1. Login phpMyAdmin
2. Pilih database
3. Klik tab "Import"
4. Choose file: Pilih file backup (.sql atau .sql.gz)
5. Klik "Go"

### Via Command Line:

```bash
# Restore dari .sql
mysql -u bmkg_user -p db_berita < backup_20260204.sql

# Restore dari .sql.gz
gunzip < backup_20260204.sql.gz | mysql -u bmkg_user -p db_berita
```

### Via PHP Script:

```php
<?php
$backupFile = 'backup_20260204.sql';
$command = sprintf(
    'mysql --host=%s --user=%s --password=%s %s < %s',
    escapeshellarg('localhost'),
    escapeshellarg('bmkg_user'),
    escapeshellarg('bmkg_pass_2024'),
    escapeshellarg('db_berita'),
    escapeshellarg($backupFile)
);
exec($command, $output, $returnVar);
echo $returnVar === 0 ? "✅ Restore berhasil!" : "❌ Restore gagal!";
?>
```

---

## 🛡️ Best Practices

### 1. Backup Schedule
- **Harian**: Untuk website aktif dengan update sering
- **Mingguan**: Untuk website dengan update jarang
- **Sebelum Update**: Selalu backup sebelum update besar

### 2. Backup Storage
- ✅ Simpan di server (folder backups/)
- ✅ Download ke komputer lokal
- ✅ Upload ke cloud storage (Google Drive, Dropbox)
- ✅ Simpan di GitHub (private repo)

### 3. Backup Retention
- Keep last 7 daily backups
- Keep last 4 weekly backups
- Keep last 12 monthly backups

### 4. Security
- ⚠️ Protect backup folder dengan .htaccess
- ⚠️ Jangan simpan password di file yang public
- ⚠️ Encrypt backup file jika berisi data sensitif

### 5. Testing
- ✅ Test restore backup secara berkala
- ✅ Verify backup file tidak corrupt
- ✅ Check backup file size (jangan 0 bytes)

---

## 🔒 Protect Backup Folder

### Buat file: `backups/.htaccess`

```apache
# Deny access to backup folder
Order Deny,Allow
Deny from all

# Allow only from specific IP (optional)
# Allow from 123.456.789.0
```

---

## 📊 Monitoring Backup

### Check Backup Status Script: `check_backup.php`

```php
<?php
$backupDir = __DIR__ . '/backups/';
$files = glob($backupDir . 'backup_*.sql*');

if (empty($files)) {
    echo "⚠️ No backups found!\n";
    exit;
}

// Get latest backup
$latestBackup = max($files);
$backupAge = time() - filemtime($latestBackup);
$backupAgeHours = round($backupAge / 3600, 1);

echo "📁 Latest backup: " . basename($latestBackup) . "\n";
echo "📅 Age: $backupAgeHours hours ago\n";
echo "📊 Size: " . round(filesize($latestBackup) / 1024 / 1024, 2) . " MB\n";
echo "📈 Total backups: " . count($files) . "\n";

// Alert if backup too old (> 24 hours)
if ($backupAgeHours > 24) {
    echo "⚠️ WARNING: Backup is older than 24 hours!\n";
}
?>
```

---

## 🚀 Quick Start

### Untuk Pemula (Cara Termudah):

1. **Login cPanel**
2. **Buka phpMyAdmin**
3. **Pilih database `db_berita`**
4. **Klik Export**
5. **Pilih Quick + SQL + gzip**
6. **Klik Go**
7. **Download file**
8. **Simpan di tempat aman**

**Selesai!** File backup sudah tersimpan di komputer Anda.

### Untuk Advanced (Otomatis):

1. **Upload `backup_database.php` ke server**
2. **Setup Cron Job di cPanel**
3. **Test sekali via browser**
4. **Biarkan berjalan otomatis**

---

## 📞 Troubleshooting

### Error: "mysqldump: command not found"
**Solution**: Gunakan cara manual via phpMyAdmin

### Error: "Access denied"
**Solution**: Cek username & password database di config

### Error: "Timeout"
**Solution**: 
- Gunakan PHP script instead of phpMyAdmin
- Atau backup per tabel

### Backup file 0 bytes
**Solution**:
- Cek permission folder backups/ (harus 755)
- Cek disk space server
- Cek error log

---

## 📋 Checklist Backup

- [ ] Backup database via phpMyAdmin
- [ ] Download backup ke komputer lokal
- [ ] Upload backup ke cloud storage
- [ ] Test restore backup
- [ ] Setup automatic backup (cron job)
- [ ] Protect backup folder (.htaccess)
- [ ] Monitor backup status
- [ ] Delete old backups (keep last 7 days)

---

**Rekomendasi**: Gunakan cara #1 (phpMyAdmin) untuk backup manual, dan cara #2 (PHP Script + Cron) untuk backup otomatis.
