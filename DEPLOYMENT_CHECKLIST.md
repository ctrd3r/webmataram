# 📋 Checklist Upload ke Hosting

## 🔴 WAJIB Upload (File yang Diubah/Baru)

### JavaScript Files
- ✅ `detail-berita.js` - Fixed API integration
- ✅ `berita.js` - Fixed API integration & lazy loading
- ✅ `seo-helper.js` - **BARU** - SEO helper class
- ✅ `lazy-load.js` - **BARU** - Lazy loading images
- ✅ `admin/admin.js` - Added image upload feature

### HTML Files
- ✅ `detail-berita.html` - Added SEO meta tags & lazy loading
- ✅ `berita.html` - Added SEO meta tags & lazy loading

### PHP API Files
- ✅ `api/get_news_detail.php` - Fixed id_kategori column
- ✅ `api/get_news.php` - Updated for real data
- ✅ `api/manage_news.php` - Fixed column names
- ✅ `api/manage_categories.php` - Fixed errors
- ✅ `api/config.php` - Added getDBConnection() function
- ✅ `api/cache_manager_v2.php` - **BARU** - Cache management
- ✅ `api/image_optimizer.php` - **BARU** - Image optimization
- ✅ `api/upload_image.php` - **BARU** - Image upload endpoint
- ✅ `api/generate_sitemap.php` - **BARU** - Dynamic sitemap

### Database
- ✅ `database/optimize_performance.sql` - **WAJIB JALANKAN** - Performance indexes

## 🟡 OPSIONAL (File Testing/Documentation)
- `test-seo.html` - Testing tool (tidak perlu di production)
- `check-seo.html` - Testing tool (tidak perlu di production)
- `performance-monitor.html` - Monitoring tool (opsional)
- `api/test_*.php` - Testing files (tidak perlu di production)
- `*.md` files - Documentation (tidak perlu di production)

## ⚙️ KONFIGURASI YANG HARUS DIUBAH

### 1. Database Configuration
**File**: `api/config.php`
```php
// Line 8-11: Update dengan kredensial hosting Anda
private $host = "localhost";           // Biasanya localhost
private $db_name = "nama_database";    // Nama database di hosting
private $username = "user_database";   // Username database
private $password = "password_db";     // Password database
```

### 2. Base URL untuk SEO
**File**: `seo-helper.js`
```javascript
// Line 8: Ganti dengan domain Anda
this.baseUrl = 'https://yourdomain.com';  // Ganti dengan domain asli
```

**File**: `api/generate_sitemap.php`
```php
// Line 11: Ganti dengan domain Anda
$base_url = 'https://yourdomain.com';  // Ganti dengan domain asli
```

### 3. Timezone (Sudah WITA/UTC+8)
Sudah benar, tidak perlu diubah.

## 📁 STRUKTUR FOLDER DI HOSTING

Pastikan folder ini ada dan writable (chmod 755 atau 777):
```
/images/news/          - Untuk upload gambar berita (chmod 777)
/cache/                - Untuk cache API (chmod 777)
/cache/news/           - Untuk cache berita (chmod 777)
```

Buat folder jika belum ada:
```bash
mkdir -p images/news
mkdir -p cache/news
chmod 777 images/news
chmod 777 cache
chmod 777 cache/news
```

## 🗄️ DATABASE SETUP

### 1. Import Database Schema
Upload dan jalankan file ini di phpMyAdmin:
```
database/db_berita.sql
```

### 2. Jalankan Optimization Query
**WAJIB** untuk performa cepat:
```
database/optimize_performance.sql
```

### 3. Create Admin User
Jalankan salah satu:
```
database/ready_to_use_admin_users.sql  (sudah ada user siap pakai)
```
atau
```
database/create_admin_users.sql  (buat user baru)
```

## 🔒 KEAMANAN

### 1. Hapus File Testing di Production
```bash
rm api/test_*.php
rm test-*.html
rm check-*.html
rm performance-monitor.html
```

### 2. Protect Admin Folder
Tambahkan `.htaccess` di folder `admin/`:
```apache
# Sudah ada di admin/.htaccess
AuthType Basic
AuthName "Admin Area"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

### 3. Disable Error Display
Di `api/config.php`, pastikan:
```php
// Untuk production
error_reporting(0);
ini_set('display_errors', 0);
```

## 📊 TESTING SETELAH UPLOAD

### 1. Test API Endpoints
- ✅ `https://yourdomain.com/api/get_news.php`
- ✅ `https://yourdomain.com/api/get_categories.php`
- ✅ `https://yourdomain.com/api/get_news_detail.php?slug=test-slug`

### 2. Test Pages
- ✅ `https://yourdomain.com/` - Homepage
- ✅ `https://yourdomain.com/berita.html` - News list
- ✅ `https://yourdomain.com/detail-berita.html?slug=test-slug` - News detail
- ✅ `https://yourdomain.com/admin/` - Admin panel

### 3. Test Features
- ✅ Lazy loading images (scroll halaman berita)
- ✅ Image upload di admin panel
- ✅ Cache system (cek folder `/cache/news/`)
- ✅ SEO meta tags (View Page Source)

### 4. Test Performance
- ✅ Google PageSpeed Insights: https://pagespeed.web.dev/
- ✅ GTmetrix: https://gtmetrix.com/
- ✅ Google Rich Results Test: https://search.google.com/test/rich-results

## 🚀 QUICK UPLOAD COMMAND

Jika menggunakan FTP/SFTP, upload folder ini:
```
/admin/          (semua file)
/api/            (semua file kecuali test_*.php)
/database/       (untuk reference, jalankan SQL di phpMyAdmin)
/images/         (pastikan folder news/ ada)
/cache/          (buat folder kosong)
berita.html
berita.js
detail-berita.html
detail-berita.js
seo-helper.js
lazy-load.js
index.html
```

## ✅ FINAL CHECKLIST

Sebelum go-live, pastikan:
- [ ] Database sudah diimport
- [ ] Optimization indexes sudah dijalankan
- [ ] Config.php sudah diupdate (database credentials)
- [ ] Base URL sudah diganti di seo-helper.js dan generate_sitemap.php
- [ ] Folder images/news/ dan cache/ sudah dibuat dan writable
- [ ] Admin user sudah dibuat
- [ ] File testing sudah dihapus
- [ ] Semua halaman bisa diakses tanpa error
- [ ] Image upload berfungsi
- [ ] SEO meta tags muncul di View Page Source

## 📞 TROUBLESHOOTING

### Jika halaman blank/error:
1. Cek error log di cPanel/hosting panel
2. Pastikan PHP version minimal 7.4
3. Pastikan extension PHP aktif: PDO, PDO_MySQL, GD, mbstring

### Jika gambar tidak bisa diupload:
1. Cek permission folder `images/news/` (chmod 777)
2. Cek PHP upload_max_filesize di php.ini (minimal 10MB)
3. Cek PHP post_max_size di php.ini (minimal 10MB)

### Jika cache tidak berfungsi:
1. Cek permission folder `cache/` dan `cache/news/` (chmod 777)
2. Pastikan PHP bisa write file

---

**Estimasi waktu upload**: 10-15 menit
**Estimasi waktu setup database**: 5 menit
**Total**: ~20 menit untuk deployment lengkap
