# Panduan Deploy Project di Komputer Lokal

## Persyaratan Sistem

Sebelum memulai, pastikan komputer Anda memiliki:
- Windows 10/11
- Koneksi internet (untuk download software)
- Minimal 2GB RAM
- 500MB ruang disk kosong

---

## Metode 1: Menggunakan XAMPP (RECOMMENDED)

### Langkah 1: Download dan Install XAMPP

1. **Download XAMPP**
   - Buka browser, kunjungi: https://www.apachefriends.org/
   - Download XAMPP untuk Windows (versi terbaru dengan PHP 8.x)
   - Ukuran file sekitar 150MB

2. **Install XAMPP**
   - Jalankan file installer yang sudah didownload
   - Pilih komponen yang akan diinstall:
     - ✅ Apache (Web Server)
     - ✅ MySQL (Database)
     - ✅ PHP
     - ✅ phpMyAdmin
   - Pilih lokasi instalasi (default: `C:\xampp`)
   - Klik "Next" sampai selesai
   - Jika ada Windows Firewall popup, klik "Allow Access"

### Langkah 2: Copy Project ke Folder XAMPP

1. **Buka File Explorer**
   - Navigasi ke folder instalasi XAMPP: `C:\xampp\htdocs`

2. **Buat Folder Project**
   - Di dalam folder `htdocs`, buat folder baru bernama `bmkg-mataram`
   - Path lengkap: `C:\xampp\htdocs\bmkg-mataram`

3. **Copy Semua File Project**
   - Copy SEMUA file dan folder dari project Anda ke folder `bmkg-mataram`
   - Pastikan struktur folder seperti ini:
   ```
   C:\xampp\htdocs\bmkg-mataram\
   ├── admin/
   ├── api/
   ├── config/
   ├── database/
   ├── icons/
   ├── images/
   ├── index.html
   ├── berita.html
   ├── tsunami.html
   ├── tanda-waktu.html
   ├── styles.css
   ├── script.js
   ├── bmkg-clock.js
   └── ... (file lainnya)
   ```

### Langkah 3: Start XAMPP Services

1. **Buka XAMPP Control Panel**
   - Cari "XAMPP Control Panel" di Start Menu
   - Atau jalankan dari: `C:\xampp\xampp-control.exe`
   - **PENTING**: Jalankan sebagai Administrator (klik kanan → Run as Administrator)

2. **Start Apache dan MySQL**
   - Klik tombol "Start" di sebelah **Apache**
   - Tunggu sampai background berubah hijau
   - Klik tombol "Start" di sebelah **MySQL**
   - Tunggu sampai background berubah hijau

3. **Verifikasi Services Berjalan**
   - Apache seharusnya running di port 80
   - MySQL seharusnya running di port 3306
   - Jika ada error port conflict, lihat bagian "Troubleshooting" di bawah

### Langkah 4: Setup Database

1. **Buka phpMyAdmin**
   - Buka browser (Chrome/Firefox/Edge)
   - Ketik di address bar: `http://localhost/phpmyadmin`
   - Tekan Enter

2. **Buat Database Baru**
   - Klik tab "Databases" di bagian atas
   - Di kolom "Create database", ketik: `db_berita`
   - Pilih Collation: `utf8mb4_general_ci`
   - Klik tombol "Create"

3. **Import Database Schema**
   - Klik database `db_berita` yang baru dibuat (di sidebar kiri)
   - Klik tab "Import" di bagian atas
   - Klik tombol "Choose File"
   - Navigasi ke: `C:\xampp\htdocs\bmkg-mataram\database\db_berita.sql`
   - Klik "Go" di bagian bawah
   - Tunggu sampai muncul pesan sukses

4. **Import User Admin**
   - Masih di database `db_berita`
   - Klik tab "Import" lagi
   - Pilih file: `database\ready_to_use_admin_users.sql`
   - Klik "Go"
   - Ini akan membuat user admin yang siap digunakan

### Langkah 5: Konfigurasi Database Connection

1. **Edit File Config**
   - Buka file: `C:\xampp\htdocs\bmkg-mataram\api\config.php`
   - Gunakan text editor (Notepad++, VS Code, atau Notepad biasa)

2. **Sesuaikan Konfigurasi**
   ```php
   <?php
   // Database Configuration untuk XAMPP Lokal
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');           // Username default XAMPP
   define('DB_PASS', '');               // Password kosong untuk XAMPP default
   define('DB_NAME', 'db_berita');
   define('DB_CHARSET', 'utf8mb4');
   ```

