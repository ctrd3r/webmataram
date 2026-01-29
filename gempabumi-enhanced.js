/**
 * Enhanced Gempabumi Page - JavaScript Functionality
 * Mengintegrasikan dengan API BMKG resmi: https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml
 * Real-time data dari server BMKG dengan fallback ke sample data
 */

class GempaBumiEnhanced {
    constructor() {
        this.config = {
            // Gunakan endpoint gempadirasakan.xml untuk halaman gempabumi dirasakan
            bmkgApiUrl: 'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.xml',
            proxyUrl: 'https://api.allorigins.win/raw?url=', // CORS proxy untuk development
            itemsPerPage: 10,
            maxRetries: 3,
            updateInterval: 300000, // 5 minutes (sesuai update BMKG)
            retryDelay: 5000
        };
        
        this.state = {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            earthquakeData: [],
            filteredData: [],
            filters: {
                location: '',
                magnitude: '0',
                depth: 'all'
            },
            isLoading: false,
            lastUpdate: null,
            apiStatus: 'unknown', // unknown, online, offline
            retryCount: 0
        };
        
        this.init();
    }

    /**
     * Initialize halaman gempabumi enhanced
     */
    init() {
        console.log('🌍 Initializing Enhanced Gempabumi Page with BMKG API...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data dari BMKG API
        this.loadEarthquakeDataFromBMKG();
        
        // Setup auto-refresh
        this.setupAutoRefresh();
        
        console.log('✅ Enhanced Gempabumi Page initialized with BMKG integration');
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
            this.loadEarthquakeDataFromBMKG(true);
        });
        
        // Export button
        document.getElementById('export-data')?.addEventListener('click', () => {
            this.exportData();
        });
        
