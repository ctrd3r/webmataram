// BMKG Digital Clock Component
// Menampilkan jam sesuai dengan format website resmi BMKG
// Default timezone: WITA (UTC+8) untuk Stasiun Geofisika Mataram, NTB

class BMKGClock {
    constructor() {
        this.timeZones = {
            'WIB': 'Asia/Jakarta',     // UTC+7 - Jawa, Sumatera
            'WITA': 'Asia/Makassar',   // UTC+8 - NTB, Bali, Sulawesi, Kalimantan Tengah & Selatan
            'WIT': 'Asia/Jayapura'     // UTC+9 - Papua, Maluku
        };
        this.currentTimeZone = 'WITA'; // Default timezone untuk Mataram, NTB
        this.clockElement = null;
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.createClockElement();
        this.startClock();
        this.detectUserTimeZone();
    }

    createClockElement() {
        // Cari container untuk jam atau buat baru
        let clockContainer = document.getElementById('bmkg-clock-container');
        
        if (!clockContainer) {
            // Buat container baru jika belum ada
            clockContainer = document.createElement('div');
            clockContainer.id = 'bmkg-clock-container';
            clockContainer.className = 'bmkg-clock-container';
            
            // Cari tempat yang tepat untuk menempatkan jam (di header)
            const header = document.querySelector('header');
            if (header) {
                const headerContent = header.querySelector('.flex.items-center.justify-between');
                if (headerContent) {
                    // Tambahkan jam di sebelah kanan header
                    headerContent.appendChild(clockContainer);
                }
            }
        }

        // Buat elemen jam
        clockContainer.innerHTML = `
            <div class="bmkg-clock-widget">
                <div class="bmkg-clock-label">
                    <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">Standar Waktu Indonesia</span>
                </div>
                <div class="bmkg-clock-display">
                    <span id="bmkg-time-display" class="bmkg-time-text">--:--:--</span>
                    <span id="bmkg-timezone-display" class="bmkg-timezone-text">WITA</span>
                </div>
                <div class="bmkg-clock-date">
                    <span id="bmkg-date-display" class="text-xs text-slate-500 dark:text-slate-400">-- --- ----</span>
                </div>
                <div class="bmkg-clock-location">
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">Mataram, NTB</span>
                </div>
            </div>
        `;

        this.clockElement = clockContainer;
        this.addClockStyles();
    }

