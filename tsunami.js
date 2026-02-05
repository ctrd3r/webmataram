// Tsunami Warning System JavaScript
class TsunamiWarningSystem {
    constructor() {
        this.apiUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/';
        this.updateInterval = 30000; // 30 seconds
        this.init();
    }

    init() {
        this.updateStatusTime();
        this.loadTsunamiHistory();
        this.startAutoUpdate();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto refresh every 30 seconds
        setInterval(() => {
            this.updateStatusTime();
            this.loadTsunamiHistory();
        }, this.updateInterval);
    }

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

    async loadTsunamiHistory() {
        try {
            // Simulate loading tsunami warning history data
            const historyData = await this.fetchTsunamiHistory();
            this.renderTsunamiHistory(historyData);
        } catch (error) {
            console.error('Error loading tsunami history:', error);
            this.showErrorState();
        }
    }

    async fetchTsunamiHistory() {
        // Data riwayat peringatan tsunami berdasarkan BMKG
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        no: 1,
                        waktu: "10 Oct 2025 08:44:00 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.4,
                        kedalaman: "58 Km",
                        koordinat: "7,23 LU - 126,83 BT",
                        wilayah: "275 km BaratLaut PULAU KARATUNG-SULUT",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 2,
                        waktu: "30 Jul 2025 06:24:51 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 8.7,
                        kedalaman: "18 Km",
                        koordinat: "52,56 LU - 160,04 BT",
                        wilayah: "160 km Tenggara KAMCHATKA-RUSSIA",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 3,
                        waktu: "25 Apr 2023 03:00:57 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.4,
                        kedalaman: "84 Km",
                        koordinat: "0,93 LS - 98,39 BT",
                        wilayah: "177 km BaratLaut KEP-MENTAWAI-SUMBAR",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 4,
                        waktu: "10 Jan 2023 00:47:33 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.5,
                        kedalaman: "130 Km",
                        koordinat: "7,37 LS - 130,23 BT",
                        wilayah: "136 km BaratLaut MALUKU TENGGARA BARAT",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 5,
                        waktu: "14 Dec 2021 10:20:23 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.4,
                        kedalaman: "10 Km",
                        koordinat: "7,59 LS - 122,24 BT",
                        wilayah: "113 km BaratLaut LARANTUKA-NTT",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 6,
                        waktu: "14 Nov 2019 23:17:43 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.1,
                        kedalaman: "73 Km",
                        koordinat: "1,67 LU - 126,39 BT",
                        wilayah: "137 km BaratLaut JAILOLO-MALUT",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 7,
                        waktu: "02 Aug 2019 19:03:25 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.4,
                        kedalaman: "10 Km",
                        koordinat: "7,54 LS - 104,58 BT",
                        wilayah: "147 km BaratDaya SUMUR-BANTEN",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 8,
                        waktu: "07 Jul 2019 22:08:42 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.0,
                        kedalaman: "36 Km",
                        koordinat: "0,54 LU - 126,19 BT",
                        wilayah: "133 km BaratDaya TERNATE-MALUT",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 9,
                        waktu: "28 Sep 2018 18:02:44 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.5,
                        kedalaman: "10 Km",
                        koordinat: "0,18 LS - 119,85 BT",
                        wilayah: "78 km Utara DONGGALA-SULTENG",
                        status: "Berakhir",
                        update: "4"
                    },
                    {
                        no: 10,
                        waktu: "05 Aug 2018 19:46:35 WIB",
                        peringatan: "P.D. Tsunami",
                        magnitudo: 7.0,
                        kedalaman: "15 Km",
                        koordinat: "8,37 LS - 116,48 BT",
                        wilayah: "18 km BaratLaut LOMBOK UTARA-NTB",
                        status: "Berakhir",
                        update: "4"
                    }
                ]);
            }, 1000);
        });
    }

    renderTsunamiHistory(data) {
        const historyContainer = document.getElementById('tsunami-history-container');
        
        if (!data || data.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                    </div>
                    <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">Tidak Ada Peringatan</h3>
                    <p class="text-slate-600 dark:text-slate-400">Tidak ada peringatan tsunami dalam periode ini</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">#</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Waktu</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Peringatan Dini (P.D.)</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Magnitudo</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Kedalaman</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Koordinat</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Wilayah</th>
                            <th class="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white text-xs">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td class="py-4 px-3 font-medium text-slate-900 dark:text-white">${item.no}</td>
                                <td class="py-4 px-3 text-slate-600 dark:text-slate-400">
                                    <div class="text-xs font-medium">${this.formatDateTime(item.waktu)}</div>
                                </td>
                                <td class="py-4 px-3">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                        <span class="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                                        ${item.peringatan}
                                    </span>
                                </td>
                                <td class="py-4 px-3">
                                    <div class="font-bold text-slate-900 dark:text-white">${item.magnitudo}</div>
                                    <div class="text-xs text-slate-500 dark:text-slate-400">${this.getMagnitudeCategory(item.magnitudo)}</div>
                                </td>
                                <td class="py-4 px-3 text-slate-600 dark:text-slate-400 font-medium">${item.kedalaman}</td>
                                <td class="py-4 px-3 text-slate-600 dark:text-slate-400 text-xs font-mono">
                                    ${item.koordinat}
                                </td>
                                <td class="py-4 px-3 text-slate-600 dark:text-slate-400 text-xs max-w-xs">
                                    <div class="truncate" title="${item.wilayah}">
                                        ${item.wilayah}
                                    </div>
                                </td>
                                <td class="py-4 px-3">
                                    <button onclick="tsunamiSystem.showDetail(${item.no})" class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors">
                                        <span class="material-symbols-outlined text-sm mr-1">visibility</span>
                                        Lihat
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Info dan Pagination -->
            <div class="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 gap-4">
                <div class="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span>Peringatan Tsunami</span>
                    </div>
                    <div class="text-xs">
                        Menampilkan ${data.length} peringatan terakhir
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 dark:text-slate-400">
                        Data dari BMKG • Diperbarui setiap 30 detik
                    </span>
                </div>
            </div>
            
            <!-- Legend -->
            <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-2">Keterangan:</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div>• <strong>P.D. Tsunami:</strong> Peringatan Dini Tsunami</div>
                    <div>• <strong>Koordinat:</strong> Lintang Utara/Selatan - Bujur Timur/Barat</div>
                    <div>• <strong>Status:</strong> Semua peringatan telah berakhir</div>
                </div>
            </div>
        `;
    }

    getMagnitudeCategory(magnitude) {
        if (magnitude >= 8.0) return 'Sangat Besar';
        if (magnitude >= 7.0) return 'Besar';
        if (magnitude >= 6.0) return 'Kuat';
        if (magnitude >= 5.0) return 'Sedang';
        return 'Ringan';
    }

    formatDateTime(dateTimeString) {
        try {
            // Parse the date string and format it nicely
            const date = new Date(dateTimeString.replace(' WIB', ''));
            const options = {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
            };
            return date.toLocaleDateString('id-ID', options) + ' WIB';
        } catch (error) {
            return dateTimeString;
        }
    }

    showDetail(id) {
        // Show detailed information about the tsunami warning
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Detail Peringatan Tsunami #${id}</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-red-600 text-2xl">warning</span>
                            <div>
                                <h4 class="font-semibold text-red-800 dark:text-red-400">Peringatan Dini Tsunami</h4>
                                <p class="text-sm text-red-700 dark:text-red-300">Status: Berakhir</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 class="font-semibold text-slate-900 dark:text-white mb-3">Informasi Gempa</h5>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Waktu:</span>
                                    <span class="font-medium">Loading...</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Magnitudo:</span>
                                    <span class="font-medium">Loading...</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Kedalaman:</span>
                                    <span class="font-medium">Loading...</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600 dark:text-slate-400">Koordinat:</span>
                                    <span class="font-medium">Loading...</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold text-slate-900 dark:text-white mb-3">Lokasi & Dampak</h5>
                            <div class="space-y-2 text-sm">
                                <div>
                                    <span class="text-slate-600 dark:text-slate-400">Wilayah:</span>
                                    <p class="font-medium mt-1">Loading...</p>
                                </div>
                                <div>
                                    <span class="text-slate-600 dark:text-slate-400">Potensi Tsunami:</span>
                                    <p class="font-medium mt-1 text-red-600">Ya</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h5 class="font-semibold text-slate-900 dark:text-white mb-3">Tindakan yang Diambil</h5>
                        <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• Peringatan dini tsunami dikeluarkan</li>
                            <li>• Koordinasi dengan BPBD setempat</li>
                            <li>• Monitoring berkelanjutan</li>
                            <li>• Peringatan dicabut setelah evaluasi</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showErrorState() {
        const historyContainer = document.getElementById('tsunami-history-container');
        historyContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-red-600 text-2xl">error</span>
                </div>
                <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">Gagal Memuat Data</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-4">Terjadi kesalahan saat memuat riwayat peringatan tsunami</p>
                <button onclick="tsunamiSystem.loadTsunamiHistory()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Coba Lagi
                </button>
            </div>
        `;
    }

    startAutoUpdate() {
        // Update status every minute
        setInterval(() => {
            this.updateStatusTime();
        }, 60000);
        
        // Reload data every 5 minutes
        setInterval(() => {
            this.loadTsunamiHistory();
        }, 300000);
    }

    // Utility method to get tsunami risk level based on magnitude
    getTsunamiRiskLevel(magnitude) {
        if (magnitude >= 8.0) return { level: 'Sangat Tinggi', color: 'red' };
        if (magnitude >= 7.5) return { level: 'Tinggi', color: 'orange' };
        if (magnitude >= 7.0) return { level: 'Sedang', color: 'yellow' };
        return { level: 'Rendah', color: 'green' };
    }

    // Method to show real-time alerts (if any)
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'danger' ? 'bg-red-600 text-white' :
            type === 'warning' ? 'bg-yellow-600 text-white' :
            type === 'success' ? 'bg-green-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        
        alertDiv.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined">
                    ${type === 'danger' ? 'warning' : 
                      type === 'warning' ? 'error' :
                      type === 'success' ? 'check_circle' : 'info'}
                </span>
                <div class="flex-1">
                    <p class="font-medium">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the tsunami warning system
let tsunamiSystem;

document.addEventListener('DOMContentLoaded', () => {
    tsunamiSystem = new TsunamiWarningSystem();
    
    // Add some demo functionality
    console.log('Tsunami Warning System initialized');
    
    // Simulate periodic status updates
    setInterval(() => {
        const sensors = ['Sensor Seismik', 'Coastal Buoy (CBT)', 'Sistem Peringatan'];
        const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
        console.log(`${randomSensor} status: Normal`);
    }, 30000);
});