# Sistem Manajemen Konten Berita BMKG

Sistem manajemen konten (CMS) lengkap untuk halaman berita BMKG dengan database MySQL/MariaDB, API PHP, dan interface admin.

## 📁 Struktur File

```
├── database/
│   └── db_berita.sql           # Script database dan data sample
├── api/
│   ├── config.php              # Konfigurasi database dan utility functions
│   ├── get_news.php            # API untuk mengambil daftar berita
│   ├── get_categories.php      # API untuk mengambil kategori
│   └── get_news_detail.php     # API untuk detail berita
├── admin/
│   ├── index.html              # Dashboard admin
│   └── admin.js                # JavaScript admin panel
├── berita.html                 # Halaman daftar berita
├── berita.js                   # JavaScript untuk halaman berita
├── detail-berita.html          # Halaman detail berita
└── detail-berita.js            # JavaScript untuk detail berita
```

## 🗄️ Struktur Database

### Tabel `kategori`
- `id_kategori` (INT, PK, Auto Increment)
- `nama_kategori` (VARCHAR 50)
- `slug_kategori` (VARCHAR 50, UNIQUE)
- `deskripsi` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### Tabel `penulis`
- `id_penulis` (INT, PK, Auto Increment)
- `nama_lengkap` (VARCHAR 100)
- `username` (VARCHAR 50, UNIQUE)
- `email` (VARCHAR 100, UNIQUE)
- `password` (VARCHAR 255, hashed)
- `foto_profil` (VARCHAR 255)
- `bio` (TEXT)
- `status` (ENUM: 'aktif', 'nonaktif')
- `created_at`, `updated_at` (TIMESTAMP)

### Tabel `berita`
- `id_berita` (INT, PK, Auto Increment)
- `id_kategori` (INT, FK ke kategori)
- `id_penulis` (INT, FK ke penulis)
- `judul` (VARCHAR 255)
- `slug` (VARCHAR 255, UNIQUE)
- `ringkasan` (TEXT)
- `isi_berita` (LONGTEXT)
- `gambar_utama` (VARCHAR 255)
- `alt_gambar` (VARCHAR 255)
- `meta_description` (VARCHAR 160)
- `tags` (VARCHAR 500)
- `views` (INT, default 0)
- `tanggal_publish` (DATETIME)
- `status` (ENUM: 'draft', 'publish', 'archived')
- `featured` (BOOLEAN, default FALSE)
- `created_at`, `updated_at` (TIMESTAMP)

### Tabel `komentar` (Opsional)
- `id_komentar` (INT, PK, Auto Increment)
- `id_berita` (INT, FK ke berita)
- `nama_pengunjung` (VARCHAR 100)
- `email_pengunjung` (VARCHAR 100)
- `isi_komentar` (TEXT)
- `status` (ENUM: 'pending', 'approved', 'rejected')
- `created_at` (TIMESTAMP)

## 🚀 Instalasi

### 1. Setup Database
```sql
-- Import file database/db_berita.sql ke MySQL/MariaDB
mysql -u root -p < database/db_berita.sql
```

### 2. Konfigurasi Database
Edit file `api/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'db_berita');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. Setup Web Server
- Pastikan PHP 7.4+ dan MySQL/MariaDB terinstall
- Copy semua file ke direktori web server (htdocs/www)
- Pastikan folder `images/news/` dapat ditulis (chmod 755)

### 4. Akses Aplikasi
- **Halaman Berita**: `http://localhost/berita.html`
- **Admin Panel**: `http://localhost/admin/index.html`
- **Detail Berita**: `http://localhost/detail-berita.html?slug=news-slug`

## 🔧 API Endpoints

### GET `/api/get_news.php`
Mengambil daftar berita dengan parameter:
- `page` (int): Halaman (default: 1)
- `limit` (int): Jumlah per halaman (default: 6, max: 50)
- `category` (string): Filter kategori
- `search` (string): Pencarian
- `sort` (string): Urutan ('newest', 'oldest', 'popular')
- `featured` (bool): Hanya berita featured

### GET `/api/get_categories.php`
Mengambil daftar kategori dengan parameter:
- `with_count` (bool): Sertakan jumlah berita per kategori

