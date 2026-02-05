# 🌟 Cara Mengatur Berita Utama vs Berita Biasa

## 📋 **Ringkasan Sistem**

### **Berita Utama (Featured News):**
- ✅ Ditampilkan di bagian atas halaman berita
- ✅ Layout lebih besar dan menonjol
- ✅ Badge merah "UTAMA"
- ✅ Hanya 1 berita utama yang ditampilkan
- ✅ Otomatis mengganti berita utama sebelumnya

### **Berita Biasa (Regular News):**
- ✅ Ditampilkan di bagian "Berita Terbaru"
- ✅ Layout grid standar
- ✅ Badge biru dengan nama kategori
- ✅ Bisa menampilkan banyak berita

## 🛠️ **3 Cara Mengatur Berita Utama**

### **1. Menggunakan Tool Kelola Berita Utama (TERMUDAH)**

#### Langkah-langkah:
1. **Buka Tool:** `kelola-berita-utama.html`
2. **Lihat Berita Utama Saat Ini:** Di bagian atas
3. **Pilih Berita Baru:** Scroll ke bawah, klik "Jadikan Utama"
4. **Konfirmasi:** Klik "OK" pada dialog konfirmasi
5. **Selesai:** Berita utama otomatis berubah

#### Screenshot Fitur:
```
┌─────────────────────────────────────┐
│ 🌟 Berita Utama Saat Ini           │
│ ┌─────────────────────────────────┐ │
│ │ [IMG] Gempa Bumi M 5.2          │ │
│ │       UTAMA | Hapus Status      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📰 Semua Berita                     │
│ ┌─────────────────────────────────┐ │
│ │ [IMG] Cuaca Ekstrem             │ │
│ │       Cuaca | Jadikan Utama     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **2. Melalui Admin Panel**

#### Langkah-langkah:
1. **Login Admin:** Buka `admin/index.html`
2. **Kelola Berita:** Pilih menu "Kelola Berita"
3. **Edit Berita:** Klik "Edit" pada berita yang ingin dijadikan utama
4. **Centang Featured:** Centang checkbox "Jadikan Berita Utama"
5. **Simpan:** Klik "Update Berita"

### **3. Langsung via Database (ADVANCED)**

#### Query SQL:
```sql
-- Lihat berita utama saat ini
SELECT id_berita, judul, featured FROM berita WHERE featured = 1;

-- Hapus semua status berita utama
UPDATE berita SET featured = 0;

-- Jadikan berita ID 5 sebagai berita utama
UPDATE berita SET featured = 1 WHERE id_berita = 5;

-- Jadikan berita terbaru sebagai utama
UPDATE berita SET featured = 1 WHERE id_berita = (
    SELECT id_berita FROM (
        SELECT id_berita FROM berita 
        WHERE status = 'publish' 
        ORDER BY tanggal_publish DESC 
        LIMIT 1
    ) AS temp
);
```

## 🎨 **Perbedaan Visual di Website**

### **Berita Utama:**
```html
<!-- Section Berita Utama -->
<section class="mb-12">
    <h2>Berita Utama</h2>
    <article class="shadow-lg"> <!-- Shadow lebih tebal -->
        <img class="h-64"> <!-- Gambar lebih besar -->
        <span class="bg-red-600">UTAMA</span> <!-- Badge merah -->
        <div class="p-6"> <!-- Padding lebih besar -->
            <h3 class="text-xl font-bold"> <!-- Font lebih besar -->
```

### **Berita Biasa:**
```html
<!-- Section Berita Terbaru -->
<section>
    <h2>Berita Terbaru</h2>
    <article class="shadow-md"> <!-- Shadow standar -->
        <img class="h-48"> <!-- Gambar standar -->
        <span class="bg-blue-600">Kategori</span> <!-- Badge biru -->
        <div class="p-4"> <!-- Padding standar -->
            <h3 class="text-lg font-semibold"> <!-- Font standar -->
