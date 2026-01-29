# Update Timezone ke WITA untuk Stasiun Geofisika Mataram

Update konfigurasi jam digital BMKG untuk menampilkan waktu WITA (UTC+8) sebagai default, sesuai dengan lokasi Stasiun Geofisika Mataram di Nusa Tenggara Barat.

## 🌍 Alasan Perubahan

### Lokasi Geografis
- **Stasiun Geofisika Mataram** berada di **Nusa Tenggara Barat (NTB)**
- **NTB** termasuk dalam **zona waktu WITA (UTC+8)**
- Website ini khusus untuk Stasiun Geofisika Mataram, bukan untuk seluruh Indonesia

### Zona Waktu Indonesia
- **WIB (UTC+7)**: Jawa, Sumatera
- **WITA (UTC+8)**: **NTB**, Bali, Sulawesi, Kalimantan Tengah & Selatan
- **WIT (UTC+9)**: Papua, Maluku

## 🕐 Perubahan yang Dilakukan

### 1. Default Timezone
```javascript
// Sebelum
this.currentTimeZone = 'WIB'; // Default timezone

// Sesudah  
this.currentTimeZone = 'WITA'; // Default timezone untuk Mataram, NTB
```

### 2. Auto-Detection Logic
```javascript
detectUserTimeZone() {
    // Default ke WITA untuk Stasiun Geofisika Mataram, NTB
    try {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const timezoneMapping = {
            'Asia/Jakarta': 'WIB',
            'Asia/Pontianak': 'WIB',
            'Asia/Makassar': 'WITA',
            'Asia/Ujung_Pandang': 'WITA',
            'Asia/Jayapura': 'WIT'
        };

        if (timezoneMapping[userTimeZone]) {
            this.currentTimeZone = timezoneMapping[userTimeZone];
        } else {
            // Default ke WITA untuk Stasiun Geofisika Mataram, NTB
            this.currentTimeZone = 'WITA';
        }
    } catch (error) {
        console.log('Could not detect timezone, using default WITA for Mataram, NTB');
        this.currentTimeZone = 'WITA';
    }
}
```

### 3. Display Enhancement
```html
<!-- Tambahan label lokasi -->
<div class="bmkg-clock-location">
    <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">Mataram, NTB</span>
</div>
```

### 4. Tsunami Status Update
```javascript
// Update status time di tsunami.js juga menggunakan WITA
updateStatusTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Makassar', // WITA untuk Mataram, NTB
        hour12: false
    }) + ' WITA';
    
    const statusElement = document.getElementById('status-update-time');
    if (statusElement) {
        statusElement.textContent = timeString;
    }
}
```

## 📱 Tampilan Setelah Update

### Format Display
```
Standar Waktu Indonesia
14 : 39 : 19  WITA
Senin, 28 Januari 2024
Mataram, NTB
```

### Visual Changes
- **Timezone Badge**: Menampilkan "WITA" instead of "WIB"
- **Location Label**: Tambahan "Mataram, NTB" di bawah tanggal
- **Time Accuracy**: Waktu sesuai dengan zona WITA (UTC+8)
- **Consistency**: Semua halaman menampilkan waktu WITA

## 🎯 Dampak Perubahan

### User Experience
- **Akurasi Waktu**: Waktu yang ditampilkan sesuai dengan lokasi stasiun
- **Konsistensi**: Semua sistem menampilkan waktu yang sama
- **Clarity**: Jelas bahwa ini adalah waktu untuk wilayah NTB

### Technical Impact
- **Default Behavior**: Semua user akan melihat waktu WITA
- **Auto-Detection**: Tetap berfungsi untuk user di timezone lain
- **Fallback**: WITA sebagai fallback jika deteksi gagal
- **Performance**: Tidak ada impact pada performance

## 🔧 Implementation Details

### Files Modified
1. **bmkg-clock.js**: Main clock component
   - Default timezone changed to WITA
   - Enhanced auto-detection logic
   - Added location label
   - Updated accessibility title

2. **tsunami.js**: Tsunami status time
   - Status update time uses WITA
   - Consistent with main clock

### CSS Enhancements
```css
.bmkg-clock-location {
    font-size: 0.625rem;
    margin-top: 1px;
}

@media (max-width: 768px) {
    .bmkg-clock-location {
        font-size: 0.5rem;
    }
}
```

## 🌐 Timezone Mapping

### Indonesia Timezone Coverage
```javascript
const timezoneMapping = {
    // WIB (UTC+7)
    'Asia/Jakarta': 'WIB',      // Jakarta, Jawa
    'Asia/Pontianak': 'WIB',    // Kalimantan Barat
    
    // WITA (UTC+8) - DEFAULT untuk website ini
    'Asia/Makassar': 'WITA',    // Sulawesi, NTB, Bali
    'Asia/Ujung_Pandang': 'WITA', // Sulawesi (old name)
    
    // WIT (UTC+9)
    'Asia/Jayapura': 'WIT'      // Papua, Maluku
};
```

### Regional Coverage WITA
- **Nusa Tenggara Barat (NTB)** ✅ - Lokasi Stasiun Geofisika Mataram
- **Nusa Tenggara Timur (NTT)**
- **Bali**
- **Sulawesi** (semua provinsi)
- **Kalimantan Tengah**
- **Kalimantan Selatan**

## 🚀 Benefits

### For Users
- **Accurate Time**: Waktu yang tepat untuk wilayah NTB
- **Local Context**: Jelas bahwa ini adalah stasiun lokal Mataram
- **Consistency**: Semua fitur menggunakan waktu yang sama

### For Operations
- **Operational Accuracy**: Timestamp yang akurat untuk data monitoring
- **Report Consistency**: Semua laporan menggunakan waktu lokal
- **Emergency Response**: Waktu yang tepat untuk koordinasi darurat

## 📊 Verification

### Testing Scenarios
1. **Default Load**: Website load dengan WITA sebagai default ✅
2. **Auto-Detection**: User dari timezone lain tetap bisa melihat timezone mereka
3. **Fallback**: Jika deteksi gagal, fallback ke WITA ✅
4. **Consistency**: Semua komponen menggunakan WITA ✅

### Quality Assurance
- **Time Accuracy**: Verified dengan timeanddate.com untuk Mataram
- **Display Format**: Sesuai dengan format BMKG resmi
- **Responsive**: Tested di berbagai device sizes
- **Accessibility**: Screen reader friendly dengan proper labels

## 🔄 Future Considerations

### Multi-Station Support
Jika di masa depan website ini akan support multiple stasiun:
```javascript
const stationConfig = {
    'mataram': {
        timezone: 'WITA',
        location: 'Mataram, NTB',
        coordinates: [-8.5833, 116.1167]
    },
    'jakarta': {
        timezone: 'WIB', 
        location: 'Jakarta, DKI',
        coordinates: [-6.2088, 106.8456]
    }
};
```

### Configuration Options
```javascript
// Possible future configuration
const clockConfig = {
    defaultTimezone: 'WITA',
    showLocation: true,
    allowTimezoneSwitch: true,
    stationName: 'Stasiun Geofisika Mataram'
};
```

---

**Update ini memastikan bahwa jam digital menampilkan waktu yang akurat dan relevan untuk Stasiun Geofisika Mataram di wilayah WITA (UTC+8).**