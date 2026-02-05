# Fix Sinkronisasi Data Berita

## Masalah
Halaman `berita.html` tidak sinkron dengan data dari admin panel karena masih menggunakan data dummy/simulasi.

## Solusi yang Diterapkan

### 1. Update berita.js
File `berita.js` telah diupdate untuk menggunakan API real dari database:

#### Perubahan Utama:

**A. Load Kategori dari Database**
```javascript
async loadCategories() {
    const response = await fetch('api/get_categories.php');
    const result = await response.json();
    if (result.success) {
        this.renderCategoryFilter(result.data);
    }
}
```

**B. Fetch News dari API (bukan data dummy)**
```javascript
async fetchNewsFromAPI() {
    let url = `api/get_news.php?page=${this.currentPage}&limit=${this.itemsPerPage}`;
    
    if (this.currentCategory) {
        url += `&category=${encodeURIComponent(this.currentCategory)}`;
    }
    
    if (this.currentSearch) {
        url += `&search=${encodeURIComponent(this.currentSearch)}`;
    }
    
    if (this.sortOrder) {
        url += `&sort=${this.sortOrder}`;
    }
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
        return result.data;
    }
}
```

**C. Fetch Featured News dari API**
```javascript
async fetchFeaturedNewsFromAPI() {
    const response = await fetch('api/get_news.php?featured=true&limit=1');
    const result = await response.json();
    
    if (result.success) {
        return result.data;
    }
}
```

**D. Update Rendering untuk Support Data dari API**
- Menggunakan `gambar_url` dari API (bukan `gambar_utama`)
- Menggunakan `tanggal_publish_formatted` dari API
- Support `alt_gambar` dan `meta_description`

### 2. Fitur yang Sekarang Berfungsi

✅ **Load Berita dari Database**
- Semua berita yang ditambahkan via admin panel akan muncul di berita.html
- Data real-time dari database

✅ **Filter Kategori**
- Dropdown kategori diisi otomatis dari database
- Filter bekerja dengan data real

✅ **Pencarian**
- Search berita berdasarkan judul, ringkasan, atau tags
- Menggunakan API backend

✅ **Sorting**
- Newest (terbaru)
- Oldest (terlama)
- Popular (berdasarkan views)

✅ **Featured News**
- Menampilkan berita yang ditandai sebagai featured
- Muncul di bagian atas halaman

✅ **Pagination**
- Load more untuk berita berikutnya
- Infinite scroll support

### 3. Cara Kerja

1. **User membuka berita.html**
2. **JavaScript load data:**
   - Load kategori dari `api/get_categories.php`
   - Load featured news dari `api/get_news.php?featured=true`
   - Load berita list dari `api/get_news.php`
3. **Data ditampilkan:**
   - Featured news di bagian atas
   - List berita dalam grid
   - Filter dan search berfungsi

### 4. Struktur Data dari API

**Response dari get_news.php:**
```json
{
    "success": true,
    "data": [
        {
            "id_berita": 1,
            "judul": "Judul Berita",
            "slug": "judul-berita",
            "ringkasan": "Ringkasan berita...",
            "gambar_url": "images/news/gambar.jpg",
            "alt_gambar": "Alt text",
            "meta_description": "Meta description",
            "tags": ["tag1", "tag2"],
            "views": 100,
            "tanggal_publish": "2024-01-28 10:00:00",
            "tanggal_publish_formatted": "28 Januari 2024, 10:00 WIB",
            "featured": true,
            "kategori": "Gempa Bumi",
            "slug_kategori": "gempa-bumi",
            "penulis": "Admin BMKG",
            "foto_penulis": "admin.jpg",
            "detail_url": "detail-berita.html?slug=judul-berita"
        }
    ],
    "pagination": {
        "total_items": 10,
        "total_pages": 2,
        "current_page": 1,
        "items_per_page": 6,
        "has_next": true,
        "has_prev": false
    }
}
```

### 5. Testing

**Test 1: Tambah Berita di Admin**
1. Login ke admin panel
2. Tambah berita baru dengan status "Publish"
3. Refresh berita.html
4. Berita baru harus muncul

**Test 2: Filter Kategori**
1. Buka berita.html
2. Pilih kategori dari dropdown
3. Hanya berita dari kategori tersebut yang muncul

**Test 3: Search**
1. Ketik keyword di search box
2. Berita yang sesuai akan muncul

**Test 4: Featured News**
1. Di admin, tandai berita sebagai featured
2. Refresh berita.html
3. Berita featured muncul di bagian atas

### 6. Catatan Penting

**Database Requirements:**
- Tabel `berita` harus memiliki kolom `featured` (TINYINT, default 0)
- Jika kolom belum ada, jalankan:
```sql
ALTER TABLE berita ADD COLUMN featured TINYINT(1) DEFAULT 0 AFTER status;
```

**Image Path:**
- API mengembalikan `gambar_url` dengan path lengkap
- Format: `images/news/filename.jpg`
- Pastikan folder `images/news/` exists dan writable

**Status Berita:**
- Hanya berita dengan status `publish` yang muncul di berita.html
- Berita `draft` dan `archived` tidak ditampilkan

### 7. Troubleshooting

**Berita tidak muncul:**
1. Cek browser console (F12) untuk error
2. Test API langsung: `http://10.21.224.146/api/get_news.php`
3. Pastikan ada berita dengan status `publish` di database
4. Cek Network tab untuk melihat response API

**Kategori tidak muncul:**
1. Test API: `http://10.21.224.146/api/get_categories.php`
2. Pastikan ada kategori di database
3. Cek console untuk error

**Gambar tidak muncul:**
1. Cek path gambar di database
2. Pastikan file gambar exists di folder `images/news/`
3. Fallback ke `images/placeholder-news.jpg` jika gambar tidak ada

---

**Status**: ✅ FIXED - berita.html sekarang sinkron dengan database
**Date**: 2 Februari 2026
**Version**: 1.0.0
