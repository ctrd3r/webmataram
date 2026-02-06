// Admin Panel JavaScript - BMKG News CMS - FIXED VERSION
console.log('Loading admin-fixed.js...');

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = null;
        this.isInitialized = false;
        console.log('AdminPanel constructor called');
        this.init();
    }

    async init() {
        console.log('Initializing Admin Panel...');
        
        try {
            // Simple initialization without complex auth checks
            this.setupEventListeners();
            
            // Load dashboard immediately
            await this.loadDashboardStats();
            
            // Show dashboard section
            this.showSection('dashboard');
            
            this.isInitialized = true;
            console.log('Admin Panel initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize admin panel:', error);
            this.showErrorMessage('Gagal menginisialisasi panel admin: ' + error.message);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = e.currentTarget.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const section = href.substring(1);
                    console.log('Navigation clicked:', section);
                    this.showSection(section);
                }
            });
        });
        
        // Setup filters and search when DOM is ready
        setTimeout(() => {
            this.setupFiltersAndSearch();
        }, 100);
        
        console.log('Event listeners set up');
    }

    setupFiltersAndSearch() {
        // News search and filter
        const newsSearch = document.getElementById('newsSearch');
        const newsStatusFilter = document.getElementById('newsStatusFilter');
        
        if (newsSearch) {
            newsSearch.addEventListener('input', debounce(() => {
                if (this.currentSection === 'news') {
                    this.loadNewsTable();
                }
            }, 500));
        }
        
        if (newsStatusFilter) {
            newsStatusFilter.addEventListener('change', () => {
                if (this.currentSection === 'news') {
                    this.loadNewsTable();
                }
            });
        }
        
        // Featured news search and filter
        const featuredNewsSearch = document.getElementById('featuredNewsSearch');
        const featuredCategoryFilter = document.getElementById('featuredCategoryFilter');
        
        if (featuredNewsSearch) {
            featuredNewsSearch.addEventListener('input', debounce(() => {
                if (this.currentSection === 'featured') {
                    this.loadFeaturedNewsList();
                }
            }, 500));
        }
        
        if (featuredCategoryFilter) {
            featuredCategoryFilter.addEventListener('change', () => {
                if (this.currentSection === 'featured') {
                    this.loadFeaturedNewsList();
                }
            });
        }
        
        // Comments filter
        const commentsStatusFilter = document.getElementById('commentsStatusFilter');
        if (commentsStatusFilter) {
            commentsStatusFilter.addEventListener('change', () => {
                if (this.currentSection === 'comments') {
                    this.loadCommentsTable();
                }
            });
        }
    }

    showSection(sectionName) {
        console.log('Showing section:', sectionName);
        
        try {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });

            // Show selected section
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                this.currentSection = sectionName;

                // Update navigation
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('bg-blue-100', 'text-blue-600');
                    link.classList.add('text-gray-700');
                });

                const activeLink = document.querySelector(`[href="#${sectionName}"]`);
                if (activeLink) {
                    activeLink.classList.add('bg-blue-100', 'text-blue-600');
                    activeLink.classList.remove('text-gray-700');
                }

                // Load section data
                this.loadSectionData(sectionName);
                
                console.log('Section shown successfully:', sectionName);
            } else {
                console.error('Section not found:', sectionName);
            }
        } catch (error) {
            console.error('Error showing section:', error);
        }
    }

    async loadSectionData(section) {
        console.log('Loading data for section:', section);
        
        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboardStats();
                    await this.loadRecentNews();
                    break;
                case 'authors':
                    await this.loadAuthorsTable();
                    break;
                case 'featured':
                    await this.loadFeaturedSection();
                    break;
                case 'news':
                    await this.loadNewsTable();
                    break;
                case 'categories':
                    await this.loadCategoriesTable();
                    break;
                case 'comments':
                    await this.loadCommentsTable();
                    break;
                default:
                    console.log('Unknown section:', section);
            }
        } catch (error) {
            console.error('Error loading section data:', error);
        }
    }

    // Dashboard Functions
    async loadDashboardStats() {
        console.log('Loading dashboard stats...');
        
        try {
            const stats = await this.fetchDashboardStats();
            
            // Update stats cards with null checking
            this.updateStatElement('totalNews', stats.totalNews || 0);
            this.updateStatElement('totalViews', (stats.totalViews || 0).toLocaleString());
            this.updateStatElement('totalCategories', stats.totalCategories || 0);
            this.updateStatElement('totalComments', stats.totalComments || 0);
            
            console.log('Dashboard stats updated:', stats);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            
            // Show error state
            this.updateStatElement('totalNews', 'Error');
            this.updateStatElement('totalViews', 'Error');
            this.updateStatElement('totalCategories', 'Error');
            this.updateStatElement('totalComments', 'Error');
        }
    }

    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        } else {
            console.warn('Element not found:', elementId);
        }
    }

    async fetchDashboardStats() {
        try {
            console.log('Fetching dashboard stats...');
            
            // Get news stats
            const newsResponse = await fetch('../api/manage_news.php?action=stats');
            console.log('News stats response status:', newsResponse.status);
            
            if (!newsResponse.ok) {
                throw new Error(`News API returned ${newsResponse.status}: ${newsResponse.statusText}`);
            }
            
            const newsResult = await newsResponse.json();
            console.log('News stats result:', newsResult);
            
            // Get categories count
            const categoriesResponse = await fetch('../api/get_categories.php');
            console.log('Categories response status:', categoriesResponse.status);
            
            if (!categoriesResponse.ok) {
                throw new Error(`Categories API returned ${categoriesResponse.status}: ${categoriesResponse.statusText}`);
            }
            
            const categoriesResult = await categoriesResponse.json();
            console.log('Categories result:', categoriesResult);
            
            const stats = {
                totalNews: newsResult.success ? (newsResult.data?.total_news || 0) : 0,
                totalViews: newsResult.success ? (newsResult.data?.total_views || 0) : 0,
                publishedNews: newsResult.success ? (newsResult.data?.published_news || 0) : 0,
                draftNews: newsResult.success ? (newsResult.data?.draft_news || 0) : 0,
                totalCategories: categoriesResult.success ? (categoriesResult.data?.length || 0) : 0,
                totalComments: 0 // Will be implemented later
            };
            
            console.log('Final stats:', stats);
            return stats;
            
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    async loadRecentNews() {
        console.log('Loading recent news...');
        
        try {
            const recentNews = await this.fetchRecentNews();
            const container = document.getElementById('recentNews');
            
            if (!container) {
                console.warn('Recent news container not found');
                return;
            }
            
            if (recentNews && recentNews.length > 0) {
                container.innerHTML = recentNews.map(news => `
                    <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img src="../${news.gambar_url || 'images/placeholder-news.jpg'}" alt="${news.judul}" 
                             class="w-16 h-16 object-cover rounded-lg"
                             onerror="this.src='../images/placeholder-news.jpg'">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 mb-1">${news.judul}</h4>
                            <p class="text-sm text-gray-600 mb-2">${news.kategori} • ${news.tanggal_publish_formatted}</p>
                            <div class="flex items-center space-x-4">
                                <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                    ${news.status ? news.status.toUpperCase() : 'PUBLISH'}
                                </span>
                                <span class="text-xs text-gray-500">${news.views} views</span>
                                ${news.featured ? '<span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">UTAMA</span>' : ''}
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-newspaper text-4xl mb-4 opacity-50"></i>
                        <p>Belum ada berita terbaru</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading recent news:', error);
            const container = document.getElementById('recentNews');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-8 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>Error loading recent news: ${error.message}</p>
                    </div>
                `;
            }
        }
    }

    async fetchRecentNews() {
        try {
            const response = await fetch('../api/get_news.php?limit=5&sort=newest');
            const result = await response.json();
            
            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching recent news:', error);
            return [];
        }
    }

    // Authors Management
    async loadAuthorsTable() {
        console.log('Loading authors table...');
        
        try {
            const response = await fetch('../api/get_authors.php');
            const result = await response.json();
            
            const container = document.getElementById('authorsTable');
            if (!container) {
                console.warn('Authors table container not found');
                return;
            }
            
            if (result.success && result.data && result.data.length > 0) {
                container.innerHTML = `
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Berita</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${result.data.map(author => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                                        ${author.nama_lengkap.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">${author.nama_lengkap}</div>
                                                    <div class="text-sm text-gray-500">${author.email || 'Tidak ada email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${author.username}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${author.total_berita || 0}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="editAuthor(${author.id_penulis})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                <i class="fas fa-edit mr-1"></i>Edit
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-users text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Penulis</h3>
                        <p class="text-gray-600 mb-4">Data penulis akan muncul di sini.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading authors:', error);
            const container = document.getElementById('authorsTable');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>Error loading authors: ${error.message}</p>
                    </div>
                `;
            }
        }
    }

    // Featured News Management
    async loadFeaturedSection() {
        console.log('Loading featured section...');
        
        try {
            await this.loadCurrentFeaturedNews();
            await this.loadFeaturedNewsList();
            
            // Load categories for filter
            const response = await fetch('../api/get_categories.php');
            const result = await response.json();
            if (result.success && result.data) {
                const select = document.getElementById('featuredCategoryFilter');
                if (select) {
                    const options = result.data.map(cat => 
                        `<option value="${cat.slug_kategori}">${cat.nama_kategori}</option>`
                    ).join('');
                    select.innerHTML = '<option value="">Semua Kategori</option>' + options;
                }
            }
        } catch (error) {
            console.error('Error loading featured section:', error);
        }
    }

    async loadCurrentFeaturedNews() {
        try {
            const response = await fetch('../api/get_news.php?featured=true&limit=1');
            const result = await response.json();
            
            const container = document.getElementById('currentFeaturedNews');
            if (!container) return;
            
            if (result.success && result.data && result.data.length > 0) {
                const news = result.data[0];
                container.innerHTML = `
                    <div class="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div class="flex items-start space-x-4">
                            <img src="../${news.gambar_url}" alt="${news.judul}" 
                                 class="w-24 h-24 object-cover rounded-lg"
                                 onerror="this.src='../images/placeholder-news.jpg'">
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                        BERITA UTAMA
                                    </span>
                                    <button onclick="removeFeaturedNews(${news.id_berita})" 
                                            class="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600">
                                        <i class="fas fa-times mr-1"></i>Hapus Status Utama
                                    </button>
                                </div>
                                <h3 class="font-semibold text-gray-800 mb-2">${news.judul}</h3>
                                <div class="text-sm text-gray-600 mb-2">
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">${news.kategori}</span>
                                    <span>${news.tanggal_publish_formatted}</span>
                                    <span class="mx-2">•</span>
                                    <span>${news.views} views</span>
                                </div>
                                <p class="text-gray-700 text-sm">${news.ringkasan || 'Tidak ada ringkasan'}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="border border-gray-200 bg-gray-50 rounded-lg p-8 text-center">
                        <i class="fas fa-info-circle text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-700 mb-2">Belum Ada Berita Utama</h3>
                        <p class="text-gray-600">Pilih salah satu berita di bawah untuk dijadikan berita utama.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading current featured news:', error);
        }
    }

    async loadFeaturedNewsList() {
        try {
            const searchTerm = document.getElementById('featuredNewsSearch')?.value || '';
            const category = document.getElementById('featuredCategoryFilter')?.value || '';
            
            let url = '../api/get_news.php?limit=20';
            if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
            if (category) url += `&category=${encodeURIComponent(category)}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            const container = document.getElementById('featuredNewsTable');
            if (!container) return;
            
            if (result.success && result.data && result.data.length > 0) {
                container.innerHTML = `
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Berita</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${result.data.map(news => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <img src="../${news.gambar_url}" alt="${news.judul}" 
                                                 class="w-12 h-12 object-cover rounded-lg mr-4"
                                                 onerror="this.src='../images/placeholder-news.jpg'">
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">${news.judul}</div>
                                                <div class="text-sm text-gray-500">Oleh: ${news.penulis}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            ${news.kategori}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${news.views}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${news.featured ? 
                                            '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">UTAMA</span>' : 
                                            '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">BIASA</span>'
                                        }
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        ${news.featured ? 
                                            `<button onclick="removeFeaturedNews(${news.id_berita})" 
                                                    class="text-gray-600 hover:text-gray-900 mr-3">
                                                <i class="fas fa-times mr-1"></i>Hapus Utama
                                            </button>` :
                                            `<button onclick="setFeaturedNews(${news.id_berita})" 
                                                    class="text-yellow-600 hover:text-yellow-900 mr-3">
                                                <i class="fas fa-star mr-1"></i>Jadikan Utama
                                            </button>`
                                        }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Tidak ada berita ditemukan</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading featured news list:', error);
        }
    }

    // News Management
    async loadNewsTable() {
        console.log('Loading news table...');
        
        try {
            const searchTerm = document.getElementById('newsSearch')?.value || '';
            const statusFilter = document.getElementById('newsStatusFilter')?.value || '';
            
            let url = '../api/get_news.php?limit=50';
            if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
            if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            const container = document.getElementById('newsTable');
            if (!container) return;
            
            if (result.success && result.data && result.data.length > 0) {
                container.innerHTML = `
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Berita</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${result.data.map(news => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <img src="../${news.gambar_url}" alt="${news.judul}" 
                                                     class="w-12 h-12 object-cover rounded-lg mr-4"
                                                     onerror="this.src='../images/placeholder-news.jpg'">
                                                <div class="max-w-xs">
                                                    <div class="text-sm font-medium text-gray-900 truncate">${news.judul}</div>
                                                    <div class="text-sm text-gray-500">Oleh: ${news.penulis}</div>
                                                    ${news.featured ? '<span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">UTAMA</span>' : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                ${news.kategori}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 py-1 text-xs font-medium ${this.getStatusBadgeClass(news.status || 'publish')} rounded-full">
                                                ${(news.status || 'publish').toUpperCase()}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${news.views}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${news.tanggal_publish_formatted}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="editNews(${news.id_berita})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                <i class="fas fa-edit mr-1"></i>Edit
                                            </button>
                                            <button onclick="deleteNews(${news.id_berita})" class="text-red-600 hover:text-red-900">
                                                <i class="fas fa-trash mr-1"></i>Hapus
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination if needed -->
                    ${result.pagination && result.pagination.total_pages > 1 ? `
                        <div class="mt-4 flex items-center justify-between">
                            <div class="text-sm text-gray-700">
                                Menampilkan ${result.pagination.offset + 1} - ${Math.min(result.pagination.offset + result.pagination.items_per_page, result.pagination.total_items)} dari ${result.pagination.total_items} berita
                            </div>
                            <div class="flex space-x-2">
                                ${result.pagination.has_prev ? `<button onclick="loadNewsPage(${result.pagination.current_page - 1})" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Sebelumnya</button>` : ''}
                                <span class="px-3 py-1 bg-gray-200 rounded">Halaman ${result.pagination.current_page} dari ${result.pagination.total_pages}</span>
                                ${result.pagination.has_next ? `<button onclick="loadNewsPage(${result.pagination.current_page + 1})" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Selanjutnya</button>` : ''}
                            </div>
                        </div>
                    ` : ''}
                `;
            } else {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-newspaper text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Berita</h3>
                        <p class="text-gray-600 mb-4">Mulai dengan menambahkan berita pertama.</p>
                        <button onclick="showAddNewsForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <i class="fas fa-plus mr-2"></i>Tambah Berita
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading news table:', error);
            const container = document.getElementById('newsTable');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>Error loading news: ${error.message}</p>
                        <button onclick="this.loadNewsTable()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Coba Lagi
                        </button>
                    </div>
                `;
            }
        }
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'publish':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Categories Management
    async loadCategoriesTable() {
        console.log('Loading categories table...');
        
        try {
            const response = await fetch('../api/get_categories.php');
            const result = await response.json();
            
            const container = document.getElementById('categoriesTable');
            if (!container) return;
            
            if (result.success && result.data && result.data.length > 0) {
                container.innerHTML = `
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Berita</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${result.data.map(category => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                                                        ${category.nama_kategori.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">${category.nama_kategori}</div>
                                                    <div class="text-sm text-gray-500">${category.deskripsi || 'Tidak ada deskripsi'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                                ${category.slug_kategori}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                ${category.jumlah_berita || 0} berita
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="editCategory(${category.id_kategori})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                <i class="fas fa-edit mr-1"></i>Edit
                                            </button>
                                            <button onclick="deleteCategory(${category.id_kategori})" class="text-red-600 hover:text-red-900">
                                                <i class="fas fa-trash mr-1"></i>Hapus
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-tags text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Kategori</h3>
                        <p class="text-gray-600 mb-4">Mulai dengan menambahkan kategori pertama.</p>
                        <button onclick="showAddCategoryForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <i class="fas fa-plus mr-2"></i>Tambah Kategori
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            const container = document.getElementById('categoriesTable');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>Error loading categories: ${error.message}</p>
                        <button onclick="this.loadCategoriesTable()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Coba Lagi
                        </button>
                    </div>
                `;
            }
        }
    }

    // Comments Management
    async loadCommentsTable() {
        console.log('Loading comments table...');
        
        try {
            const statusFilter = document.getElementById('commentsStatusFilter')?.value || '';
            
            let url = '../api/get_comments.php?limit=20';
            if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            const container = document.getElementById('commentsTable');
            if (!container) return;
            
            if (result.success && result.data && result.data.length > 0) {
                container.innerHTML = `
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengunjung</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komentar</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Berita</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${result.data.map(comment => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <div class="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                                                        ${comment.nama_pengunjung.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">${comment.nama_pengunjung}</div>
                                                    <div class="text-sm text-gray-500">${comment.email || 'Tidak ada email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="text-sm text-gray-900 max-w-xs">
                                                <p class="truncate" title="${comment.isi_komentar}">
                                                    ${comment.isi_komentar_short}
                                                </p>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900 max-w-xs">
                                                <a href="../detail-berita.html?slug=${comment.slug_berita}" 
                                                   class="text-blue-600 hover:text-blue-800 truncate block" 
                                                   title="${comment.judul_berita}">
                                                    ${comment.judul_berita}
                                                </a>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 py-1 text-xs font-medium ${comment.status_badge.class} rounded-full">
                                                ${comment.status_badge.text}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${comment.tanggal_komentar_formatted}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            ${comment.status === 'pending' ? `
                                                <button onclick="approveComment(${comment.id_komentar})" class="text-green-600 hover:text-green-900 mr-2">
                                                    <i class="fas fa-check mr-1"></i>Setujui
                                                </button>
                                                <button onclick="rejectComment(${comment.id_komentar})" class="text-red-600 hover:text-red-900 mr-2">
                                                    <i class="fas fa-times mr-1"></i>Tolak
                                                </button>
                                            ` : ''}
                                            <button onclick="viewComment(${comment.id_komentar})" class="text-blue-600 hover:text-blue-900 mr-2">
                                                <i class="fas fa-eye mr-1"></i>Lihat
                                            </button>
                                            <button onclick="deleteComment(${comment.id_komentar})" class="text-red-600 hover:text-red-900">
                                                <i class="fas fa-trash mr-1"></i>Hapus
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination if needed -->
                    ${result.pagination && result.pagination.total_pages > 1 ? `
                        <div class="mt-4 flex items-center justify-between">
                            <div class="text-sm text-gray-700">
                                Menampilkan ${result.pagination.offset + 1} - ${Math.min(result.pagination.offset + result.pagination.items_per_page, result.pagination.total_items)} dari ${result.pagination.total_items} komentar
                            </div>
                            <div class="flex space-x-2">
                                ${result.pagination.has_prev ? `<button onclick="loadCommentsPage(${result.pagination.current_page - 1})" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Sebelumnya</button>` : ''}
                                <span class="px-3 py-1 bg-gray-200 rounded">Halaman ${result.pagination.current_page} dari ${result.pagination.total_pages}</span>
                                ${result.pagination.has_next ? `<button onclick="loadCommentsPage(${result.pagination.current_page + 1})" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Selanjutnya</button>` : ''}
                            </div>
                        </div>
                    ` : ''}
                `;
            } else {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-comments text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Komentar</h3>
                        <p class="text-gray-600 mb-4">Komentar dari pengunjung akan muncul di sini.</p>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                            <h4 class="font-semibold text-blue-800 mb-2">Fitur Komentar:</h4>
                            <ul class="text-sm text-blue-700 text-left space-y-1">
                                <li>• Moderasi komentar pengunjung</li>
                                <li>• Setujui atau tolak komentar</li>
                                <li>• Filter berdasarkan status</li>
                                <li>• Hapus komentar spam</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            const container = document.getElementById('commentsTable');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>Error loading comments: ${error.message}</p>
                        <button onclick="this.loadCommentsTable()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Coba Lagi
                        </button>
                    </div>
                `;
            }
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Featured News Management Functions
async function setFeaturedNews(newsId) {
    if (!confirm('Jadikan berita ini sebagai berita utama? Berita utama sebelumnya akan diganti.')) {
        return;
    }

    try {
        const response = await fetch('../api/manage_news.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'set_featured',
                id_berita: newsId
            })
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Berita berhasil dijadikan berita utama!', 'success');
            if (window.adminPanel) {
                await window.adminPanel.loadFeaturedSection();
            }
        } else {
            showNotification('Gagal mengatur berita utama: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error setting featured news:', error);
        showNotification('Terjadi kesalahan saat mengatur berita utama', 'error');
    }
}

async function removeFeaturedNews(newsId) {
    if (!confirm('Hapus status berita utama dari berita ini?')) {
        return;
    }

    try {
        const response = await fetch('../api/manage_news.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'remove_featured',
                id_berita: newsId
            })
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Status berita utama berhasil dihapus!', 'success');
            if (window.adminPanel) {
                await window.adminPanel.loadFeaturedSection();
            }
        } else {
            showNotification('Gagal menghapus status berita utama: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error removing featured news:', error);
        showNotification('Terjadi kesalahan saat menghapus status berita utama', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Placeholder functions
function editNews(newsId) {
    showNotification(`Edit berita ID ${newsId} akan segera tersedia`, 'info');
}

function deleteNews(newsId) {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        showNotification(`Hapus berita ID ${newsId} akan segera tersedia`, 'info');
    }
}

function editAuthor(authorId) {
    showNotification(`Edit penulis ID ${authorId} akan segera tersedia`, 'info');
}

function editCategory(categoryId) {
    showNotification(`Edit kategori ID ${categoryId} akan segera tersedia`, 'info');
}

function deleteCategory(categoryId) {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        showNotification(`Hapus kategori ID ${categoryId} akan segera tersedia`, 'info');
    }
}

function approveComment(commentId) {
    if (confirm('Setujui komentar ini?')) {
        showNotification(`Setujui komentar ID ${commentId} akan segera tersedia`, 'info');
    }
}

function rejectComment(commentId) {
    if (confirm('Tolak komentar ini?')) {
        showNotification(`Tolak komentar ID ${commentId} akan segera tersedia`, 'info');
    }
}

function viewComment(commentId) {
    showNotification(`Lihat detail komentar ID ${commentId} akan segera tersedia`, 'info');
}

function deleteComment(commentId) {
    if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
        showNotification(`Hapus komentar ID ${commentId} akan segera tersedia`, 'info');
    }
}

function loadNewsPage(page) {
    if (window.adminPanel) {
        // Add page parameter to news loading
        showNotification(`Load halaman ${page} akan segera tersedia`, 'info');
    }
}

function loadCommentsPage(page) {
    if (window.adminPanel) {
        // Add page parameter to comments loading
        showNotification(`Load halaman komentar ${page} akan segera tersedia`, 'info');
    }
}

function showAddNewsForm() {
    showNotification('Fitur tambah berita akan segera tersedia', 'info');
}

function showAddCategoryForm() {
    showNotification('Fitur tambah kategori akan segera tersedia', 'info');
}

function showAddAuthorForm() {
    showNotification('Fitur tambah penulis akan segera tersedia', 'info');
}

function loadFeaturedNewsList() {
    if (window.adminPanel) {
        window.adminPanel.loadFeaturedNewsList();
    }
}

// Global showSection function
function showSection(sectionName) {
    console.log('Global showSection called:', sectionName);
    if (window.adminPanel) {
        window.adminPanel.showSection(sectionName);
    } else {
        console.error('AdminPanel not initialized');
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        if (window.authMiddleware) {
            window.authMiddleware.logout();
        } else {
            window.location.href = 'login.html';
        }
    }
}

// Utility function for debouncing
function debounce(func, wait) {
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

// Global functions for window
window.showSection = showSection;
window.setFeaturedNews = setFeaturedNews;
window.removeFeaturedNews = removeFeaturedNews;
window.loadFeaturedNewsList = loadFeaturedNewsList;
window.editNews = editNews;
window.deleteNews = deleteNews;
window.editAuthor = editAuthor;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.approveComment = approveComment;
window.rejectComment = rejectComment;
window.viewComment = viewComment;
window.deleteComment = deleteComment;
window.loadNewsPage = loadNewsPage;
window.loadCommentsPage = loadCommentsPage;
window.showAddNewsForm = showAddNewsForm;
window.showAddCategoryForm = showAddCategoryForm;
window.showAddAuthorForm = showAddAuthorForm;
window.logout = logout;

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing admin panel...');
    window.adminPanel = new AdminPanel();
});

console.log('admin-fixed.js loaded successfully');