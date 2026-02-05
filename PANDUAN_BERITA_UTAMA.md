# 📰 Panduan Mengatur Berita Utama

## 🎯 **Cara Membedakan Berita Utama dan Berita Biasa**

### 1. **Melalui Admin Panel**

#### A. **Login ke Admin Panel**
1. Buka `admin/index.html`
2. Login dengan akun admin
3. Pilih menu "Kelola Berita"

#### B. **Mengatur Berita Utama**
1. **Edit Berita Existing:**
   - Klik "Edit" pada berita yang ingin dijadikan utama
   - Centang checkbox "Jadikan Berita Utama" 
   - Klik "Update Berita"

2. **Tambah Berita Baru sebagai Utama:**
   - Klik "Tambah Berita Baru"
   - Isi semua field berita
   - Centang checkbox "Jadikan Berita Utama"
   - Klik "Simpan Berita"

### 2. **Melalui Database Langsung**

#### A. **Menggunakan phpMyAdmin/MySQL**
```sql
-- Jadikan berita dengan ID 1 sebagai berita utama
UPDATE berita SET featured = 1 WHERE id_berita = 1;

-- Hapus status berita utama dari berita ID 2
UPDATE berita SET featured = 0 WHERE id_berita = 2;

-- Lihat semua berita utama
SELECT id_berita, judul, featured FROM berita WHERE featured = 1;
```

#### B. **Menggunakan API**
```javascript
// Set berita utama via API
fetch('api/manage_news.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'update',
        id_berita: 1,
        featured: true
    })
});
```

## 🎨 **Perbedaan Visual di Website**

### **Berita Utama:**
- ✅ Muncul di section "Berita Utama" (atas halaman)
- ✅ Layout lebih besar (2 kolom grid)
- ✅ Badge merah "UTAMA" di pojok kiri atas gambar
- ✅ Gambar lebih besar (h-64 = 256px)
- ✅ Padding lebih besar (p-6)
- ✅ Shadow lebih tebal (shadow-lg)

### **Berita Biasa:**
- ✅ Muncul di section "Berita Terbaru" (bawah halaman)
- ✅ Layout grid 2 kolom (md:grid-cols-2)
- ✅ Badge biru dengan nama kategori
- ✅ Gambar standar (h-48 = 192px)
- ✅ Padding standar (p-4)
- ✅ Shadow standar (shadow-md)

## ⚙️ **Aturan Sistem**

### **Batasan Berita Utama:**
- 🔢 **Maksimal 1 berita utama** ditampilkan di halaman
- 🔄 **Auto-replace:** Jika ada berita baru dijadikan utama, berita utama lama otomatis jadi biasa
- 📅 **Berdasarkan tanggal:** Jika ada multiple berita utama, yang terbaru yang ditampilkan

### **Query API:**
```php
// Ambil berita utama
GET api/get_news.php?featured=true&limit=1

// Ambil berita biasa (non-featured)
GET api/get_news.php?featured=false&limit=6
```

## 🛠️ **Troubleshooting**

### **Masalah: Berita Utama Tidak Muncul**
1. **Cek Database:**
   ```sql
   SELECT * FROM berita WHERE featured = 1 AND status = 'publish';
   ```

2. **Cek API Response:**
   - Buka: `api/get_news.php?featured=true&limit=1`
   - Pastikan `"success": true` dan ada data

3. **Cek Browser Console:**
   - Tekan F12 → Console
   - Lihat error JavaScript

### **Masalah: Multiple Berita Utama**
```sql
-- Reset semua berita jadi non-utama
UPDATE berita SET featured = 0;

-- Jadikan 1 berita saja sebagai utama
UPDATE berita SET featured = 1 WHERE id_berita = [ID_BERITA];
```

## 📝 **Best Practices**

### **Pemilihan Berita Utama:**
1. **Konten Penting:** Gempa besar, tsunami, cuaca ekstrem
2. **Terbaru:** Maksimal 24 jam terakhir
3. **Gambar Berkualitas:** Resolusi minimal 800x400px
4. **Judul Menarik:** Maksimal 60 karakter
5. **Ringkasan Jelas:** 2-3 kalimat yang informatif

### **Rotasi Berita Utama:**
- 🔄 **Harian:** Ganti berita utama setiap hari
- ⏰ **Jam Sibuk:** Update saat traffic tinggi (07:00, 12:00, 19:00)
- 📊 **Monitor Views:** Pantau statistik views dan engagement

## 🎯 **Contoh Penggunaan**

### **Scenario 1: Gempa Besar Terjadi**
```sql
-- Jadikan berita gempa sebagai utama
UPDATE berita SET featured = 1 WHERE judul LIKE '%Gempa%' AND tanggal_publish >= CURDATE();
```

### **Scenario 2: Rotasi Harian**
```sql
-- Reset berita utama kemarin
UPDATE berita SET featured = 0 WHERE featured = 1;

-- Jadikan berita terbaru hari ini sebagai utama
UPDATE berita SET featured = 1 WHERE id_berita = (
    SELECT id_berita FROM berita 
    WHERE status = 'publish' AND DATE(tanggal_publish) = CURDATE() 
    ORDER BY tanggal_publish DESC LIMIT 1
);
```

---

**💡 Tips:** Gunakan admin panel untuk kemudahan, atau database langsung untuk kontrol penuh!