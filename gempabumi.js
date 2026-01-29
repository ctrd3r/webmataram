/**
 * Gempa Bumi Page - JavaScript Functionality
 * Halaman khusus untuk menampilkan data gempa bumi real-time
 * Mengikuti pola BMKG dengan fitur modern
 */

class GempaBumiPage {
    constructor() {
        this.config = {
            apiBaseUrl: 'https://api.geofisika-mataram.bmkg.go.id/v1',
            updateInterval: 30000, // 30 seconds
            itemsPerPage: 10,
            maxRetries: 3
        };
        
        this.state = {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            earthquakeData: [],
            filteredData: [],
            filters: {
                period: 'week',
                magnitude: '0',
                region: 'all'
            },
            isLoading: false,
            lastUpdate: null
        };
        
        this.init();
    }

    /**
     * Initialize halaman gempa bumi
     */
    init() {
        console.log('🌍 Initializing Gempa Bumi Page...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadEarthquakeData();
        
        // Setup auto-refresh
        this.setupAutoRefresh();
        
        // Update timestamp
        this.updateTimestamp();
        
        console.log('✅ Gempa Bumi Page initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Filter controls
        document.getElementById('apply-filter')?.addEventListener('click', () => {
            this.applyFilters();
        });
        
        // Refresh button
        document.getElementById('refresh-data')?.addEventListener('click', () => {
            this.loadEarthquakeData(true);
        });
        
        // Pagination
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage--;
                this.renderTable();
            }
        });
        
        document.getElementById('next-page')?.addEventListener('click', () => {
            if (this.state.currentPage < this.state.totalPages) {
                this.state.currentPage++;
                this.renderTable();
            }
        });
        