```

## 🔄 **Alur Kerja Sistem**

### **Ketika Mengatur Berita Utama:**
1. **Reset Semua:** Semua berita `featured = 0`
2. **Set Baru:** Berita terpilih `featured = 1`
3. **Update Display:** Frontend otomatis refresh
4. **Notifikasi:** User mendapat konfirmasi

### **API Endpoints:**
```javascript
// Set berita utama
POST api/manage_news.php
{
    "action": "set_featured",
    "id_berita": 5
}

// Hapus status berita utama
POST api/manage_news.php
{
    "action": "remove_featured", 
    "id_berita": 5
}

// Hapus semua status berita utama
POST api/manage_news.php
{
    "action": "remove_all_featured"
}
```

## 📊 **Monitoring & Analytics**

### **Cek Status Berita Utama:**
```sql
-- Lihat berita utama aktif
SELECT 
    b.id_berita,
    b.judul,
    b.tanggal_publish,
    b.views,
    k.nama_kategori,
    p.nama_lengkap as penulis
FROM berita b
LEFT JOIN kategori k ON b.id_kategori = k.id_kategori  
LEFT JOIN penulis p ON b.id_penulis = p.id_penulis
WHERE b.featured = 1 AND b.status = 'publish';
```

### **Statistik Berita Utama:**
```sql
-- Berita utama dengan views tertinggi
SELECT judul, views, tanggal_publish 
FROM berita 
WHERE featured = 1 
ORDER BY views DESC;

-- Rata-rata views berita utama vs biasa
SELECT 
    AVG(CASE WHEN featured = 1 THEN views END) as avg_featured_views,
    AVG(CASE WHEN featured = 0 THEN views END) as avg_regular_views
FROM berita WHERE status = 'publish';
```

## ⚡ **Tips & Best Practices**

### **Pemilihan Berita Utama:**
1. **Prioritas Tinggi:** Gempa >M5.0, Tsunami, Cuaca Ekstrem
2. **Aktualitas:** Maksimal 24 jam terakhir
3. **Kualitas Gambar:** Minimal 800x400px, format JPG/PNG
4. **Judul Menarik:** 50-60 karakter, informatif
5. **Ringkasan Jelas:** 2-3 kalimat yang menjelaskan inti berita

### **Jadwal Update:**
- 🌅 **Pagi (07:00):** Update berita utama harian
- 🌞 **Siang (12:00):** Cek dan update jika ada breaking news
- 🌆 **Sore (17:00):** Review dan update untuk prime time
- 🌙 **Malam (21:00):** Final check sebelum tidur

### **Rotasi Otomatis (Opsional):**
```sql
-- Jadikan berita terbaru hari ini sebagai utama (jalankan via cron job)
UPDATE berita SET featured = 0;
UPDATE berita SET featured = 1 WHERE id_berita = (
    SELECT id_berita FROM (
        SELECT id_berita FROM berita 
        WHERE status = 'publish' 
        AND DATE(tanggal_publish) = CURDATE()
        ORDER BY views DESC, tanggal_publish DESC 
        LIMIT 1
    ) AS temp
);
```

## 🚨 **Troubleshooting**

### **Masalah: Berita Utama Tidak Muncul**
1. **Cek Database:** `SELECT * FROM berita WHERE featured = 1;`
2. **Cek Status:** Pastikan `status = 'publish'`
3. **Cek API:** Test `api/get_news.php?featured=true`
4. **Cek Console:** Buka F12 → Console untuk error JavaScript

### **Masalah: Multiple Berita Utama**
```sql
-- Reset dan set ulang
UPDATE berita SET featured = 0;
UPDATE berita SET featured = 1 WHERE id_berita = [ID_YANG_DIINGINKAN];
```

### **Masalah: Tool Tidak Berfungsi**
1. **Cek Permissions:** File `api/manage_news.php` harus writable
2. **Cek Database Connection:** Test `debug-berita.php`
3. **Cek Browser Console:** Lihat error JavaScript
4. **Cek Server Logs:** Lihat PHP error logs

---

**🎯 Rekomendasi:** Gunakan **Tool Kelola Berita Utama** untuk kemudahan, atau **Admin Panel** untuk workflow lengkap!