3. **Save File**
   - Simpan perubahan (Ctrl+S)

### Langkah 6: Test Website

1. **Buka Website di Browser**
   - Buka browser baru
   - Ketik: `http://localhost/bmkg-mataram`
   - Tekan Enter

2. **Halaman yang Bisa Diakses**
   - Homepage: `http://localhost/bmkg-mataram/index.html`
   - Berita: `http://localhost/bmkg-mataram/berita.html`
   - Tsunami: `http://localhost/bmkg-mataram/tsunami.html`
   - Tanda Waktu: `http://localhost/bmkg-mataram/tanda-waktu.html`
   - Admin Login: `http://localhost/bmkg-mataram/admin/login.html`

3. **Test Admin Panel**
   - Buka: `http://localhost/bmkg-mataram/admin/login.html`
   - Login dengan salah satu akun berikut:

   **Superadmin:**
   - Username: `superadmin`
   - Password: `Super@2024`

   **Admin:**
   - Username: `admin`
   - Password: `Admin@2024`

   **Editor:**
   - Username: `editor`
   - Password: `Editor@2024`

---

## Metode 2: Menggunakan Laragon (Alternatif)

### Langkah 1: Download dan Install Laragon

1. **Download Laragon**
   - Kunjungi: https://laragon.org/download/
   - Download "Laragon Full" (sekitar 200MB)

2. **Install Laragon**
   - Jalankan installer
   - Pilih lokasi instalasi (default: `C:\laragon`)
   - Ikuti wizard instalasi sampai selesai

### Langkah 2: Setup Project

1. **Copy Project**
   - Buka folder: `C:\laragon\www`
   - Buat folder baru: `bmkg-mataram`
   - Copy semua file project ke folder tersebut

2. **Start Laragon**
   - Buka Laragon
   - Klik "Start All"
   - Tunggu sampai Apache dan MySQL berjalan

3. **Setup Database**
   - Klik kanan icon Laragon di system tray
   - Pilih "Database" → "Open"
   - Ikuti langkah yang sama seperti XAMPP (Langkah 4)

4. **Akses Website**
   - Buka browser: `http://localhost/bmkg-mataram`

---

## Metode 3: Tanpa Database (Frontend Only)

Jika Anda hanya ingin melihat tampilan website tanpa fitur CMS:

### Langkah 1: Install Live Server Extension (VS Code)

1. **Buka VS Code**
   - Jika belum punya, download dari: https://code.visualstudio.com/

2. **Install Extension**
   - Tekan `Ctrl+Shift+X` untuk buka Extensions
   - Cari "Live Server"
   - Klik "Install" pada extension oleh Ritwick Dey

### Langkah 2: Jalankan Website

1. **Buka Folder Project**
   - Di VS Code: File → Open Folder
   - Pilih folder project Anda

2. **Start Live Server**
   - Klik kanan pada file `index.html`
   - Pilih "Open with Live Server"
   - Browser akan otomatis terbuka

3. **Akses Halaman**
   - Homepage akan terbuka otomatis
   - Navigasi ke halaman lain melalui menu

**CATATAN**: Dengan metode ini, fitur berita dan admin panel TIDAK akan berfungsi karena memerlukan PHP dan database.

---

## Troubleshooting

### Problem 1: Apache Tidak Bisa Start (Port 80 Conflict)

**Penyebab**: Port 80 sudah digunakan aplikasi lain (biasanya Skype atau IIS)

**Solusi**:
1. Buka XAMPP Control Panel
2. Klik "Config" di sebelah Apache
3. Pilih "httpd.conf"
4. Cari baris: `Listen 80`
5. Ubah menjadi: `Listen 8080`
6. Cari baris: `ServerName localhost:80`
7. Ubah menjadi: `ServerName localhost:8080`
8. Save dan restart Apache
9. Akses website dengan: `http://localhost:8080/bmkg-mataram`

### Problem 2: MySQL Tidak Bisa Start (Port 3306 Conflict)

**Penyebab**: Port 3306 sudah digunakan (biasanya MySQL service lain)

**Solusi**:
1. Buka Task Manager (Ctrl+Shift+Esc)
2. Cari service "MySQL" yang berjalan
3. Stop service tersebut
4. Atau ubah port MySQL di XAMPP:
   - Config → my.ini
   - Ubah `port=3306` menjadi `port=3307`
   - Restart MySQL

### Problem 3: Halaman Blank atau Error 404

