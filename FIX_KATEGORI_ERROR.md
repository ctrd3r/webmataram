# Fix Error "Terjadi kesalahan saat menambahkan kategori"

## Masalah
Function `getDBConnection()` tidak ditemukan karena:
1. File `config.php` di server belum terupdate
2. Kredensial database berbeda antara file lokal dan server

## Solusi Cepat

### Langkah 1: Test Database Connection
Buka di browser:
```
http://10.21.224.146/api/test_db_direct.php
```

File ini akan test koneksi database langsung tanpa config.php.

**Jika gagal**, edit file `api/test_db_direct.php` baris 12-15:
```php
$db_host = 'localhost';
$db_user = 'bmkg_user';  // Ganti dengan username database Anda
$db_pass = 'bmkg_pass_2024';  // Ganti dengan password database Anda
$db_name = 'db_berita';
```

### Langkah 2: Update config.php di Server

**PENTING**: File `api/config.php` di server Anda harus diupdate!

Ada 2 cara:

#### Cara 1: Manual Edit (Recommended)
1. Buka file `api/config.php` di server
2. Pastikan ada function `getDBConnection()` di bagian bawah file (sebelum `?>`):

```php
// Helper function for mysqli connection
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        error_log('Database connection failed: ' . $conn->connect_error);
        return null;
    }
    
    $conn->set_charset(DB_CHARSET);
    return $conn;
}
?>
```

3. Pastikan kredensial database benar:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'db_berita');
define('DB_USER', 'bmkg_user');  // Sesuaikan
define('DB_PASS', 'bmkg_pass_2024');  // Sesuaikan
```

#### Cara 2: Replace File
1. Backup file lama: `cp api/config.php api/config.php.backup`
2. Copy file baru: `cp api/config_new.php api/config.php`
3. Edit kredensial database di baris 8-9 jika perlu

### Langkah 3: Clear Cache
Setelah update config.php:

1. **Clear PHP OPcache** (jika ada):
   - Restart Apache di XAMPP Control Panel
   - Atau buat file `clear_cache.php`:
   ```php
   <?php
   if (function_exists('opcache_reset')) {
       opcache_reset();
       echo "OPcache cleared!";
   } else {
       echo "OPcache not enabled";
   }
   ?>
   ```

2. **Clear Browser Cache**:
   - Tekan Ctrl+Shift+Delete
   - Atau hard refresh: Ctrl+F5

### Langkah 4: Test API
Buka di browser:
```
http://10.21.224.146/api/manage_categories.php?action=list
```

Harus return JSON:
```json
{
    "success": true,
    "message": "Categories retrieved successfully",
    "data": [...]
}
```

### Langkah 5: Test Admin Panel
1. Buka admin panel: `http://10.21.224.146/admin/index.html`
2. Login
3. Klik menu "Kategori"
4. Klik tombol "Tambah Kategori"
5. Isi form dan submit

## Troubleshooting

### Error: "Access denied for user"
Kredensial database salah. Edit `api/config.php`:
```php
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### Error: "Unknown database 'db_berita'"
Database belum dibuat. Jalankan:
```sql
CREATE DATABASE db_berita;
USE db_berita;
SOURCE database/db_berita.sql;
```

### Error: "Table 'kategori' doesn't exist"
Import database:
```
mysql -u bmkg_user -p db_berita < database/db_berita.sql
```

### Masih Error?
1. Cek PHP error log: `/var/log/apache2/error.log` atau `C:\xampp\apache\logs\error.log`
2. Cek browser console (F12) untuk JavaScript errors
3. Cek Network tab untuk API response

## Verifikasi

Setelah semua langkah, test:

✅ `test_db_direct.php` - Harus sukses semua test
✅ `manage_categories.php?action=list` - Return JSON dengan success: true
✅ Admin panel - Bisa tambah kategori tanpa error

## File yang Dibuat

1. `api/test_db_direct.php` - Test database langsung
2. `api/config_new.php` - Config file yang sudah diperbaiki
3. `FIX_KATEGORI_ERROR.md` - Panduan ini

---

**Catatan**: Function `getDBConnection()` HARUS ada di `api/config.php` karena digunakan oleh:
- `api/manage_categories.php`
- `api/manage_news.php`

Tanpa function ini, kedua API tidak akan berfungsi!
