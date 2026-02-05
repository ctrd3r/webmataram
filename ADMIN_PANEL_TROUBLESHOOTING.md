# Admin Panel Troubleshooting Guide

## 🚨 **MASALAH YANG DILAPORKAN:**
- **Kelola Berita**: Menampilkan "Fitur lengkap kelola berita akan segera tersedia" (placeholder)
- **Komentar**: Error SQL syntax di API
- **Kategori**: Mungkin tidak menampilkan data

## ✅ **SOLUSI YANG SUDAH DITERAPKAN:**

### **1. Perbaikan API Komentar**
**File:** `api/get_comments.php`
**Masalah:** SQL syntax error dengan LIMIT dan OFFSET
**Solusi:** Mengubah dari parameter binding ke direct substitution

```php
// SEBELUM (ERROR):
LIMIT ? OFFSET ?

// SESUDAH (FIXED):
LIMIT $limit OFFSET $offset
```

### **2. Perbaikan Admin Panel JavaScript**
**File:** `admin/admin-fixed.js`
**Masalah:** Fungsi async tidak dipanggil dengan await
**Solusi:** Menambahkan await pada semua pemanggilan fungsi

```javascript
// SEBELUM:
case 'news':
    this.loadNewsTable();
    break;

// SESUDAH:
case 'news':
    await this.loadNewsTable();
    break;
```

### **3. Implementasi Lengkap Semua Section**
- ✅ **loadNewsTable()** - Tabel berita lengkap dengan search, filter, pagination
- ✅ **loadCategoriesTable()** - Tabel kategori dengan jumlah berita
- ✅ **loadCommentsTable()** - Tabel komentar dengan moderasi
- ✅ **loadAuthorsTable()** - Tabel penulis dengan statistik

---

## 🔧 **FILES UNTUK TESTING:**

### **1. Test Individual APIs:**
```
http://10.21.224.146/test-news-api.html
http://10.21.224.146/test-comments-api.html
```

### **2. Test Admin Sections:**
```
http://10.21.224.146/admin/debug-sections.html
```

### **3. Test Full Admin Panel:**
```
http://10.21.224.146/admin/index.html
http://10.21.224.146/admin/index-fixed.html
```

---

## 📋 **CHECKLIST UNTUK VERIFIKASI:**

### **Step 1: Setup Database Komentar**
```sql
-- Jalankan di phpMyAdmin:
source database/create_comments_table.sql;

-- Atau copy-paste dari file tersebut
```

### **Step 2: Test APIs Individual**
1. **News API:** `http://10.21.224.146/api/get_news.php?limit=10`
   - Expected: JSON dengan array berita
   
2. **Categories API:** `http://10.21.224.146/api/get_categories.php`
   - Expected: JSON dengan array kategori
   
3. **Comments API:** `http://10.21.224.146/api/get_comments.php?limit=10`
   - Expected: JSON dengan array komentar (setelah database setup)
   
4. **Authors API:** `http://10.21.224.146/api/get_authors.php`
   - Expected: JSON dengan array penulis

### **Step 3: Test Admin Panel**
1. Buka `http://10.21.224.146/admin/index.html`
2. Klik setiap menu:
   - **Dashboard** → Harus menampilkan stats dan recent news
   - **Kelola Berita** → Harus menampilkan tabel berita (BUKAN placeholder)
   - **Kategori** → Harus menampilkan tabel kategori
   - **Komentar** → Harus menampilkan tabel komentar
   - **Penulis** → Harus menampilkan tabel penulis
   - **Berita Utama** → Harus menampilkan berita utama dan selection

---

## 🐛 **JIKA MASIH ADA MASALAH:**

### **Masalah: Kelola Berita Masih Placeholder**
**Kemungkinan Penyebab:**
1. Browser cache - tekan Ctrl+F5 untuk hard refresh
2. Script tidak ter-load - check console browser untuk error
3. API error - test `api/get_news.php` langsung

**Solusi:**
```javascript
// Buka browser console dan jalankan:
console.log('Testing news load...');
if (window.adminPanel) {
    window.adminPanel.loadNewsTable();
} else {
    console.error('AdminPanel not initialized');
}
```

### **Masalah: Comments API Error**
**Kemungkinan Penyebab:**
1. Tabel komentar belum dibuat
2. SQL syntax masih error

**Solusi:**
1. Jalankan `database/create_comments_table.sql`
2. Test `http://10.21.224.146/api/get_comments.php`

### **Masalah: Data Tidak Muncul**
**Debug Steps:**
1. Buka browser console (F12)
2. Lihat error messages
3. Check Network tab untuk failed requests
4. Test individual APIs

---

## 📊 **EXPECTED RESULTS:**

### **✅ Dashboard Section:**
```
📊 Stats Cards:
- Total Berita: [angka]
- Total Views: [angka] 
- Kategori: [angka]
- Komentar: [angka]

📰 Recent News:
- List 5 berita terbaru dengan gambar
- Kategori dan tanggal
- Status badges
```

### **✅ Kelola Berita Section:**
```
📋 News Table:
- Kolom: Berita | Kategori | Status | Views | Tanggal | Aksi
- Search box berfungsi
- Filter status berfungsi
- Pagination jika > 50 berita
- Tombol Edit/Hapus pada setiap row
```

### **✅ Kategori Section:**
```
🏷️ Categories Table:
- Kolom: Kategori | Slug | Jumlah Berita | Aksi
- Avatar dengan huruf pertama
- Badge jumlah berita
- Tombol Edit/Hapus
```

### **✅ Komentar Section:**
```
💬 Comments Table:
- Kolom: Pengunjung | Komentar | Berita | Status | Tanggal | Aksi
- Filter status (pending/approved/rejected)
- Tombol moderasi (Setujui/Tolak/Lihat/Hapus)
- Link ke berita yang dikomentari
```

### **✅ Penulis Section:**
```
👥 Authors Table:
- Kolom: Penulis | Username | Total Berita | Aksi
- Avatar dengan huruf pertama
- Email (jika ada)
- Statistik berita per penulis
```

---

## 🎯 **NEXT STEPS:**

1. **Jalankan database setup** untuk komentar
2. **Test semua API** menggunakan file test yang disediakan
3. **Verifikasi admin panel** menampilkan data yang benar
4. **Report hasil** - bagian mana yang masih bermasalah

Jika semua langkah di atas sudah dilakukan dan masih ada masalah, berikan screenshot atau copy-paste error message yang muncul di browser console.