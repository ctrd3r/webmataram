# Troubleshooting Admin Panel

## Error: "Terjadi kesalahan saat menambahkan kategori"

### Langkah Troubleshooting:

#### 1. Test API Endpoint
Buka di browser:
```
http://10.21.224.146/api/test_categories.php
```

File ini akan mengecek:
- ✅ Config file loaded
- ✅ Database connection
- ✅ Table kategori exists
- ✅ Existing categories
- ✅ API endpoint

#### 2. Cek Browser Console
1. Buka admin panel
2. Tekan F12 untuk buka Developer Tools
3. Klik tab "Console"
4. Coba tambah kategori lagi
5. Lihat error message di console

#### 3. Cek Network Tab
1. Buka Developer Tools (F12)
2. Klik tab "Network"
3. Coba tambah kategori
4. Klik request ke `manage_categories.php`
5. Lihat:
   - **Status Code**: Harus 200 atau 201
   - **Response**: Lihat pesan error
   - **Request Payload**: Pastikan data terkirim

#### 4. Verifikasi Database

**Cek database exists:**
```sql
SHOW DATABASES LIKE 'db_berita';
```

**Cek table kategori:**
```sql
USE db_berita;
SHOW TABLES LIKE 'kategori';
```

**Cek struktur table:**
```sql
DESCRIBE kategori;
```

Harus ada kolom:
- id_kategori (INT, PRIMARY KEY, AUTO_INCREMENT)
- nama_kategori (VARCHAR(50), NOT NULL)
- slug_kategori (VARCHAR(50), NOT NULL, UNIQUE)
- deskripsi (TEXT)
- created_at (TIMESTAMP)

#### 5. Cek File Permissions

Pastikan folder dan file bisa diakses:
```bash
# Di folder project
chmod 755 api/
chmod 644 api/manage_categories.php
chmod 644 api/config.php
```

#### 6. Cek PHP Error Log

**Lokasi error log (XAMPP):**
```
C:\xampp\apache\logs\error.log
C:\xampp\php\logs\php_error_log
```

Buka file tersebut dan cari error terbaru.

#### 7. Test API Langsung

**Test dengan browser:**
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

**Test dengan curl (jika ada):**
```bash
curl -X POST http://10.21.224.146/api/manage_categories.php?action=add \
  -H "Content-Type: application/json" \
  -d '{"nama_kategori":"Test","deskripsi":"Test desc"}'
```

### Common Issues & Solutions

#### Issue 1: Database Connection Failed
**Error**: "Database connection failed"

**Solution**:
1. Cek `api/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Kosong untuk XAMPP default
define('DB_NAME', 'db_berita');
```

2. Pastikan MySQL running di XAMPP
3. Test koneksi di phpMyAdmin

#### Issue 2: Table Not Found
**Error**: "Table 'db_berita.kategori' doesn't exist"

**Solution**:
1. Buka phpMyAdmin
2. Import file `database/db_berita.sql`
3. Atau jalankan manual:
```sql
CREATE TABLE kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    slug_kategori VARCHAR(50) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Issue 3: CORS Error
**Error**: "Access to fetch has been blocked by CORS policy"

**Solution**:
Sudah ditangani di API dengan header:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
```

Jika masih error, cek `.htaccess`:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"
```

#### Issue 4: JSON Parse Error
**Error**: "Unexpected token < in JSON"

**Solution**:
1. API mengembalikan HTML instead of JSON
2. Cek PHP error di response
3. Buka API URL langsung di browser
4. Lihat error message

#### Issue 5: 404 Not Found
**Error**: "Failed to fetch" atau "404 Not Found"

**Solution**:
1. Cek path API benar: `../api/manage_categories.php`
2. Pastikan file exists di folder `api/`
3. Cek URL di browser console
4. Pastikan XAMPP Apache running

#### Issue 6: 500 Internal Server Error
**Error**: "HTTP error! status: 500"

**Solution**:
1. Cek PHP error log
2. Enable error display temporary:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```
3. Cek syntax error di PHP
4. Cek database query error

### Quick Fix Checklist

- [ ] XAMPP Apache & MySQL running (hijau)
- [ ] Database `db_berita` exists
- [ ] Table `kategori` exists dengan struktur benar
- [ ] File `api/config.php` dengan kredensial benar
- [ ] File `api/manage_categories.php` exists
- [ ] Browser console tidak ada error
- [ ] Network tab shows 200/201 status
- [ ] Test API URL returns JSON

### Manual Test

Jika semua gagal, test manual:

1. **Buka phpMyAdmin**
2. **Pilih database `db_berita`**
3. **Jalankan SQL**:
```sql
INSERT INTO kategori (nama_kategori, slug_kategori, deskripsi) 
VALUES ('Test Manual', 'test-manual', 'Test deskripsi');
```

4. **Cek hasilnya**:
```sql
SELECT * FROM kategori;
```

Jika manual insert berhasil, berarti masalah di API atau JavaScript.

### Known Issues & Fixes

#### Issue 7: getDBConnection() Function Not Found
**Error**: "Call to undefined function getDBConnection()"

**Solution**:
Function `getDBConnection()` sudah ditambahkan ke `api/config.php`. Pastikan file config.php memiliki function ini:

```php
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        error_log('Database connection failed: ' . $conn->connect_error);
        return null;
    }
    
    $conn->set_charset(DB_CHARSET);
    return $conn;
}
```

**Status**: ✅ FIXED - Function sudah ditambahkan ke config.php

### Contact Support

Jika masih error setelah semua langkah:

1. Screenshot error di browser console
2. Screenshot error di Network tab
3. Copy isi file `api/config.php` (hide password)
4. Copy error dari PHP error log
5. Screenshot hasil test_categories.php

---

**Last Updated**: January 28, 2026  
**Version**: 1.1.0 - Added getDBConnection() fix
