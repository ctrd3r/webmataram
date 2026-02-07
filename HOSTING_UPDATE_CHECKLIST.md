# 📋 Hosting Update Checklist

## File yang Perlu Di-Update di Hosting

Berikut adalah file-file yang telah diubah dan perlu di-upload ke hosting:

### 🔴 CRITICAL - Update Segera

#### 1. Admin Panel
```
admin/admin-fixed.js          ⭐ PENTING - Fitur tambah berita dengan upload image
```

#### 2. Frontend Pages
```
index.html                    - Header, navigation, footer, featured news section
featured-news.js              - Script untuk load berita random
```

#### 3. API Files
```
api/upload_image.php          - Upload & kompresi image (sudah ada, pastikan ada)
api/manage_news.php           - API manage berita (sudah ada, pastikan ada)
```

### 🟡 MEDIUM - Update Segera

#### Frontend
```
berita.html                   - Navigation links
berita.js                     - Berita page script
```

#### Test Files
```
test-featured-news.html       - Test page untuk featured news
```

### 🟢 LOW - Optional

#### Documentation (tidak perlu di-upload)
```
FEATURED_NEWS_TROUBLESHOOTING.md
LINK_NAVIGATION_UPDATE.md
HOSTING_UPDATE_CHECKLIST.md
```

---

## 📦 Cara Update di Hosting

### Opsi 1: Git Pull (Recommended)
Jika hosting sudah setup git:

```bash
cd /path/to/hosting
git pull origin main
```

### Opsi 2: Manual Upload via FTP/SFTP

Upload file-file ini:

```
✅ admin/admin-fixed.js
✅ index.html
✅ featured-news.js
✅ berita.html
✅ berita.js
✅ test-featured-news.html
```

### Opsi 3: Selective Update

Jika hanya ingin update fitur tertentu:

**Untuk Featured News Section:**
- Upload: `index.html`
- Upload: `featured-news.js`

**Untuk Tambah Berita dengan Upload Image:**
- Upload: `admin/admin-fixed.js`
- Pastikan: `api/upload_image.php` sudah ada
- Pastikan: `api/manage_news.php` sudah ada

---

## ✅ Verification Checklist

Setelah upload, verifikasi:

### 1. Featured News Section
- [ ] Buka index.html
- [ ] Scroll ke bawah hero section
- [ ] Lihat 2 kolom berita random
- [ ] Klik "Lihat Semua" → buka berita.html
- [ ] Klik "Baca Selengkapnya" → buka detail-berita.html

### 2. Navigation Links
- [ ] Header navigation bekerja
- [ ] Mobile menu bekerja
- [ ] Footer links bekerja
- [ ] Semua link mengarah ke file yang benar

### 3. Admin Panel - Tambah Berita
- [ ] Buka admin panel
- [ ] Klik "Kelola Berita"
- [ ] Klik "Tambah Berita"
- [ ] Form muncul dengan upload image
- [ ] Drag & drop gambar
- [ ] Lihat progress bar
- [ ] Lihat preview & stats kompresi
- [ ] Klik "Simpan Berita"
- [ ] Berita muncul di list

### 4. Image Upload
- [ ] Upload gambar JPG/PNG
- [ ] Lihat kompresi stats
- [ ] Gambar tersimpan di `images/news/`
- [ ] Gambar muncul di berita list

---

## 🔧 Prerequisites di Hosting

Pastikan hosting sudah memiliki:

### PHP Extensions
```bash
✅ GD Library (untuk image optimization)
✅ PDO MySQL (untuk database)
✅ JSON (untuk API)
```

### Directories
```
✅ images/news/          - Writable (untuk upload gambar)
✅ admin/                - Readable
✅ api/                  - Readable
```

### Permissions
```bash
chmod 755 images/news/
chmod 644 admin/admin-fixed.js
chmod 644 api/upload_image.php
```

---

## 📊 File Summary

### Total Files Changed: 6 (Critical)

| File | Type | Status | Priority |
|------|------|--------|----------|
| admin/admin-fixed.js | JS | ✅ Updated | 🔴 CRITICAL |
| index.html | HTML | ✅ Updated | 🔴 CRITICAL |
| featured-news.js | JS | ✅ New | 🔴 CRITICAL |
| berita.html | HTML | ✅ Updated | 🟡 MEDIUM |
| berita.js | JS | ✅ Updated | 🟡 MEDIUM |
| test-featured-news.html | HTML | ✅ New | 🟢 LOW |

---

## 🚀 Quick Update Command

Jika menggunakan git di hosting:

```bash
#!/bin/bash
cd /path/to/hosting
git fetch origin
git checkout origin/main -- admin/admin-fixed.js index.html featured-news.js berita.html berita.js test-featured-news.html
echo "✅ Update selesai!"
```

---

## ⚠️ Important Notes

1. **Backup First**: Backup file lama sebelum update
2. **Test Locally**: Test di local dulu sebelum upload
3. **Clear Cache**: Clear browser cache setelah update
4. **Check Permissions**: Pastikan file permissions benar
5. **Verify API**: Pastikan API endpoints masih berfungsi

---

## 📞 Troubleshooting

### Featured News Tidak Muncul
- [ ] Cek console browser (F12)
- [ ] Pastikan featured-news.js ter-load
- [ ] Pastikan API `/api/get_news.php` berfungsi
- [ ] Cek database ada berita dengan status 'publish'

### Tambah Berita Error
- [ ] Cek admin/admin-fixed.js ter-load
- [ ] Pastikan api/upload_image.php ada
- [ ] Cek permissions folder images/news/
- [ ] Cek GD library installed

### Image Upload Gagal
- [ ] Cek file size < 10MB
- [ ] Cek format gambar (JPG/PNG/WebP)
- [ ] Cek folder images/news/ writable
- [ ] Cek PHP memory_limit >= 128M

---

**Last Updated**: February 6, 2026  
**Version**: 1.0.0  
**Status**: Ready for Production
