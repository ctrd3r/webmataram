# Template Halaman Konten - Mengikuti Pola BMKG

## 📋 Overview

Template halaman konten yang telah dibuat mengikuti struktur dan desain website BMKG (www.bmkg.go.id) dengan adaptasi modern untuk Stasiun Geofisika Mataram.

## 🎯 Halaman yang Telah Dibuat

### 1. **Halaman Gempa Bumi** (`gempabumi.html`)
- **URL**: `/gempabumi.html`
- **Fitur**:
  - Data gempa real-time dengan tabel interaktif
  - Filter berdasarkan periode, magnitudo, dan wilayah
  - Quick stats (gempa hari ini, minggu ini, magnitudo tertinggi)
  - Pagination untuk data besar
  - Skala magnitudo Richter dengan color coding
  - Auto-refresh setiap 30 detik
  - Responsive design untuk mobile

### 2. **Halaman Tsunami** (`tsunami.html`)
- **URL**: `/tsunami.html`
- **Fitur**:
  - Status peringatan tsunami real-time
  - Monitoring sensor (Seismik, CBT, Sistem Peringatan)
  - Riwayat peringatan 30 hari terakhir
  - Prosedur evakuasi tsunami
  - Kontak darurat lengkap
  - Status visual dengan color coding

## 🏗️ Struktur Template

### **HTML Structure**
```html
<!DOCTYPE html>
<html class="light" lang="id">
<head>
    <!-- SEO Meta Tags -->
    <!-- Open Graph / Social Media -->
    <!-- Schema.org JSON-LD -->
    <!-- PWA Manifest -->
    <!-- Favicon -->
    <!-- External Resources -->
    <!-- Tailwind Config -->
</head>
<body>
    <!-- Header dengan Logo BMKG -->
    <!-- Breadcrumb Navigation -->
    <!-- Main Content -->
    <!-- Footer BMKG Style -->
    <!-- Scripts -->
</body>
</html>
```

### **CSS Framework**
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Properties**: CSS variables untuk theming
- **Dark Mode**: Support untuk mode gelap
- **Responsive**: Mobile-first design
- **BMKG Colors**: Official color palette

### **JavaScript Architecture**
- **ES6+ Classes**: Modern JavaScript structure
- **API Integration**: RESTful API calls
- **Real-time Updates**: Auto-refresh functionality
- **Error Handling**: Silent error management
- **State Management**: Local state untuk data

## 🎨 Design System

### **Color Palette**
```css
:root {
    --bmkg-blue: #1e3a8a;      /* Primary BMKG Blue */
    --bmkg-green: #059669;     /* Success/Safe Status */
    --secondary: #0ea5e9;      /* Light Blue */
    --accent: #f59e0b;         /* Warning/Attention */
    --background-light: #f8fafc;
    --background-dark: #0f172a;
}
```

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive Sizes**: Clamp-based fluid typography

### **Components**
- **Cards**: Rounded corners, shadows, borders
- **Buttons**: BMKG blue primary, hover states
- **Tables**: Striped rows, hover effects, pagination
- **Status Badges**: Color-coded based on severity
- **Icons**: Material Symbols Outlined

## 📊 Data Integration

### **API Endpoints** (Simulasi)
```javascript
const API_BASE = 'https://api.geofisika-mataram.bmkg.go.id/v1';

// Gempa Bumi
GET /earthquake/latest
GET /earthquake/history?limit=50&period=week

// Tsunami
GET /tsunami/status
GET /tsunami/warnings
GET /tsunami/sensors

// Magnet Bumi
GET /magnetic/current
GET /magnetic/history
```

### **Data Format**
```javascript
// Earthquake Data
{
    id: 1,
    datetime: '2024-01-27 13:45:23',
    magnitude: 4.2,
    depth: 15,
    location: '25 km Timur Laut Mataram',
    latitude: -8.4567,
    longitude: 116.2345,
    region: 'lombok',
    status: 'Dirasakan'
}

// Tsunami Status
{
    status: 'normal', // normal, watch, warning, emergency
    level: 'safe',
    message: 'Tidak ada ancaman tsunami',
    lastUpdate: '2024-01-27T13:45:23Z',
    sensors: {
        seismic: 'active',
        buoy: 'normal',
        warning: 'ready'
    }
}
```

## 🚀 Fitur Template

### **1. SEO Optimization**
- **Meta Tags**: Complete SEO meta tags
- **Schema.org**: Structured data markup
- **Open Graph**: Social media sharing
- **Canonical URLs**: Proper URL structure
- **Breadcrumbs**: Navigation hierarchy

### **2. Performance**
- **Lazy Loading**: Images and content
- **Code Splitting**: Separate JS files per page
- **Caching**: Browser and API caching
- **Compression**: Minified assets
- **CDN**: External resources from CDN