    addClockStyles() {
        // Tambahkan CSS untuk jam jika belum ada
        if (!document.getElementById('bmkg-clock-styles')) {
            const style = document.createElement('style');
            style.id = 'bmkg-clock-styles';
            style.textContent = `
                .bmkg-clock-container {
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                    padding: 0 1rem;
                }

                .bmkg-clock-widget {
                    text-align: right;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    user-select: none;
                    cursor: default;
                }

                .bmkg-clock-label {
                    margin-bottom: 2px;
                }

                .bmkg-clock-display {
                    display: flex;
                    align-items: baseline;
                    justify-content: flex-end;
                    gap: 0.5rem;
                    margin-bottom: 1px;
                }

                .bmkg-time-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    color: #1e40af;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    letter-spacing: 0.05em;
                }

                .dark .bmkg-time-text {
                    color: #60a5fa;
                }

                .bmkg-timezone-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #475569;
                    background: #f1f5f9;
                    padding: 2px 6px;
                    border-radius: 4px;
                    border: 1px solid #e2e8f0;
                }

                .dark .bmkg-timezone-text {
                    color: #94a3b8;
                    background: #334155;
                    border-color: #475569;
                }

                .bmkg-clock-date {
                    font-size: 0.75rem;
                }

                .bmkg-clock-location {
                    font-size: 0.625rem;
                    margin-top: 1px;
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .bmkg-clock-container {
                        padding: 0 0.5rem;
                    }
                    
                    .bmkg-time-text {
                        font-size: 1rem;
                    }
                    
                    .bmkg-clock-label span {
                        font-size: 0.625rem;
                    }
                    
                    .bmkg-clock-date span {
                        font-size: 0.625rem;
                    }
                    
                    .bmkg-clock-location {
                        font-size: 0.5rem;
                    }
                }

                /* Animation untuk transisi detik */
                .bmkg-time-text {
                    transition: color 0.1s ease-in-out;
                }

                .bmkg-time-text.tick {
                    color: #dc2626;
                }

                .dark .bmkg-time-text.tick {
                    color: #f87171;
                }

                /* Hover effect */
                .bmkg-clock-widget:hover .bmkg-time-text {
                    transform: scale(1.02);
                    transition: transform 0.2s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }
    }

    startClock() {
        this.updateTime();
        
        // Update setiap detik
        this.updateInterval = setInterval(() => {
            this.updateTime();
        }, 1000);

        // Sinkronisasi dengan detik yang tepat
        const now = new Date();
        const msUntilNextSecond = 1000 - now.getMilliseconds();
        
        setTimeout(() => {
            this.updateTime();
            clearInterval(this.updateInterval);
            this.updateInterval = setInterval(() => {
                this.updateTime();
            }, 1000);
        }, msUntilNextSecond);
    }

    updateTime() {
        const now = new Date();
        const timeZone = this.timeZones[this.currentTimeZone];
        
        // Format waktu sesuai timezone Indonesia
        const timeOptions = {
            timeZone: timeZone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        const dateOptions = {
            timeZone: timeZone,
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };

        const timeString = now.toLocaleTimeString('id-ID', timeOptions);
        const dateString = now.toLocaleDateString('id-ID', dateOptions);

        // Update display
        const timeDisplay = document.getElementById('bmkg-time-display');
        const timezoneDisplay = document.getElementById('bmkg-timezone-display');
        const dateDisplay = document.getElementById('bmkg-date-display');

        if (timeDisplay) {
            timeDisplay.textContent = timeString;
            
            // Tambahkan efek tick pada detik
            timeDisplay.classList.add('tick');
            setTimeout(() => {
                timeDisplay.classList.remove('tick');
            }, 100);
        }

        if (timezoneDisplay) {
            timezoneDisplay.textContent = this.currentTimeZone;
        }

        if (dateDisplay) {
            dateDisplay.textContent = dateString;
        }

        // Update title untuk accessibility
        if (this.clockElement) {
            this.clockElement.title = `Waktu Indonesia ${this.currentTimeZone}: ${timeString}, ${dateString} - Stasiun Geofisika Mataram, NTB`;
        }
    }

    detectUserTimeZone() {
        // Deteksi timezone user berdasarkan lokasi
        // Default WITA untuk Stasiun Geofisika Mataram, NTB
        try {
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Mapping timezone ke zona waktu Indonesia
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

    // Method untuk mengubah timezone
    setTimeZone(timezone) {
        if (this.timeZones[timezone]) {
            this.currentTimeZone = timezone;
            this.updateTime();
            
            // Simpan preferensi user
            localStorage.setItem('bmkg-preferred-timezone', timezone);
        }
    }

    // Method untuk mendapatkan waktu dalam format tertentu
    getCurrentTime(format = 'full') {
        const now = new Date();
        const timeZone = this.timeZones[this.currentTimeZone];

        switch (format) {
            case 'time':
                return now.toLocaleTimeString('id-ID', {
                    timeZone: timeZone,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            case 'date':
                return now.toLocaleDateString('id-ID', {
                    timeZone: timeZone,
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
            case 'datetime':
                return now.toLocaleString('id-ID', {
                    timeZone: timeZone,
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            default:
                return {
                    time: this.getCurrentTime('time'),
                    date: this.getCurrentTime('date'),
                    timezone: this.currentTimeZone,
                    timestamp: now.getTime()
                };
        }
    }

    // Method untuk sync dengan server BMKG (jika diperlukan)
    async syncWithBMKGServer() {
        try {
            // Placeholder untuk sync dengan server BMKG
            // const response = await fetch('https://jam.bmkg.go.id/api/time');
            // const serverTime = await response.json();
            
            console.log('BMKG Clock: Using local time (server sync not implemented)');
        } catch (error) {
            console.log('BMKG Clock: Could not sync with server, using local time');
        }
    }

    // Cleanup method
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.clockElement) {
            this.clockElement.remove();
        }

        const styles = document.getElementById('bmkg-clock-styles');
        if (styles) {
            styles.remove();
        }
    }

    // Static method untuk inisialisasi mudah
    static init() {
        return new BMKGClock();
    }
}

// Auto-initialize jika DOM sudah ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bmkgClock = BMKGClock.init();
    });
} else {
    window.bmkgClock = BMKGClock.init();
}

// Export untuk module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BMKGClock;
}