        // Filter change handlers
        ['period-filter', 'magnitude-filter', 'region-filter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                const filterType = id.replace('-filter', '');
                this.state.filters[filterType] = e.target.value;
            });
        });
    }

    /**
     * Load earthquake data dari API
     */
    async loadEarthquakeData(forceRefresh = false) {
        if (this.state.isLoading && !forceRefresh) return;
        
        this.state.isLoading = true;
        this.showLoadingState();
        
        try {
            console.log('📡 Loading earthquake data...');
            
            // Simulate API call dengan data dummy untuk demo
            const data = await this.fetchEarthquakeDataFromAPI();
            
            this.state.earthquakeData = data;
            this.state.lastUpdate = new Date();
            
            // Apply current filters
            this.applyFilters();
            
            // Update stats
            this.updateQuickStats();
            
            // Update timestamp
            this.updateTimestamp();
            
            console.log(`✅ Loaded ${data.length} earthquake records`);
            
        } catch (error) {
            console.error('❌ Failed to load earthquake data:', error);
            this.showErrorState();
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Fetch data dari API (simulasi dengan data dummy)
     */
    async fetchEarthquakeDataFromAPI() {
        // Simulasi delay API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Data dummy untuk demo - dalam implementasi nyata, ini akan dari API BMKG
        const dummyData = [
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
            },
            {
                id: 2,
                datetime: '2024-01-27 10:23:15',
                magnitude: 3.8,
                depth: 8,
                location: '12 km Selatan Sumbawa Besar',
                latitude: -8.5234,
                longitude: 117.4567,
                region: 'sumbawa',
                status: 'Tidak Dirasakan'
            },
            {
                id: 3,
                datetime: '2024-01-27 08:15:42',
                magnitude: 5.1,
                depth: 25,
                location: '45 km Barat Daya Lombok Barat',
                latitude: -8.7890,
                longitude: 115.9876,
                region: 'lombok',
                status: 'Dirasakan Kuat'
            },
            {
                id: 4,
                datetime: '2024-01-26 22:30:18',
                magnitude: 2.9,
                depth: 5,
                location: '8 km Utara Mataram',
                latitude: -8.4123,
                longitude: 116.1234,
                region: 'lombok',
                status: 'Tidak Dirasakan'
            },
            {
                id: 5,
                datetime: '2024-01-26 18:45:33',
                magnitude: 4.7,
                depth: 18,
                location: '32 km Timur Sumbawa',
                latitude: -8.4567,
                longitude: 117.8901,
                region: 'sumbawa',
                status: 'Dirasakan'
            },
            {
                id: 6,
                datetime: '2024-01-26 14:20:07',
                magnitude: 3.5,
                depth: 12,
                location: '15 km Selatan Lombok Tengah',
                latitude: -8.7234,
                longitude: 116.3456,
                region: 'lombok',
                status: 'Dirasakan Ringan'
            },
            {
                id: 7,
                datetime: '2024-01-26 09:12:55',
                magnitude: 6.2,
                depth: 35,
                location: '65 km Barat Laut Lombok',
                latitude: -8.2345,
                longitude: 115.7890,
                region: 'lombok',
                status: 'Dirasakan Sangat Kuat'
            },
            {
                id: 8,
                datetime: '2024-01-25 20:38:41',
                magnitude: 4.0,
                depth: 22,
                location: '28 km Tenggara Dompu',
                latitude: -8.6789,
                longitude: 118.1234,
                region: 'sumbawa',
                status: 'Dirasakan'
            }
        ];
        
        return dummyData;
    }

    /**
     * Apply filters ke data
     */
    applyFilters() {
        let filtered = [...this.state.earthquakeData];
        
        // Filter by period
        const now = new Date();
        switch (this.state.filters.period) {
            case 'today':
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                filtered = filtered.filter(eq => new Date(eq.datetime) >= today);
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(eq => new Date(eq.datetime) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(eq => new Date(eq.datetime) >= monthAgo);
                break;
        }
        
        // Filter by magnitude
        const minMagnitude = parseFloat(this.state.filters.magnitude);
        if (minMagnitude > 0) {
            filtered = filtered.filter(eq => eq.magnitude >= minMagnitude);
        }
        
        // Filter by region
        if (this.state.filters.region !== 'all') {
            filtered = filtered.filter(eq => eq.region === this.state.filters.region);
        }
        
        // Sort by datetime (newest first)
        filtered.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        
        this.state.filteredData = filtered;
        this.state.totalRecords = filtered.length;
        this.state.totalPages = Math.ceil(filtered.length / this.config.itemsPerPage);
        this.state.currentPage = 1;
        
        this.renderTable();
    }

    /**
     * Render tabel data gempa
     */
    renderTable() {
        const tableContainer = document.getElementById('earthquake-table');
        const loadingState = document.getElementById('loading-state');
        const tableBody = document.getElementById('earthquake-data');
        
        if (!tableContainer || !tableBody) return;
        
        // Hide loading, show table
        loadingState?.classList.add('hidden');
        tableContainer.classList.remove('hidden');
        
        // Calculate pagination
        const startIndex = (this.state.currentPage - 1) * this.config.itemsPerPage;
        const endIndex = Math.min(startIndex + this.config.itemsPerPage, this.state.totalRecords);
        const pageData = this.state.filteredData.slice(startIndex, endIndex);
        
        // Clear existing data
        tableBody.innerHTML = '';
        
        // Render rows
        pageData.forEach(earthquake => {
            const row = this.createTableRow(earthquake);
            tableBody.appendChild(row);
        });
        
        // Update pagination info
        this.updatePaginationInfo();
    }

    /**
     * Create table row untuk earthquake data
     */
    createTableRow(earthquake) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';
        
        const magnitudeClass = this.getMagnitudeClass(earthquake.magnitude);
        const statusClass = this.getStatusClass(earthquake.status);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                <div>
                    <div class="font-medium">${this.formatDateTime(earthquake.datetime)}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">${this.getTimeAgo(earthquake.datetime)}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${magnitudeClass}">
                    M ${earthquake.magnitude}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                ${earthquake.depth} km
            </td>
            <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">
                <div class="max-w-xs">
                    <div class="font-medium">${earthquake.location}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                        ${earthquake.latitude}°S, ${earthquake.longitude}°E
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                ${earthquake.latitude}°S<br>
                ${earthquake.longitude}°E
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                    ${earthquake.status}
                </span>
            </td>
        `;
        
        return row;
    }

    /**
     * Update quick stats
     */
    updateQuickStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Count earthquakes
        const todayCount = this.state.earthquakeData.filter(eq => 
            new Date(eq.datetime) >= today
        ).length;
        
        const weekCount = this.state.earthquakeData.filter(eq => 
            new Date(eq.datetime) >= weekAgo
        ).length;
        
        const maxMagnitude = Math.max(...this.state.earthquakeData.map(eq => eq.magnitude));
        
        // Update DOM
        document.getElementById('today-count').textContent = todayCount;
        document.getElementById('week-count').textContent = weekCount;
        document.getElementById('max-magnitude').textContent = `M ${maxMagnitude.toFixed(1)}`;
    }

    /**
     * Update pagination info
     */
    updatePaginationInfo() {
        const startIndex = (this.state.currentPage - 1) * this.config.itemsPerPage + 1;
        const endIndex = Math.min(this.state.currentPage * this.config.itemsPerPage, this.state.totalRecords);
        
        document.getElementById('showing-from').textContent = startIndex;
        document.getElementById('showing-to').textContent = endIndex;
        document.getElementById('total-records').textContent = this.state.totalRecords;
        
        // Update button states
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.disabled = this.state.currentPage <= 1;
            prevBtn.classList.toggle('opacity-50', this.state.currentPage <= 1);
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.state.currentPage >= this.state.totalPages;
            nextBtn.classList.toggle('opacity-50', this.state.currentPage >= this.state.totalPages);
        }
    }

    /**
     * Update timestamp
     */
    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        document.getElementById('last-update').textContent = `${timeString} WITA`;
    }

    /**
     * Setup auto-refresh
     */
    setupAutoRefresh() {
        setInterval(() => {
            if (!this.state.isLoading) {
                this.loadEarthquakeData();
            }
        }, this.config.updateInterval);
        
        // Update timestamp every second
        setInterval(() => {
            this.updateTimestamp();
        }, 1000);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        document.getElementById('loading-state')?.classList.remove('hidden');
        document.getElementById('earthquake-table')?.classList.add('hidden');
    }

    /**
     * Show error state
     */
    showErrorState() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.innerHTML = `
                <div class="p-8 text-center">
                    <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-red-600 text-2xl">error</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400 mb-4">Gagal memuat data gempa bumi</p>
                    <button onclick="gempaBumiPage.loadEarthquakeData(true)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Coba Lagi
                    </button>
                </div>
            `;
        }
    }

    /**
     * Utility functions
     */
    
    getMagnitudeClass(magnitude) {
        if (magnitude < 3) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (magnitude < 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        if (magnitude < 5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        if (magnitude < 6) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        return 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300';
    }
    
    getStatusClass(status) {
        if (status.includes('Tidak')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        if (status.includes('Ringan')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        if (status.includes('Kuat')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        if (status.includes('Sangat')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
    
    formatDateTime(datetime) {
        const date = new Date(datetime);
        return date.toLocaleString('id-ID', {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + ' WITA';
    }
    
    getTimeAgo(datetime) {
        const now = new Date();
        const past = new Date(datetime);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        return `${diffDays} hari lalu`;
    }
}

// Initialize halaman gempa bumi
let gempaBumiPage;

document.addEventListener('DOMContentLoaded', () => {
    gempaBumiPage = new GempaBumiPage();
});

// Export untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GempaBumiPage;
}