### **3. Accessibility**
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard access
- **Color Contrast**: WCAG 2.1 AA compliant
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Proper HTML structure

### **4. PWA Features**
- **Service Worker**: Offline functionality
- **Manifest**: App installation
- **Caching Strategy**: Network-first for data
- **Background Sync**: Offline data sync

## 📱 Responsive Design

### **Breakpoints**
```css
/* Mobile First */
.container { /* Base: 320px+ */ }

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### **Mobile Optimizations**
- **Touch Targets**: Minimum 44px touch areas
- **Viewport**: Proper viewport meta tag
- **Navigation**: Collapsible mobile menu
- **Tables**: Horizontal scroll on mobile
- **Forms**: Mobile-friendly inputs

## 🔧 Customization Guide

### **Membuat Halaman Baru**

1. **Copy Template**:
```bash
cp gempabumi.html halaman-baru.html
cp gempabumi.js halaman-baru.js
```

2. **Update Meta Tags**:
```html
<title>Judul Halaman - Stasiun Geofisika Mataram | BMKG NTB</title>
<meta name="description" content="Deskripsi halaman...">
<link rel="canonical" href="https://geofisika-mataram.bmkg.go.id/halaman-baru.html">
```

3. **Update Navigation**:
```html
<a href="halaman-baru.html" class="text-bmkg-blue font-medium">Halaman Baru</a>
```

4. **Update Breadcrumb**:
```html
<li class="text-bmkg-blue font-medium">Halaman Baru</li>
```

5. **Update Content**:
- Ganti icon dan warna tema
- Update judul dan deskripsi
- Sesuaikan struktur konten
- Update JavaScript functionality

### **Kustomisasi Warna**

```css
/* Untuk halaman dengan tema berbeda */
.theme-magnet {
    --primary-color: #7c3aed; /* Purple untuk Magnet Bumi */
    --bg-color: #f3e8ff;
}

.theme-seismologi {
    --primary-color: #059669; /* Green untuk Seismologi */
    --bg-color: #ecfdf5;
}
```

### **Menambah Fitur Baru**

1. **Filter Tambahan**:
```html
<select id="new-filter">
    <option value="all">Semua</option>
    <option value="option1">Opsi 1</option>
</select>
```

2. **Chart/Grafik**:
```html
<div id="chart-container">
    <canvas id="data-chart"></canvas>
</div>
```

3. **Real-time Updates**:
```javascript
setInterval(() => {
    this.updateData();
}, 30000); // Update setiap 30 detik
```

## 📋 Template Checklist

### **Sebelum Deploy**
- [ ] Update semua meta tags dan SEO
- [ ] Test responsive design di berbagai device
- [ ] Validasi HTML dan CSS
- [ ] Test accessibility dengan screen reader
- [ ] Optimize images dan assets
- [ ] Test API integration
- [ ] Validate JavaScript functionality
- [ ] Test dark mode
- [ ] Check cross-browser compatibility
- [ ] Test PWA functionality

### **Content Requirements**
- [ ] Logo BMKG resmi
- [ ] Kontak darurat yang benar
- [ ] Informasi teknis yang akurat
- [ ] Prosedur keselamatan yang valid
- [ ] Data real-time yang terpercaya

## 🎯 Halaman yang Bisa Dibuat Selanjutnya

### **1. Magnet Bumi** (`magnet.html`)
- Monitoring medan magnet bumi
- Data magnetometer real-time
- Analisis variasi harian
- Indeks aktivitas geomagnetik

### **2. Berita** (`berita.html`)
- Artikel dan pengumuman
- Press release BMKG
- Edukasi publik
- Event dan kegiatan

### **3. Kontak** (`kontak.html`)
- Informasi kontak lengkap
- Peta lokasi stasiun
- Form kontak
- Jam operasional

### **4. Tentang** (`tentang.html`)
- Sejarah stasiun
- Visi misi
- Struktur organisasi
- Fasilitas dan peralatan

## 🚀 Deployment

### **File Structure**
```
/
├── index.html              # Homepage
├── gempabumi.html         # Gempa Bumi
├── tsunami.html           # Tsunami
├── magnet.html            # Magnet Bumi (to be created)
├── berita.html            # Berita (to be created)
├── kontak.html            # Kontak (to be created)
├── styles.css             # Global styles
├── script.js              # Global JavaScript
├── gempabumi.js          # Gempa Bumi functionality
├── tsunami.js            # Tsunami functionality
└── [other page scripts]   # Page-specific scripts
```

### **Server Configuration**
- **HTTPS**: SSL certificate required
- **Compression**: Gzip/Brotli enabled
- **Caching**: Proper cache headers
- **Security**: Security headers configured

---

**Status**: ✅ **Template Ready**  
**Pages Created**: 🏛️ **Gempa Bumi, Tsunami**  
**Design System**: 🎨 **BMKG Compliant**  
**Architecture**: 🚀 **Modern Jamstack**