        // Filter change handlers
        ['location-search', 'magnitude-filter', 'depth-filter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const filterType = id.replace('-filter', '').replace('-search', '');
                    this.state.filters[filterType] = e.target.value;
                });
                
                // Real-time search untuk location
                if (id === 'location-search') {
                    element.addEventListener('input', (e) => {
                        this.state.filters.location = e.target.value;
                        // Debounce search
                        clearTimeout(this.searchTimeout);
                        this.searchTimeout = setTimeout(() => {
                            this.applyFilters();
                        }, 500);
                    });
                }
            }
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('darkMode', isDark);
            });
        }
    }

    /**
     * Load earthquake data dari API BMKG resmi
     */
    async loadEarthquakeDataFromBMKG(forceRefresh = false) {
        if (this.state.isLoading && !forceRefresh) {
            console.log('⏳ Already loading, skipping...');
            return;
        }
        
        this.state.isLoading = true;
        this.showLoadingState();
        
        try {
            console.log('📡 Fetching data from BMKG API...');
            console.log('🔗 Endpoint:', this.config.bmkgApiUrl);
            
            // Update status indicator
            this.updateApiStatus('connecting');
            
            // Fetch data dari BMKG API dengan retry logic
            const xmlData = await this.fetchBMKGData();
            
            if (xmlData) {
                console.log('✅ XML data received, parsing...');
                
                // Parse XML data
                const earthquakeData = this.parseXMLData(xmlData);
                
                if (earthquakeData && earthquakeData.length > 0) {
                    this.state.earthquakeData = earthquakeData;
                    this.state.lastUpdate = new Date();
                    this.state.apiStatus = 'online';
                    this.state.retryCount = 0;
                    
                    console.log(`✅ Successfully loaded ${earthquakeData.length} records from BMKG API`);
                    
                    // Apply current filters
                    this.applyFilters();
                    
                    // Update stats
                    this.updateQuickStats();
                    
                    // Update status indicator
                    this.updateApiStatus('online');
                    
                    // Show success notification
                    this.showSuccessNotification(earthquakeData.length);
                    
                } else {
                    throw new Error('No earthquake data found in API response');
                }
            } else {
                throw new Error('Failed to fetch data from BMKG API');
            }
            
        } catch (error) {
            console.error('❌ Failed to load data from BMKG API:', error);
            
            this.state.retryCount++;
            this.state.apiStatus = 'offline';
            
            // Update status indicator
            this.updateApiStatus('offline');
            
            // Fallback ke sample data jika API gagal
            if (this.state.retryCount >= this.config.maxRetries) {
                console.log('🔄 Max retries reached, using fallback sample data...');
                this.loadFallbackData();
            } else {
                // Retry setelah delay
                console.log(`⏳ Retry ${this.state.retryCount}/${this.config.maxRetries} in ${this.config.retryDelay}ms...`);
                setTimeout(() => {
                    this.loadEarthquakeDataFromBMKG(true);
                }, this.config.retryDelay);
            }
            
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Fetch data dari BMKG API dengan CORS handling
     * Menggunakan proxy sebagai metode utama karena CORS restrictions
     */
    async fetchBMKGData() {
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 API attempt ${attempt}/${maxRetries}`);
                
                let response;
                let method = 'proxy'; // Default ke proxy karena lebih reliable
                
                // Try dengan proxy terlebih dahulu (lebih reliable untuk CORS)
                try {
                    console.log('📡 Fetching via proxy...');
                    response = await fetch(this.config.proxyUrl + encodeURIComponent(this.config.bmkgApiUrl), {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/xml, text/xml, */*'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Proxy failed: HTTP ${response.status}`);
                    }
                    
                    console.log('✅ Proxy fetch successful');
                    
                } catch (proxyError) {
                    console.log('⚠️ Proxy failed, trying direct API...', proxyError.message);
                    method = 'direct';
                    
                    // Fallback ke direct API jika proxy gagal
                    response = await fetch(this.config.bmkgApiUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/xml, text/xml, */*',
                            'Cache-Control': 'no-cache'
                        },
                        mode: 'cors'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Direct API failed: HTTP ${response.status}`);
                    }
                    
                    console.log('✅ Direct API fetch successful');
                }
                
                const xmlText = await response.text();
                
                if (!xmlText || xmlText.trim().length === 0) {
                    throw new Error('Empty response from API');
                }
                
                // Validate XML structure
                if (!xmlText.includes('<Infogempa>') || !xmlText.includes('<gempa>')) {
                    throw new Error('Invalid XML structure');
                }
                
                console.log(`✅ Successfully fetched XML data from BMKG (via ${method})`);
                console.log(`📊 XML size: ${xmlText.length} bytes`);
                
                return xmlText;
                
            } catch (error) {
                console.warn(`❌ API attempt ${attempt} failed:`, error.message);
                
                if (attempt === maxRetries) {
                    console.error('❌ All retry attempts failed');
                    throw error;
                }
                
                // Wait before retry dengan exponential backoff
                const delay = this.config.retryDelay * attempt;
                console.log(`⏳ Waiting ${delay}ms before retry...`);
                await this.delay(delay);
            }
        }
    }

    /**
     * Parse XML data dari BMKG API
     * Format sesuai dengan struktur gempadirasakan.xml
     */
    parseXMLData(xmlText) {
        try {
            console.log('🔍 Parsing XML data...');
            console.log(`📄 XML length: ${xmlText.length} characters`);
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                console.error('❌ XML parsing error:', parserError.textContent);
                throw new Error('XML parsing error: ' + parserError.textContent);
            }
            
            const earthquakes = [];
            
            // Parse semua gempa elements (gempadirasakan.xml berisi 15 gempa dirasakan)
            const allGempaElements = xmlDoc.querySelectorAll('gempa');
            
            console.log(`📊 Found ${allGempaElements.length} gempa elements in XML`);
            
            if (allGempaElements.length === 0) {
                console.warn('⚠️ No earthquake data found in XML');
                console.log('XML Preview:', xmlText.substring(0, 500));
                return null;
            }
            
            allGempaElements.forEach((element, index) => {
                const earthquake = this.parseEarthquakeElement(element);
                if (earthquake) {
                    earthquakes.push(earthquake);
                    if (index === 0) {
                        console.log('✅ Sample parsed earthquake:', earthquake);
                    }
                }
            });
            
            console.log(`✅ Successfully parsed ${earthquakes.length} earthquake records from BMKG API`);
            return earthquakes;
            
        } catch (error) {
            console.error('❌ XML parsing error:', error);
            console.error('Error details:', error.message);
            return null;
        }
    }

    /**
     * Parse single earthquake element dari XML
     * Struktur sesuai dengan format BMKG: Tanggal, Jam, DateTime, Magnitude, Kedalaman, 
     * point->coordinates, Lintang, Bujur, Wilayah, Dirasakan
     */
    parseEarthquakeElement(element) {
        try {
            // Get coordinates dari point->coordinates (format: lon,lat)
            const pointElement = element.querySelector('point coordinates');
            let koordinat = '';
            
            if (pointElement) {
                const coords = pointElement.textContent.trim().split(',');
                if (coords.length === 2) {
                    const lon = parseFloat(coords[0]).toFixed(2);
                    const lat = parseFloat(coords[1]).toFixed(2);
                    koordinat = `${Math.abs(lat)} ${lat >= 0 ? 'LU' : 'LS'} - ${Math.abs(lon)} ${lon >= 0 ? 'BT' : 'BB'}`;
                }
            }
            
            // Fallback ke Lintang dan Bujur jika point tidak ada
            if (!koordinat) {
                const lintang = this.getElementText(element, 'Lintang');
                const bujur = this.getElementText(element, 'Bujur');
                koordinat = `${lintang} - ${bujur}`;
            }
            
            const earthquake = {
                id: Date.now() + Math.random(), // Generate unique ID
                waktu: this.getElementText(element, 'Tanggal') + ' ' + this.getElementText(element, 'Jam'),
                datetime: this.getElementText(element, 'DateTime'),
                magnitudo: this.getElementText(element, 'Magnitude'),
                kedalaman: this.getElementText(element, 'Kedalaman'),
                koordinat: koordinat,
                lintang: this.getElementText(element, 'Lintang'),
                bujur: this.getElementText(element, 'Bujur'),
                lokasi: this.getElementText(element, 'Wilayah'),
                dirasakan: this.getElementText(element, 'Dirasakan') || 'Belum ada laporan'
            };
            
            // Validate required fields
            if (!earthquake.waktu || !earthquake.magnitudo || !earthquake.lokasi) {
                console.warn('Incomplete earthquake data:', earthquake);
                return null;
            }
            
            // Format data
            earthquake.waktu = this.formatBMKGDateTime(earthquake.waktu);
            
            // Pastikan kedalaman memiliki satuan Km
            if (earthquake.kedalaman && !earthquake.kedalaman.includes('Km')) {
                earthquake.kedalaman = earthquake.kedalaman + ' Km';
            }
            
            // Format magnitudo
            earthquake.magnitudo = parseFloat(earthquake.magnitudo).toFixed(1);
            
            return earthquake;
            
        } catch (error) {
            console.error('Error parsing earthquake element:', error);
            return null;
        }
    }

    /**
     * Get text content dari XML element
     */
    getElementText(parent, tagName) {
        const element = parent.querySelector(tagName);
        return element ? element.textContent.trim() : '';
    }

    /**
     * Format datetime dari BMKG ke format yang konsisten
     */
    formatBMKGDateTime(bmkgDateTime) {
        try {
            // BMKG format biasanya: "15 Jan 2024" "12:34:56 WIB"
            const parts = bmkgDateTime.split(' ');
            if (parts.length >= 4) {
                const day = parts[0];
                const month = this.getMonthNumber(parts[1]);
                const year = parts[2];
                const time = parts[3];
                
                return `${year}-${month.toString().padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
            }
            return bmkgDateTime;
        } catch (error) {
            console.warn('Date formatting error:', error);
            return bmkgDateTime;
        }
    }

    /**
     * Convert month name ke number
     */
    getMonthNumber(monthName) {
        const months = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'Mei': 5, 'Jun': 6,
            'Jul': 7, 'Agu': 8, 'Sep': 9, 'Okt': 10, 'Nov': 11, 'Des': 12
        };
        return months[monthName] || 1;
    }

    /**
     * Generate additional entries untuk demo (karena API BMKG hanya return 1 gempa terbaru)
     * CATATAN: Fungsi ini tidak diperlukan lagi karena gempadirasakan.xml sudah berisi 15 data
     */
    generateAdditionalEntries(baseEarthquake) {
        // Tidak perlu generate data tambahan karena gempadirasakan.xml sudah berisi 15 gempa
        return [];
    }

    /**
     * Load fallback data jika API BMKG gagal
     */
    loadFallbackData() {
        console.log('📋 Loading fallback sample data...');
        
        // Sample data sebagai fallback
        this.state.earthquakeData = [
            {
                id: 1,
                waktu: '2024-01-27 13:45:23',
                magnitudo: '4.2',
                kedalaman: '15 Km',
                koordinat: '8.45 LS - 116.23 BT',
                lokasi: '25 km Timur Laut Mataram, NTB',
                dirasakan: 'II-III Mataram, II Lombok Barat'
            },
            {
                id: 2,
                waktu: '2024-01-27 10:23:15',
                magnitudo: '3.8',
                kedalaman: '8 Km',
                koordinat: '8.52 LS - 117.45 BT',
                lokasi: '12 km Selatan Sumbawa Besar, NTB',
                dirasakan: 'II Sumbawa Besar'
            },
            {
                id: 3,
                waktu: '2024-01-27 08:15:42',
                magnitudo: '5.1',
                kedalaman: '25 Km',
                koordinat: '8.78 LS - 115.98 BT',
                lokasi: '45 km Barat Daya Lombok Barat, NTB',
                dirasakan: 'III-IV Lombok Barat, III Mataram, II Lombok Tengah'
            }
        ];
        
        this.state.lastUpdate = new Date();
        this.applyFilters();
        this.updateQuickStats();
        
        // Show fallback notification
        this.showFallbackNotification();
    }

    /**
     * Update API status indicator
     */
    updateApiStatus(status) {
        const statusElement = document.querySelector('.bg-blue-50 .text-blue-900, .bg-blue-50 .text-blue-100');
        if (statusElement) {
            switch (status) {
                case 'connecting':
                    statusElement.innerHTML = `
                        <span class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Menghubungi API BMKG... • Sumber: data.bmkg.go.id
                        </span>
                    `;
                    break;
                case 'online':
                    statusElement.innerHTML = `
                        <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Data real-time dari API BMKG • Update: ${this.formatTime(this.state.lastUpdate)} WITA • Sumber: BMKG
                        </span>
                    `;
                    break;
                case 'offline':
                    statusElement.innerHTML = `
                        <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                            API BMKG tidak tersedia • Menggunakan data fallback
                        </span>
                    `;
                    break;
            }
        }
    }

    /**
     * Show fallback notification
     */
    showFallbackNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 max-w-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 z-50 shadow-lg';
        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-yellow-600 text-lg">warning</span>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-yellow-900 dark:text-yellow-100 text-sm">API BMKG Tidak Tersedia</h4>
                    <p class="text-yellow-800 dark:text-yellow-200 text-sm mt-1">Menggunakan data sample. Coba refresh untuk koneksi ulang ke API BMKG.</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-yellow-600 hover:text-yellow-800 p-1">
                    <span class="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Show success notification
     */
    showSuccessNotification(count) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 max-w-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 z-50 shadow-lg';
        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-green-900 dark:text-green-100 text-sm">Data Berhasil Dimuat</h4>
                    <p class="text-green-800 dark:text-green-200 text-sm mt-1">${count} gempa dirasakan dari API BMKG</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-green-600 hover:text-green-800 p-1">
                    <span class="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Apply filters ke data
     */
    applyFilters() {
        let filtered = [...this.state.earthquakeData];
        
        // Filter by location (search)
        if (this.state.filters.location) {
            const searchTerm = this.state.filters.location.toLowerCase();
            filtered = filtered.filter(eq => 
                eq.lokasi.toLowerCase().includes(searchTerm) ||
                eq.dirasakan.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by magnitude
        const minMagnitude = parseFloat(this.state.filters.magnitude);
        if (minMagnitude > 0) {
            filtered = filtered.filter(eq => parseFloat(eq.magnitudo) >= minMagnitude);
        }
        
        // Filter by depth
        if (this.state.filters.depth !== 'all') {
            filtered = filtered.filter(eq => {
                const depth = parseFloat(eq.kedalaman);
                switch (this.state.filters.depth) {
                    case 'shallow': return depth < 70;
                    case 'intermediate': return depth >= 70 && depth <= 300;
                    case 'deep': return depth > 300;
                    default: return true;
                }
            });
        }
        
        this.state.filteredData = filtered;
        this.state.totalRecords = filtered.length;
        this.state.totalPages = Math.ceil(filtered.length / this.config.itemsPerPage);
        this.state.currentPage = 1;
        
        this.renderTable();
        this.renderPagination();
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
        pageData.forEach((earthquake, index) => {
            const row = this.createTableRow(earthquake, startIndex + index + 1);
            tableBody.appendChild(row);
        });
        
        // Update pagination info
        this.updatePaginationInfo();
    }

    /**
     * Create table row untuk earthquake data
     */
    createTableRow(earthquake, rowNumber) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';
        
        const magnitudeClass = this.getMagnitudeClass(parseFloat(earthquake.magnitudo));
        const intensityClass = this.getIntensityClass(earthquake.dirasakan);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                ${rowNumber}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                <div>
                    <div class="font-medium">${this.formatDateTime(earthquake.waktu)}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">${this.getTimeAgo(earthquake.waktu)}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${magnitudeClass}">
                    M ${earthquake.magnitudo}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                ${earthquake.kedalaman}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                ${earthquake.koordinat}
            </td>
            <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">
                <div class="max-w-xs">
                    ${earthquake.lokasi}
                </div>
            </td>
            <td class="px-6 py-4 text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${intensityClass}">
                    ${earthquake.dirasakan}
                </span>
            </td>
        `;
        
        return row;
    }

    /**
     * Render pagination
     */
    renderPagination() {
        const container = document.getElementById('pagination-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = `px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 ${this.state.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
        prevBtn.textContent = 'Sebelumnya';
        prevBtn.disabled = this.state.currentPage <= 1;
        prevBtn.addEventListener('click', () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage--;
                this.renderTable();
                this.renderPagination();
            }
        });
        container.appendChild(prevBtn);
        
        // Page numbers
        const maxVisiblePages = 5;
        const startPage = Math.max(1, this.state.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(this.state.totalPages, startPage + maxVisiblePages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 ${i === this.state.currentPage ? 'bg-bmkg-blue text-white border-bmkg-blue' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.state.currentPage = i;
                this.renderTable();
                this.renderPagination();
            });
            container.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 ${this.state.currentPage >= this.state.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
        nextBtn.textContent = 'Selanjutnya';
        nextBtn.disabled = this.state.currentPage >= this.state.totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.state.currentPage < this.state.totalPages) {
                this.state.currentPage++;
                this.renderTable();
                this.renderPagination();
            }
        });
        container.appendChild(nextBtn);
    }

    /**
     * Update quick stats
     */
    updateQuickStats() {
        const magnitudes = this.state.earthquakeData.map(eq => parseFloat(eq.magnitudo));
        const depths = this.state.earthquakeData.map(eq => parseFloat(eq.kedalaman));
        
        const maxMagnitude = Math.max(...magnitudes);
        const avgDepth = depths.reduce((a, b) => a + b, 0) / depths.length;
        
        // Update DOM
        document.getElementById('total-count').textContent = this.state.earthquakeData.length;
        document.getElementById('max-magnitude').textContent = `M ${maxMagnitude.toFixed(1)}`;
        document.getElementById('avg-depth').textContent = `${avgDepth.toFixed(0)} km`;
        
        // Update monitoring status based on API status
        const statusElement = document.getElementById('monitoring-status');
        if (statusElement) {
            statusElement.textContent = this.state.apiStatus === 'online' ? 'AKTIF' : 'FALLBACK';
            statusElement.className = this.state.apiStatus === 'online' ? 'text-sm font-bold text-green-600' : 'text-sm font-bold text-yellow-600';
        }
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
    }

    /**
     * Export data functionality
     */
    exportData() {
        const csvContent = this.convertToCSV(this.state.filteredData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `gempabumi_bmkg_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Convert data to CSV
     */
    convertToCSV(data) {
        const headers = ['No', 'Waktu Gempa', 'Magnitudo', 'Kedalaman', 'Koordinat', 'Lokasi', 'Gempa Dirasakan'];
        const csvRows = [headers.join(',')];
        
        data.forEach((row, index) => {
            const values = [
                index + 1,
                `"${row.waktu}"`,
                row.magnitudo,
                `"${row.kedalaman}"`,
                `"${row.koordinat}"`,
                `"${row.lokasi}"`,
                `"${row.dirasakan}"`
            ];
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    /**
     * Setup auto-refresh dengan interval yang sesuai update BMKG
     */
    setupAutoRefresh() {
        setInterval(() => {
            if (!this.state.isLoading) {
                console.log('🔄 Auto-refreshing data from BMKG API...');
                this.loadEarthquakeDataFromBMKG();
            }
        }, this.config.updateInterval);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.remove('hidden');
            loadingState.innerHTML = `
                <div class="p-8 text-center">
                    <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-slate-600 dark:text-slate-400 font-medium">Mengambil data dari API BMKG...</p>
                    <p class="text-xs text-slate-500 dark:text-slate-500 mt-2">gempadirasakan.xml • 15 gempa dirasakan terbaru</p>
                    <p class="text-xs text-slate-400 dark:text-slate-600 mt-1">Menggunakan proxy untuk bypass CORS</p>
                </div>
            `;
        }
        const tableContainer = document.getElementById('earthquake-table');
        if (tableContainer) {
            tableContainer.classList.add('hidden');
        }
    }

    /**
     * Utility functions
     */
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    formatTime(date) {
        if (!date) return '--:--:--';
        return new Date(date).toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    getMagnitudeClass(magnitude) {
        if (magnitude < 3) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (magnitude < 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        if (magnitude < 5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        if (magnitude < 6) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        return 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300';
    }
    
    getIntensityClass(intensity) {
        if (intensity.includes('I ') || intensity.includes('II ')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (intensity.includes('III')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        if (intensity.includes('IV')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        if (intensity.includes('V') || intensity.includes('VI')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
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

// Initialize halaman gempabumi enhanced dengan BMKG API
let gempaBumiEnhanced;

document.addEventListener('DOMContentLoaded', () => {
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
    
    gempaBumiEnhanced = new GempaBumiEnhanced();
});

// Export untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GempaBumiEnhanced;
}