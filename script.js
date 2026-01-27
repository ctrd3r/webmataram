/**
 * Stasiun Geofisika Mataram - Modern JavaScript Architecture
 * Mengikuti prinsip Jamstack, RESTful API, dan Performance Optimization
 * 
 * Features:
 * - ES6+ Modern JavaScript
 * - RESTful API Integration
 * - Real-time Data Updates
 * - PWA Functionality
 * - Accessibility Support
 * - Error Handling & Logging
 * - Performance Monitoring
 */

class GeofisikaMataram {
    constructor() {
        this.config = {
            apiBaseUrl: 'https://api.geofisika-mataram.bmkg.go.id/v1',
            websocketUrl: 'wss://ws.geofisika-mataram.bmkg.go.id',
            updateIntervals: {
                earthquake: 30000,    // 30 seconds
                tsunami: 60000,       // 1 minute
                magnetic: 300000,     // 5 minutes
                ntp: 1000,           // 1 second
                status: 60000        // 1 minute
            },
            retryAttempts: 3,
            retryDelay: 1000
        };
        
        this.state = {
            isOnline: navigator.onLine,
            lastUpdate: null,
            services: {
                earthquake: { status: 'normal', lastCheck: null },
                tsunami: { status: 'safe', lastCheck: null },
                magnetic: { status: 'stable', lastCheck: null },
                ntp: { status: 'sync', lastCheck: null },
                engineering: { status: 'active', lastCheck: null }
            },
            notifications: [],
            websocket: null
        };
        
        this.cache = new Map();
        this.observers = new Map();
        
        this.init();
    }