### GET `/api/get_news_detail.php`
Mengambil detail berita dengan parameter:
- `slug` (string, required): Slug berita

## 🎨 Fitur Frontend

### Halaman Berita (`berita.html`)
- ✅ Grid responsif dengan Tailwind CSS
- ✅ Filter berdasarkan kategori
- ✅ Pencarian real-time dengan debounce
- ✅ Sorting (terbaru, terlama, terpopuler)
- ✅ Load more pagination
- ✅ Berita featured/utama
- ✅ Loading states dan error handling

### Halaman Detail (`detail-berita.html`)
- ✅ Layout artikel lengkap dengan sidebar
- ✅ Meta tags untuk SEO dan social sharing
- ✅ Breadcrumb navigation
- ✅ Berita terkait dan populer
- ✅ Sistem komentar
- ✅ Share buttons (Facebook, Twitter, WhatsApp)
- ✅ Reading time estimation
- ✅ View counter

### Admin Panel (`admin/index.html`)
- ✅ Dashboard dengan statistik
- ✅ Manajemen berita (CRUD)
- ✅ Manajemen kategori
- ✅ Manajemen penulis
- ✅ Moderasi komentar
- ✅ Interface responsif

## 🔒 Keamanan

### Implementasi Keamanan:
- ✅ Prepared statements untuk mencegah SQL injection
- ✅ Input sanitization dan validation
- ✅ Password hashing dengan `password_hash()`
- ✅ CORS headers untuk API
- ✅ File upload validation (ukuran, ekstensi)
- ✅ XSS protection dengan `htmlspecialchars()`

### Rekomendasi Tambahan:
- Implementasi authentication/authorization
- Rate limiting untuk API
- HTTPS untuk production
- Input validation yang lebih ketat
- Logging sistem untuk audit

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px)
- ✅ Touch-friendly interface
- ✅ Optimized images dengan lazy loading
- ✅ Fast loading dengan minimal JavaScript

## 🎯 SEO Optimization

- ✅ Semantic HTML structure
- ✅ Meta tags dinamis
- ✅ Open Graph tags untuk social media
- ✅ Structured data ready
- ✅ Clean URLs dengan slug
- ✅ Alt text untuk gambar
- ✅ Sitemap ready structure

## 🚀 Performance

- ✅ Lazy loading untuk gambar
- ✅ Pagination untuk mengurangi load time
- ✅ Debounced search untuk mengurangi API calls
- ✅ Minimal JavaScript dependencies
- ✅ Optimized database queries dengan indexing
- ✅ Caching headers ready

## 📝 Penggunaan

### Menambah Berita Baru:
1. Login ke admin panel
2. Pilih "Kelola Berita" → "Tambah Berita"
3. Isi form dengan lengkap
4. Upload gambar utama
5. Set status (draft/publish)
6. Simpan

### Mengelola Kategori:
1. Akses menu "Kategori"
2. Tambah kategori baru atau edit yang ada
3. Slug akan auto-generate dari nama kategori

### Moderasi Komentar:
1. Akses menu "Komentar"
2. Review komentar pending
3. Approve atau reject sesuai kebijakan

## 🔄 Pengembangan Selanjutnya

### Fitur yang Bisa Ditambahkan:
- [ ] Rich text editor (TinyMCE/CKEditor)
- [ ] Image gallery untuk berita
- [ ] Newsletter subscription
- [ ] Social media integration
- [ ] Advanced search dengan filters
- [ ] User roles dan permissions
- [ ] Backup dan restore system
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Multi-language support

### Optimisasi:
- [ ] Redis caching
- [ ] CDN integration
- [ ] Image optimization (WebP)
- [ ] Progressive Web App (PWA)
- [ ] Database optimization
- [ ] API rate limiting

## 📞 Support

Untuk pertanyaan atau bantuan implementasi:
- Dokumentasi lengkap tersedia di setiap file
- Kode sudah dilengkapi dengan komentar
- Database sudah include sample data
- API sudah siap untuk production dengan sedikit modifikasi

---

**Catatan**: Sistem ini sudah siap untuk production dengan beberapa penyesuaian konfigurasi keamanan dan server.