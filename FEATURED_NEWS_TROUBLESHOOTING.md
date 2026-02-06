# Troubleshooting Featured News Section

## Masalah: Thumbnail Tidak Terlihat

### Penyebab Umum

1. **API tidak mengembalikan data**
   - Cek apakah database memiliki data berita
   - Buka browser console (F12) dan lihat error message

2. **Path gambar tidak benar**
   - API mengembalikan field `gambar_url` atau `gambar_utama`
   - Gambar harus tersimpan di folder `/images/news/`

3. **Placeholder gambar tidak ditemukan**
   - Pastikan file `/images/placeholder-news.jpg` ada
   - Atau buat placeholder default

### Cara Debug

#### 1. Test API Langsung
Buka URL ini di browser:
```
http://localhost/api/get_news.php?limit=10&sort=newest
```

Pastikan response berisi:
```json
{
  "success": true,
  "data": [
    {
      "id_berita": 1,
      "judul": "Judul Berita",
      "gambar_url": "images/news/filename.jpg",
      "ringkasan": "Ringkasan berita",
      "kategori": "Gempa",
      "tanggal_publish": "2026-02-06"
    }
  ]
}
```

#### 2. Test Featured News Page
Buka file test:
```
http://localhost/test-featured-news.html
```

Halaman ini akan:
- Menampilkan raw API response
- Render 2 berita pertama
- Menunjukkan error jika ada

#### 3. Cek Browser Console
Buka F12 → Console tab, cari:
- `Featured News API Response:` - menunjukkan data dari API
- `Random News Selected:` - menunjukkan 2 berita yang dipilih
- Error messages jika ada

### Solusi

#### Jika API tidak mengembalikan data:
```bash
# Cek database
mysql -u root -p db_berita
SELECT COUNT(*) FROM berita WHERE status = 'publish';
```

#### Jika gambar tidak ditemukan:
1. Pastikan folder `/images/news/` ada
2. Upload gambar ke folder tersebut
3. Update database dengan path yang benar

#### Jika placeholder tidak ada:
Buat placeholder default:
```bash
# Gunakan ImageMagick atau tool lain untuk membuat placeholder
convert -size 400x300 xc:lightgray /images/placeholder-news.jpg
```

### Field Mapping

API mengembalikan field berikut:
| Field | Deskripsi |
|-------|-----------|
| `gambar_url` | URL gambar yang sudah diproses |
| `gambar_utama` | Nama file gambar dari database |
| `judul` | Judul berita |
| `ringkasan` | Ringkasan/excerpt berita |
| `kategori` | Nama kategori |
| `slug` | URL slug untuk detail page |
| `tanggal_publish` | Tanggal publikasi |

### Fallback Chain

featured-news.js menggunakan fallback chain:
```javascript
const imageUrl = item.gambar_url || item.gambar_utama || '/images/placeholder-news.jpg';
```

Jadi jika `gambar_url` tidak ada, akan coba `gambar_utama`, dan jika keduanya tidak ada, gunakan placeholder.

### Performance Tips

1. **Lazy Loading**
   - Gambar di-load dengan `loading="lazy"`
   - Hanya di-load saat masuk viewport

2. **Caching**
   - API response di-cache 5 menit
   - Refresh otomatis setiap 5 menit

3. **Image Optimization**
   - Gunakan format WebP jika memungkinkan
   - Compress gambar sebelum upload
   - Ukuran optimal: 400x300px

### Testing Checklist

- [ ] Database memiliki minimal 2 berita dengan status 'publish'
- [ ] Setiap berita memiliki gambar_utama yang terisi
- [ ] Folder `/images/news/` ada dan accessible
- [ ] File `/images/placeholder-news.jpg` ada
- [ ] API endpoint `/api/get_news.php` berfungsi
- [ ] Browser console tidak menunjukkan error
- [ ] Gambar muncul di halaman index.html

### Kontak Support

Jika masalah persisten:
1. Buka test-featured-news.html
2. Screenshot API response
3. Cek browser console untuk error messages
4. Hubungi developer dengan informasi tersebut