    /**
     * Initialize aplikasi dengan error handling
     */
    async init() {
        try {
            console.log('🌍 Initializing Stasiun Geofisika Mataram...');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize real-time updates
            await this.initializeRealTimeUpdates();
            
            // Setup PWA features
            this.initializePWA();
            
            // Setup accessibility features
            this.initializeAccessibility();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup performance monitoring
            this.initializePerformanceMonitoring();
            
            // Initialize footer functionality
            this.initializeFooter();
            
            console.log('✅ Stasiun Geofisika Mataram initialized successfully');
            
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    /**
     * Setup event listeners dengan modern event handling
     */
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('hidden');
                this.animateMenuToggle(mobileMenu, !isExpanded);
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.openSearchModal();
            });
        }

        // Notification handling
        const notificationBtn = document.getElementById('notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // Smooth scrolling untuk navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.handleOnlineStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.handleOnlineStatusChange(false);
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change untuk pause/resume updates
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
    }

    /**
     * Initialize real-time updates dengan WebSocket dan fallback ke polling
     */
    async initializeRealTimeUpdates() {
        try {
            // Try WebSocket first
            await this.initializeWebSocket();
        } catch (error) {
            console.warn('WebSocket failed, falling back to polling:', error);
            this.initializePolling();
        }
    }

    /**
     * Initialize WebSocket connection untuk real-time data
     */
    async initializeWebSocket() {
        return new Promise((resolve, reject) => {
            try {
                this.state.websocket = new WebSocket(this.config.websocketUrl);
                
                this.state.websocket.onopen = () => {
                    console.log('🔌 WebSocket connected');
                    resolve();
                };
                
                this.state.websocket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleRealtimeData(data);
                    } catch (error) {
                        console.error('WebSocket message parsing error:', error);
                    }
                };
                
                this.state.websocket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };
                
                this.state.websocket.onclose = () => {
                    console.log('🔌 WebSocket disconnected, attempting reconnect...');
                    setTimeout(() => {
                        this.initializeWebSocket().catch(() => {
                            this.initializePolling();
                        });
                    }, 5000);
                };
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Initialize polling sebagai fallback
     */
    initializePolling() {
        console.log('📡 Starting polling mode');
        
        // Update timestamp setiap detik
        setInterval(() => {
            this.updateTimestamp();
        }, this.config.updateIntervals.ntp);

        // Update earthquake data
        setInterval(() => {
            this.fetchEarthquakeData();
        }, this.config.updateIntervals.earthquake);

        // Update tsunami status
        setInterval(() => {
            this.fetchTsunamiStatus();
        }, this.config.updateIntervals.tsunami);

        // Update magnetic data
        setInterval(() => {
            this.fetchMagneticData();
        }, this.config.updateIntervals.magnetic);

        // Update service status
        setInterval(() => {
            this.updateServiceStatus();
        }, this.config.updateIntervals.status);
        
        // Update footer timestamp setiap menit
        setInterval(() => {
            this.updateFooterTimestamp();
        }, 60000);
    }

    /**
     * Handle real-time data dari WebSocket
     */
    handleRealtimeData(data) {
        switch (data.type) {
            case 'earthquake':
                this.updateEarthquakeDisplay(data.payload);
                break;
            case 'tsunami':
                this.updateTsunamiStatus(data.payload);
                break;
            case 'magnetic':
                this.updateMagneticDisplay(data.payload);
                break;
            case 'service_status':
                this.updateServiceStatusDisplay(data.payload);
                break;
            case 'notification':
                this.showNotification(data.payload);
                break;
            default:
                console.log('Unknown data type:', data.type);
        }
    }

    /**
     * Fetch earthquake data dari API dengan error handling
     */
    async fetchEarthquakeData() {
        try {
            const response = await this.apiRequest('/earthquake/latest');
            if (response.success) {
                this.updateEarthquakeDisplay(response.data);
                this.state.services.earthquake.lastCheck = new Date();
            }
        } catch (error) {
            this.handleError('Failed to fetch earthquake data', error);
        }
    }

    /**
     * Fetch tsunami status dari API
     */
    async fetchTsunamiStatus() {
        try {
            const response = await this.apiRequest('/tsunami/status');
            if (response.success) {
                this.updateTsunamiStatus(response.data);
                this.state.services.tsunami.lastCheck = new Date();
            }
        } catch (error) {
            this.handleError('Failed to fetch tsunami status', error);
        }
    }

    /**
     * Fetch magnetic field data dari API
     */
    async fetchMagneticData() {
        try {
            const response = await this.apiRequest('/magnetic/current');
            if (response.success) {
                this.updateMagneticDisplay(response.data);
                this.state.services.magnetic.lastCheck = new Date();
            }
        } catch (error) {
            this.handleError('Failed to fetch magnetic data', error);
        }
    }

    /**
     * Generic API request dengan retry logic dan caching
     */
    async apiRequest(endpoint, options = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        
        // Return cached data if still valid (5 minutes)
        if (cached && Date.now() - cached.timestamp < 300000) {
            return cached.data;
        }

        const url = `${this.config.apiBaseUrl}${endpoint}`;
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'bmkg-geofisika-mataram',
                'User-Agent': 'SGM-Web/1.0'
            },
            ...options
        };

        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, defaultOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Cache successful response
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                
                return data;
                
            } catch (error) {
                console.warn(`API request attempt ${attempt} failed:`, error);
                
                if (attempt === this.config.retryAttempts) {
                    throw error;
                }
                
                // Wait before retry
                await this.delay(this.config.retryDelay * attempt);
            }
        }
    }

    /**
     * Update earthquake display dengan data terbaru
     */
    updateEarthquakeDisplay(data) {
        const magnitudeEl = document.querySelector('.earthquake-magnitude');
        const locationEl = document.querySelector('.earthquake-location');
        const timeEl = document.querySelector('.earthquake-time');
        const depthEl = document.querySelector('.earthquake-depth');
        const countEl = document.querySelector('.earthquake-count');

        if (magnitudeEl && data.magnitude) {
            magnitudeEl.textContent = data.magnitude;
            this.animateElement(magnitudeEl);
            
            // Update magnitude color based on scale
            const magnitudeClass = this.getMagnitudeClass(data.magnitude);
            magnitudeEl.className = `earthquake-magnitude ${magnitudeClass}`;
        }

        if (locationEl && data.location) {
            locationEl.textContent = data.location;
        }

        if (timeEl && data.time) {
            timeEl.textContent = this.formatTime(data.time) + ' WITA';
        }

        if (depthEl && data.depth) {
            depthEl.textContent = data.depth + ' km';
        }

        if (countEl && data.count) {
            countEl.textContent = data.count;
        }

        // Show notification untuk gempa signifikan
        if (data.magnitude && parseFloat(data.magnitude) >= 4.0) {
            this.showEarthquakeNotification(data);
        }

        // Update last update timestamp
        this.state.lastUpdate = new Date();
    }

    /**
     * Update tsunami status display
     */
    updateTsunamiStatus(data) {
        const statusElements = document.querySelectorAll('[data-service="tsunami"] .status-badge');
        
        statusElements.forEach(el => {
            el.textContent = data.status.toUpperCase();
            el.className = `status-badge status-${data.status.toLowerCase()}`;
        });

        this.state.services.tsunami.status = data.status;

        // Show alert jika ada peringatan tsunami
        if (data.status === 'warning' || data.status === 'watch') {
            this.showTsunamiAlert(data);
        }
    }

    /**
     * Update magnetic field display
     */
    updateMagneticDisplay(data) {
        const uptimeEl = document.querySelector('.magnetic-uptime');
        
        if (uptimeEl && data.uptime) {
            uptimeEl.textContent = data.uptime + '%';
        }

        // Update status
        const statusElements = document.querySelectorAll('[data-service="magnetic"] .status-badge');
        statusElements.forEach(el => {
            el.textContent = data.status.toUpperCase();
            el.className = `status-badge status-${data.status.toLowerCase()}`;
        });

        this.state.services.magnetic.status = data.status;
    }

    /**
     * Update service status display
     */
    updateServiceStatusDisplay(services) {
        Object.keys(services).forEach(serviceKey => {
            const service = services[serviceKey];
            const elements = document.querySelectorAll(`[data-service="${serviceKey}"] .status-badge`);
            
            elements.forEach(el => {
                el.textContent = service.status.toUpperCase();
                el.className = `status-badge status-${service.status.toLowerCase()}`;
            });
            
            this.state.services[serviceKey] = service;
        });
    }

    /**
     * Update timestamp dengan timezone WITA
     */
    updateTimestamp() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const timestamp = now.toLocaleString('id-ID', options);
        const timestampElements = document.querySelectorAll('.live-timestamp');
        
        timestampElements.forEach(el => {
            if (el.textContent !== 'AKTIF') {
                el.textContent = timestamp + ' WITA';
            }
        });
    }

    /**
     * Load initial data saat aplikasi start
     */
    async loadInitialData() {
        try {
            const promises = [
                this.fetchEarthquakeData(),
                this.fetchTsunamiStatus(),
                this.fetchMagneticData()
            ];
            
            await Promise.allSettled(promises);
            console.log('📊 Initial data loaded');
            
        } catch (error) {
            this.handleError('Failed to load initial data', error);
        }
    }

    /**
     * Initialize PWA features
     */
    initializePWA() {
        // Service Worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ SW registered:', registration);
                    
                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                        this.showUpdateAvailableNotification();
                    });
                })
                .catch(error => {
                    console.error('❌ SW registration failed:', error);
                });
        }

        // Install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt(deferredPrompt);
        });
    }

    /**
     * Initialize accessibility features
     */
    initializeAccessibility() {
        // Skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                }
            });
        });

        // ARIA live regions untuk dynamic content
        this.createLiveRegion();
        
        // Keyboard trap untuk modals
        this.setupKeyboardTraps();
    }

    /**
     * Create ARIA live region untuk announcements
     */
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    /**
     * Announce message ke screen readers
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        // Core Web Vitals monitoring
        if ('web-vitals' in window) {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(this.sendToAnalytics);
                getFID(this.sendToAnalytics);
                getFCP(this.sendToAnalytics);
                getLCP(this.sendToAnalytics);
                getTTFB(this.sendToAnalytics);
            });
        }

        // Performance observer
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        console.log('Navigation timing:', entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['navigation', 'resource'] });
        }
    }

    /**
     * Send performance metrics to analytics
     */
    sendToAnalytics(metric) {
        console.log('Performance metric:', metric);
        
        // Send to Google Analytics jika tersedia
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                event_category: 'Web Vitals',
                value: Math.round(metric.value),
                non_interaction: true,
            });
        }
    }

    /**
     * Show earthquake notification
     */
    showEarthquakeNotification(data) {
        const notification = {
            type: 'earthquake',
            title: `Gempa M ${data.magnitude}`,
            message: `${data.location} - Kedalaman ${data.depth} km`,
            timestamp: new Date(),
            priority: data.magnitude >= 5.0 ? 'high' : 'normal'
        };

        this.addNotification(notification);
        this.displayNotificationToast(notification);
        
        // Announce ke screen readers
        this.announceToScreenReader(`Gempa bumi magnitude ${data.magnitude} terdeteksi di ${data.location}`);
    }

    /**
     * Show tsunami alert
     */
    showTsunamiAlert(data) {
        const notification = {
            type: 'tsunami',
            title: 'Peringatan Tsunami',
            message: data.message || 'Status tsunami telah berubah',
            timestamp: new Date(),
            priority: 'high'
        };

        this.addNotification(notification);
        this.displayNotificationToast(notification);
        
        // Announce ke screen readers
        this.announceToScreenReader('Peringatan tsunami aktif');
    }

    /**
     * Add notification ke state
     */
    addNotification(notification) {
        this.state.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (this.state.notifications.length > 50) {
            this.state.notifications = this.state.notifications.slice(0, 50);
        }
        
        // Update notification badge
        this.updateNotificationBadge();
    }

    /**
     * Update notification badge count
     */
    updateNotificationBadge() {
        const badge = document.querySelector('#notification-btn .w-2');
        const unreadCount = this.state.notifications.filter(n => !n.read).length;
        
        if (badge) {
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    /**
     * Display notification toast
     */
    displayNotificationToast(notification) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 max-w-sm bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-50 transform translate-x-full transition-transform duration-300`;
        
        const priorityColor = notification.priority === 'high' ? 'red' : 'blue';
        
        toast.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-${priorityColor}-100 dark:bg-${priorityColor}-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-${priorityColor}-600 text-lg">${notification.type === 'earthquake' ? 'vibration' : 'tsunami'}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm">${notification.title}</h4>
                    <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">${notification.message}</p>
                    <p class="text-slate-500 text-xs mt-2">${this.formatTime(notification.timestamp)}</p>
                </div>
                <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 8000);
    }

    /**
     * Utility functions
     */
    
    getMagnitudeClass(magnitude) {
        const mag = parseFloat(magnitude);
        if (mag < 2) return 'magnitude-1';
        if (mag < 3) return 'magnitude-2';
        if (mag < 4) return 'magnitude-3';
        if (mag < 5) return 'magnitude-4';
        if (mag < 6) return 'magnitude-5';
        if (mag < 7) return 'magnitude-6';
        return 'magnitude-7';
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    animateElement(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease-in-out';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    smoothScrollTo(target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        
        // Announce ke screen readers
        this.announceToScreenReader(`Mode ${isDark ? 'gelap' : 'terang'} diaktifkan`);
    }

    /**
     * Error handling dengan logging
     */
    handleError(context, error) {
        console.error(`🚨 ${context}:`, error);
        
        // Send to error tracking service (Sentry, etc.)
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error, {
                tags: { context }
            });
        }
        
        // Silent error handling - no user notification
        // Errors are logged to console for debugging
    }

    showErrorNotification(context) {
        // Disabled error notifications to prevent popup spam
        // Errors are handled silently and logged to console
        console.log(`Silent error handling: ${context}`);
    }

    /**
     * Handle online/offline status changes
     */
    handleOnlineStatusChange(isOnline) {
        const statusMessage = isOnline ? 'Koneksi internet tersambung kembali' : 'Koneksi internet terputus';
        
        this.announceToScreenReader(statusMessage);
        
        if (isOnline) {
            // Resume updates dan sync data
            this.resumeUpdates();
            this.syncOfflineData();
        } else {
            // Show offline notification
            this.showOfflineNotification();
        }
    }

    showOfflineNotification() {
        const notification = {
            type: 'offline',
            title: 'Mode Offline',
            message: 'Beberapa fitur mungkin tidak tersedia tanpa koneksi internet.',
            timestamp: new Date(),
            priority: 'normal'
        };
        
        this.displayNotificationToast(notification);
    }

    /**
     * Pause/resume updates berdasarkan visibility
     */
    pauseUpdates() {
        console.log('⏸️ Pausing updates (tab hidden)');
        // Implementation untuk pause updates
    }

    resumeUpdates() {
        console.log('▶️ Resuming updates (tab visible)');
        // Implementation untuk resume updates
    }

    /**
     * Sync offline data ketika kembali online
     */
    async syncOfflineData() {
        try {
            console.log('🔄 Syncing offline data...');
            // Implementation untuk sync offline data
        } catch (error) {
            this.handleError('Offline data sync failed', error);
        }
    }

    /**
     * Initialize footer functionality
     */
    initializeFooter() {
        // Update footer timestamp
        this.updateFooterTimestamp();
        
        // Setup footer interactions
        this.setupFooterInteractions();
        
        // Setup emergency contact click tracking
        this.setupEmergencyContactTracking();
    }

    /**
     * Update footer timestamp
     */
    updateFooterTimestamp() {
        const footerTimestamps = document.querySelectorAll('footer .live-timestamp');
        const now = new Date();
        const options = {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const timestamp = now.toLocaleString('id-ID', options) + ' WITA';
        
        footerTimestamps.forEach(el => {
            if (!el.textContent.includes('AKTIF')) {
                el.textContent = timestamp;
            }
        });
    }

    /**
     * Setup footer interactions
     */
    setupFooterInteractions() {
        // Social media link tracking
        const socialLinks = document.querySelectorAll('footer a[aria-label*="BMKG"]');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.getAttribute('aria-label').split(' ')[0];
                this.trackSocialMediaClick(platform);
            });
        });

        // External link handling
        const externalLinks = document.querySelectorAll('footer a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackExternalLinkClick(link.href);
            });
        });

        // Footer section collapse on mobile
        if (window.innerWidth < 768) {
            this.setupMobileFooterCollapse();
        }
    }

    /**
     * Setup emergency contact tracking
     */
    setupEmergencyContactTracking() {
        const emergencyLinks = document.querySelectorAll('a[href^="tel:+62370999"]');
        emergencyLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEmergencyContactClick();
                this.announceToScreenReader('Menghubungi nomor darurat BMKG');
            });
        });
    }

    /**
     * Setup mobile footer collapse
     */
    setupMobileFooterCollapse() {
        const footerSections = document.querySelectorAll('footer h4');
        footerSections.forEach(heading => {
            const content = heading.nextElementSibling;
            if (content) {
                heading.style.cursor = 'pointer';
                heading.innerHTML += ' <span class="material-symbols-outlined text-sm ml-2">expand_more</span>';
                
                heading.addEventListener('click', () => {
                    const isExpanded = content.style.display !== 'none';
                    content.style.display = isExpanded ? 'none' : 'block';
                    const icon = heading.querySelector('.material-symbols-outlined');
                    icon.textContent = isExpanded ? 'expand_more' : 'expand_less';
                });
                
                // Initially collapse on mobile
                content.style.display = 'none';
            }
        });
    }

    /**
     * Track social media clicks
     */
    trackSocialMediaClick(platform) {
        console.log(`Social media click: ${platform}`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_media_click', {
                'platform': platform,
                'source': 'footer'
            });
        }
    }

    /**
     * Track external link clicks
     */
    trackExternalLinkClick(url) {
        console.log(`External link click: ${url}`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'external_link_click', {
                'url': url,
                'source': 'footer'
            });
        }
    }

    /**
     * Track emergency contact clicks
     */
    trackEmergencyContactClick() {
        console.log('Emergency contact clicked');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'emergency_contact_click', {
                'contact_type': 'phone',
                'source': 'footer'
            });
        }
        
        // Show confirmation dialog
        const confirmed = confirm('Anda akan menghubungi nomor darurat BMKG. Lanjutkan?');
        if (!confirmed) {
            event.preventDefault();
        }
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.state.websocket) {
            this.state.websocket.close();
        }
        
        // Clear intervals
        // Clear observers
        // Remove event listeners
        
        console.log('🧹 GeofisikaMataram cleaned up');
    }
}

// Initialize aplikasi ketika DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.geofisikaApp = new GeofisikaMataram();
    } catch (error) {
        console.error('Failed to initialize Geofisika Mataram app:', error);
        
        // Silent error handling - no popup notifications
        // Fallback untuk basic functionality
        document.getElementById('loading-screen')?.remove();
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Silent error handling - prevent popup notifications
    event.preventDefault();
});

// Export untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeofisikaMataram;
}