**Solusi**:
1. Pastikan semua file sudah tercopy dengan benar
2. Cek path URL: `http://localhost/bmkg-mataram/index.html`
3. Cek XAMPP Control Panel - Apache harus berwarna hijau
4. Cek file ada di: `C:\xampp\htdocs\bmkg-mataram\`

### Problem 4: Database Connection Error

**Solusi**:
1. Pastikan MySQL sudah running (hijau di XAMPP)
2. Cek file `api/config.php`:
   - DB_HOST = 'localhost'
   - DB_USER = 'root'
   - DB_PASS = '' (kosong)
3. Pastikan database `db_berita` sudah dibuat
4. Test koneksi di phpMyAdmin: `http://localhost/phpmyadmin`

### Problem 5: Admin Login Tidak Berfungsi

**Solusi**:
1. Pastikan database sudah diimport
2. Cek tabel `admin_users` ada di database
3. Pastikan file `api/auth.php` ada dan bisa diakses
4. Cek browser console (F12) untuk error JavaScript
5. Clear browser cache (Ctrl+Shift+Delete)

### Problem 6: Gambar atau CSS Tidak Muncul

**Solusi**:
1. Cek path file di browser console (F12)
2. Pastikan folder `icons` dan `images` ada
3. Cek permission folder (harus readable)
4. Hard refresh browser: Ctrl+F5

---

## Checklist Verifikasi

Setelah setup, pastikan semua ini berfungsi:

### Frontend (Tanpa Database)
- [ ] Homepage terbuka dengan baik
- [ ] Menu navigasi berfungsi
- [ ] Jam BMKG muncul dan berjalan
- [ ] Halaman Tsunami terbuka
- [ ] Halaman Tanda Waktu terbuka
- [ ] Responsive design bekerja (resize browser)

### Backend (Dengan Database)
- [ ] phpMyAdmin bisa diakses
- [ ] Database `db_berita` sudah dibuat
- [ ] Tabel-tabel sudah ada (admin_users, berita, kategori, dll)
- [ ] Admin login page terbuka
- [ ] Bisa login dengan akun admin
- [ ] Admin panel terbuka setelah login
- [ ] Halaman berita menampilkan data dari database

---

## Tips Penggunaan

### Untuk Development
1. **Selalu jalankan XAMPP** sebelum membuka website
2. **Jangan tutup XAMPP** saat sedang development
3. **Backup database** secara berkala:
   - phpMyAdmin → Export → Go
4. **Edit file** langsung di folder `htdocs/bmkg-mataram`
5. **Refresh browser** (F5) untuk melihat perubahan

### Untuk Testing
1. **Test di berbagai browser**: Chrome, Firefox, Edge
2. **Test responsive**: Resize browser atau gunakan DevTools (F12)
3. **Test admin panel**: Coba semua fitur CRUD
4. **Test form validation**: Coba input data invalid
5. **Check console**: Buka DevTools (F12) untuk lihat error

### Untuk Production
1. **Ganti password default** semua akun admin
2. **Backup database** sebelum deploy
3. **Update config.php** dengan kredensial production
4. **Enable HTTPS** di server production
5. **Set proper file permissions** di server

---

## Akses Cepat

Setelah setup selesai, bookmark URL berikut:

- **Homepage**: http://localhost/bmkg-mataram/
- **Admin Login**: http://localhost/bmkg-mataram/admin/login.html
- **phpMyAdmin**: http://localhost/phpmyadmin
- **XAMPP Control**: C:\xampp\xampp-control.exe

---

## Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **Cek XAMPP Error Log**:
   - `C:\xampp\apache\logs\error.log`
   - `C:\xampp\mysql\data\mysql_error.log`

2. **Cek Browser Console**:
   - Tekan F12
   - Tab "Console" untuk JavaScript errors
   - Tab "Network" untuk HTTP errors

3. **Dokumentasi**:
   - Baca file `README_BERITA_CMS.md` untuk info CMS
   - Baca file `database/user_management_guide.md` untuk user management
   - Baca file `admin/README_AUTH_SYSTEM.md` untuk authentication

---

## Selamat! 🎉

Jika semua langkah diikuti dengan benar, website Stasiun Geofisika Mataram BMKG sekarang sudah berjalan di komputer lokal Anda!

**Next Steps**:
1. Explore semua halaman website
2. Login ke admin panel dan coba buat berita
3. Customize konten sesuai kebutuhan
4. Siapkan untuk deploy ke server production

**Selamat mengembangkan! 🚀**
