// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Wait for authentication to complete
        if (window.authMiddleware) {
            this.currentUser = window.authMiddleware.getCurrentUser();
            if (this.currentUser) {
                this.updateUserInfo();
            }
        }
        
        await this.loadDashboardStats();
        this.setupEventListeners();
        this.showSection('dashboard');
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('adminName').textContent = this.currentUser.name || this.currentUser.username;
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
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
        }
    }

    async loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                await this.loadDashboardStats();
                await this.loadRecentNews();
                break;
            case 'news':
                await this.loadNewsTable();
                break;
            case 'categories':
                await this.loadCategoriesTable();
                break;
            case 'authors':
                await this.loadAuthorsTable();
                break;
            case 'comments':
                await this.loadCommentsTable();
                break;
        }
    }

    async loadDashboardStats() {
        try {
            // Simulate API calls - replace with actual API endpoints
            const stats = await this.fetchDashboardStats();
            
            document.getElementById('totalNews').textContent = stats.totalNews || 0;
            document.getElementById('totalViews').textContent = stats.totalViews || 0;
            document.getElementById('totalCategories').textContent = stats.totalCategories || 0;
            document.getElementById('totalComments').textContent = stats.totalComments || 0;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async fetchDashboardStats() {
        try {
            const response = await fetch('../api/manage_news.php?action=stats');
            const result = await response.json();
            if (result.success) {
                return {
                    totalNews: result.data.total_news || 0,
                    totalViews: result.data.total_views || 0,
                    totalCategories: result.data.total_categories || 0,
                    totalComments: 0 // Comments not implemented yet
                };
            }
            return {
                totalNews: 0,
                totalViews: 0,
                totalCategories: 0,
                totalComments: 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalNews: 0,
                totalViews: 0,
                totalCategories: 0,
                totalComments: 0
            };
        }
    }

    async loadRecentNews() {
        try {
            const recentNews = await this.fetchRecentNews();
            const container = document.getElementById('recentNews');
            
            container.innerHTML = recentNews.map(news => `
                <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img src="${news.gambar_url}" alt="${news.judul}" 
                         class="w-16 h-16 object-cover rounded-lg"
                         onerror="this.src='../images/placeholder-news.jpg'">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${news.judul}</h4>
                        <p class="text-sm text-gray-600">${news.kategori} • ${news.tanggal_publish_formatted}</p>
                        <div class="flex items-center space-x-4 mt-2">
                            <span class="text-xs px-2 py-1 rounded-full ${this.getStatusBadgeClass(news.status)}">
                                ${news.status.toUpperCase()}
                            </span>
                            <span class="text-xs text-gray-500">${news.views} views</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editNews(${news.id_berita})" 
                                class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteNews(${news.id_berita})" 
                                class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading recent news:', error);
        }
    }

    async fetchRecentNews() {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id_berita: 1,
                        judul: "Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat",
                        kategori: "Gempa Bumi",
                        status: "publish",
                        views: 1250,
                        tanggal_publish_formatted: "28 Januari 2024, 08:30 WIB",
                        gambar_url: "../images/gempa-jabar-2024.jpg"
                    },
                    {
                        id_berita: 2,
                        judul: "Prakiraan Cuaca Hari Ini: Hujan Lebat",
                        kategori: "Cuaca",
                        status: "publish",
                        views: 890,
                        tanggal_publish_formatted: "28 Januari 2024, 06:00 WIB",
                        gambar_url: "../images/cuaca-hujan-2024.jpg"
                    }
                ]);
            }, 300);
        });
    }

    async loadNewsTable() {
        // Call the loadNews function which uses the real API
        loadNews();
        
        // Setup event listeners for search and filter
        const searchInput = document.getElementById('newsSearch');
        const statusFilter = document.getElementById('newsStatusFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => loadNews(), 500));
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => loadNews());
        }
    }

    async fetchAllNews() {
        // This method is no longer needed as we use loadNews() function
        // But kept for backward compatibility
        try {
            const response = await fetch('../api/manage_news.php?action=list');
            const result = await response.json();
            if (result.success) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    }

    async loadCategoriesTable() {
        // Call the loadCategories function which uses the real API
        loadCategories();
    }

    async fetchCategories() {
        // This method is no longer needed as we use loadCategories() function
        // But kept for backward compatibility
        try {
            const response = await fetch('../api/manage_categories.php?action=list');
            const result = await response.json();
            if (result.success) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async loadAuthorsTable() {
        // Similar implementation for authors
        const container = document.getElementById('authorsTable');
        container.innerHTML = '<p class="text-gray-500">Loading authors...</p>';
    }

    async loadCommentsTable() {
        // Similar implementation for comments
        const container = document.getElementById('commentsTable');
        container.innerHTML = '<p class="text-gray-500">Loading comments...</p>';
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
}

// Global functions
function showSection(section) {
    window.adminPanel.showSection(section);
}

function showAddNewsForm() {
    // Load categories first
    fetch('../api/manage_categories.php?action=list')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayAddNewsModal(result.data);
            } else {
                alert('Error loading categories');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memuat kategori');
        });
}

function displayAddNewsModal(categories) {
    const modal = `
        <div id="newsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
                <div class="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-lg">
                    <h3 class="text-xl font-semibold text-gray-800">Tambah Berita Baru</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="addNewsForm" class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Judul Berita <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="newsTitle" required
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   placeholder="Masukkan judul berita">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Kategori <span class="text-red-500">*</span>
                            </label>
                            <select id="newsCategory" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Pilih Kategori</option>
                                ${categories.map(cat => `<option value="${cat.id_kategori}">${cat.nama_kategori}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Status <span class="text-red-500">*</span>
                            </label>
                            <select id="newsStatus" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="draft">Draft</option>
                                <option value="publish">Publish</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Gambar Berita
                            </label>
                            
                            <!-- Image Upload Section -->
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <input type="file" id="newsImageFile" accept="image/jpeg,image/jpg,image/png,image/webp" 
                                       class="hidden" onchange="handleImageUpload(event)">
                                <button type="button" onclick="document.getElementById('newsImageFile').click()"
                                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-2">
                                    <i class="fas fa-upload mr-2"></i>Upload Gambar
                                </button>
                                <p class="text-xs text-gray-500">JPG, PNG, atau WebP (Max 10MB)</p>
                                <p class="text-xs text-gray-500">Gambar akan otomatis dioptimasi</p>
                            </div>
                            
                            <!-- Image Preview -->
                            <div id="imagePreviewContainer" class="mt-4 hidden">
                                <div class="relative inline-block">
                                    <img id="imagePreview" src="" alt="Preview" class="max-w-full h-48 rounded-lg shadow">
                                    <button type="button" onclick="removeImage()" 
                                            class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div id="imageStats" class="mt-2 text-sm text-gray-600"></div>
                            </div>
                            
                            <!-- Hidden input for image URL -->
                            <input type="hidden" id="newsImage">
                            
                            <!-- Upload Progress -->
                            <div id="uploadProgress" class="mt-4 hidden">
                                <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>Mengoptimasi gambar...</span>
                                    <span id="uploadPercent">0%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div id="uploadBar" class="bg-blue-600 h-2 rounded-full transition-all" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Isi Berita <span class="text-red-500">*</span>
                            </label>
                            <textarea id="newsContent" required rows="10"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Tulis isi berita di sini..."></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button type="button" onclick="closeModal()" 
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-save mr-2"></i>Simpan Berita
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
    
    document.getElementById('addNewsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newsData = {
            judul: document.getElementById('newsTitle').value.trim(),
            isi_berita: document.getElementById('newsContent').value.trim(),
            id_kategori: parseInt(document.getElementById('newsCategory').value),
            status: document.getElementById('newsStatus').value,
            gambar: document.getElementById('newsImage').value.trim(),
            id_penulis: 1 // Default, should be from logged in user
        };
        
        try {
            const response = await fetch('../api/manage_news.php?action=add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newsData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Berita berhasil ditambahkan!');
                closeModal();
                loadNews();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menambahkan berita');
        }
    });
}

function editNews(id) {
    // Load news data and categories
    Promise.all([
        fetch(`../api/manage_news.php?action=detail&id=${id}`).then(r => r.json()),
        fetch('../api/manage_categories.php?action=list').then(r => r.json())
    ])
    .then(([newsResult, catResult]) => {
        if (newsResult.success && catResult.success) {
            displayEditNewsModal(newsResult.data, catResult.data);
        } else {
            alert('Error loading data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memuat data');
    });
}

function displayEditNewsModal(news, categories) {
    const modal = `
        <div id="newsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
                <div class="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-lg">
                    <h3 class="text-xl font-semibold text-gray-800">Edit Berita</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="editNewsForm" class="p-6">
                    <input type="hidden" id="newsId" value="${news.id_berita}">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Judul Berita <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="newsTitle" required value="${news.judul}"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Kategori <span class="text-red-500">*</span>
                            </label>
                            <select id="newsCategory" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Pilih Kategori</option>
                                ${categories.map(cat => `<option value="${cat.id_kategori}" ${cat.id_kategori == news.id_kategori ? 'selected' : ''}>${cat.nama_kategori}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Status <span class="text-red-500">*</span>
                            </label>
                            <select id="newsStatus" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="draft" ${news.status === 'draft' ? 'selected' : ''}>Draft</option>
                                <option value="publish" ${news.status === 'publish' ? 'selected' : ''}>Publish</option>
                                <option value="archived" ${news.status === 'archived' ? 'selected' : ''}>Archived</option>
                            </select>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Gambar Berita
                            </label>
                            
                            <!-- Current Image Preview -->
                            ${news.gambar ? `
                            <div id="currentImagePreview" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p class="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                                <img src="../images/news/${news.gambar}" alt="Current image" class="max-h-48 rounded-lg mb-2">
                                <p class="text-xs text-gray-500">${news.gambar}</p>
                            </div>
                            ` : ''}
                            
                            <!-- Upload New Image -->
                            <div class="space-y-3">
                                <input type="hidden" id="newsImage" value="${news.gambar || ''}">
                                <input type="file" id="imageUploadEdit" accept="image/jpeg,image/jpg,image/png,image/webp" style="display: none;">
                                
                                <button type="button" onclick="document.getElementById('imageUploadEdit').click()" 
                                        class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                                    <p class="text-sm text-gray-600">Klik untuk upload gambar baru</p>
                                    <p class="text-xs text-gray-400 mt-1">JPG, PNG, atau WebP (Max 10MB)</p>
                                </button>
                                
                                <!-- Upload Progress -->
                                <div id="uploadProgressEdit" style="display: none;" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-sm font-medium text-blue-800">Mengupload & mengoptimasi...</span>
                                        <span id="uploadPercentEdit" class="text-sm font-bold text-blue-600">0%</span>
                                    </div>
                                    <div class="w-full bg-blue-200 rounded-full h-2">
                                        <div id="uploadBarEdit" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                                    </div>
                                </div>
                                
                                <!-- New Image Preview -->
                                <div id="newImagePreviewEdit" style="display: none;" class="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-green-800 mb-2">✓ Gambar baru berhasil diupload</p>
                                            <img id="previewImageEdit" src="" alt="Preview" class="max-h-48 rounded-lg mb-2">
                                        </div>
                                        <button type="button" onclick="removeImageEdit()" class="text-red-500 hover:text-red-700 ml-2">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div id="imageStatsEdit" class="text-xs text-gray-600 space-y-1"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Isi Berita <span class="text-red-500">*</span>
                            </label>
                            <textarea id="newsContent" required rows="10"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${news.isi_berita}</textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button type="button" onclick="closeModal()" 
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-save mr-2"></i>Update Berita
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
    
    // Setup image upload handler for edit form
    document.getElementById('imageUploadEdit').addEventListener('change', handleImageUploadEdit);
    
    document.getElementById('editNewsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newsData = {
            id_berita: parseInt(document.getElementById('newsId').value),
            judul: document.getElementById('newsTitle').value.trim(),
            isi_berita: document.getElementById('newsContent').value.trim(),
            id_kategori: parseInt(document.getElementById('newsCategory').value),
            status: document.getElementById('newsStatus').value,
            gambar: document.getElementById('newsImage').value.trim()
        };
        
        try {
            const response = await fetch('../api/manage_news.php?action=update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newsData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Berita berhasil diupdate!');
                closeModal();
                loadNews();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengupdate berita');
        }
    });
}

function deleteNews(id) {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        fetch(`../api/manage_news.php?action=delete&id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Berita berhasil dihapus!');
                loadNews();
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus berita');
        });
    }
}

function loadNews() {
    const status = document.getElementById('newsStatusFilter')?.value || '';
    const search = document.getElementById('newsSearch')?.value || '';
    
    let url = '../api/manage_news.php?action=list';
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayNewsTable(result.data);
            } else {
                console.error('Error loading news:', result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayNewsTable(newsList) {
    const tableHTML = `
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
                    ${newsList.map(news => `
                        <tr>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    ${news.gambar ? `<img src="${news.gambar}" class="w-12 h-12 rounded object-cover mr-3" alt="">` : '<div class="w-12 h-12 bg-gray-200 rounded mr-3"></div>'}
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">${news.judul}</div>
                                        <div class="text-sm text-gray-500">By ${news.penulis || 'Unknown'}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    ${news.nama_kategori || 'Uncategorized'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    news.status === 'publish' ? 'bg-green-100 text-green-800' :
                                    news.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }">
                                    ${news.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${news.views || 0}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${new Date(news.tanggal_publish).toLocaleDateString('id-ID')}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="editNews(${news.id_berita})" 
                                        class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button onclick="deleteNews(${news.id_berita})" 
                                        class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i> Hapus
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ${newsList.length === 0 ? '<p class="text-center text-gray-500 py-8">Belum ada berita. Silakan tambahkan berita baru.</p>' : ''}
    `;
    
    document.getElementById('newsTable').innerHTML = tableHTML;
}

function showAddCategoryForm() {
    const modal = `
        <div id="categoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-semibold text-gray-800">Tambah Kategori Baru</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="addCategoryForm" class="p-6">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Nama Kategori <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="categoryName" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="Contoh: Gempa Bumi, Cuaca, dll">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi (Opsional)
                        </label>
                        <textarea id="categoryDescription" rows="3"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Deskripsi singkat tentang kategori ini"></textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="closeModal()" 
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-save mr-2"></i>Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
    
    document.getElementById('addCategoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const categoryData = {
            nama_kategori: document.getElementById('categoryName').value.trim(),
            deskripsi: document.getElementById('categoryDescription').value.trim()
        };
        
        try {
            // Use relative path from admin folder
            const response = await fetch('../api/manage_categories.php?action=add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                alert('Kategori berhasil ditambahkan!');
                closeModal();
                loadCategories();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menambahkan kategori: ' + error.message);
        }
    });
}

function editCategory(id) {
    // Load category data first
    fetch(`../api/manage_categories.php?action=detail&id=${id}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const category = result.data;
                showEditCategoryForm(category);
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memuat data kategori');
        });
}

function showEditCategoryForm(category) {
    const modal = `
        <div id="categoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-semibold text-gray-800">Edit Kategori</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="editCategoryForm" class="p-6">
                    <input type="hidden" id="categoryId" value="${category.id_kategori}">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Nama Kategori <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="categoryName" required value="${category.nama_kategori}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi (Opsional)
                        </label>
                        <textarea id="categoryDescription" rows="3"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${category.deskripsi || ''}</textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="closeModal()" 
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-save mr-2"></i>Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
    
    document.getElementById('editCategoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const categoryData = {
            id_kategori: document.getElementById('categoryId').value,
            nama_kategori: document.getElementById('categoryName').value.trim(),
            deskripsi: document.getElementById('categoryDescription').value.trim()
        };
        
        try {
            const response = await fetch('../api/manage_categories.php?action=update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Kategori berhasil diupdate!');
                closeModal();
                loadCategories();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengupdate kategori');
        }
    });
}

function deleteCategory(id) {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        fetch(`../api/manage_categories.php?action=delete&id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Kategori berhasil dihapus!');
                loadCategories();
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus kategori');
        });
    }
}

function loadCategories() {
    fetch('../api/manage_categories.php?action=list')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayCategories(result.data);
            } else {
                console.error('Error loading categories:', result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayCategories(categories) {
    const tableHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Berita</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${categories.map(cat => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cat.id_kategori}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${cat.nama_kategori}</div>
                                ${cat.deskripsi ? `<div class="text-sm text-gray-500">${cat.deskripsi}</div>` : ''}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cat.slug_kategori}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    ${cat.total_berita} berita
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${new Date(cat.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="editCategory(${cat.id_kategori})" 
                                        class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button onclick="deleteCategory(${cat.id_kategori})" 
                                        class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i> Hapus
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ${categories.length === 0 ? '<p class="text-center text-gray-500 py-8">Belum ada kategori. Silakan tambahkan kategori baru.</p>' : ''}
    `;
    
    document.getElementById('categoriesTable').innerHTML = tableHTML;
}

function closeModal() {
    document.getElementById('modalContainer').innerHTML = '';
}

function logout() {
    if (window.authMiddleware) {
        window.authMiddleware.logout();
    } else {
        // Fallback
        if (confirm('Apakah Anda yakin ingin logout?')) {
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

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});


// ============================================
// IMAGE UPLOAD WITH OPTIMIZATION
// ============================================

/**
 * Handle image file selection and upload
 */
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
        alert('Please select an image file (JPG, PNG, or WebP)');
        return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Maximum 10MB allowed.');
        return;
    }
    
    // Show progress
    showUploadProgress();
    
    try {
        // Upload and optimize image
        const result = await uploadImageWithOptimization(file);
        
        if (result.success) {
            // Set image URL
            document.getElementById('newsImage').value = result.data.url;
            
            // Show preview
            showImagePreview(result.data);
            
            // Hide progress
            hideUploadProgress();
            
            // Show success message
            showImageStats(result.data);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image: ' + error.message);
        hideUploadProgress();
    }
}

/**
 * Upload image to server with optimization
 */
async function uploadImageWithOptimization(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prefix', 'news');
    formData.append('maxWidth', 1920);
    formData.append('maxHeight', 1080);
    formData.append('quality', 85);
    
    const response = await fetch('../api/upload_image.php', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Show image preview
 */
function showImagePreview(data) {
    const container = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');
    
    preview.src = '../' + data.url;
    container.classList.remove('hidden');
}

/**
 * Show image optimization stats
 */
function showImageStats(data) {
    const statsDiv = document.getElementById('imageStats');
    statsDiv.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded p-3">
            <p class="text-green-800 font-medium mb-1">
                <i class="fas fa-check-circle mr-1"></i>
                Image uploaded and optimized successfully!
            </p>
            <div class="text-xs text-green-700 space-y-1">
                <p><strong>Original:</strong> ${data.original_size} → <strong>Optimized:</strong> ${data.optimized_size}</p>
                <p><strong>Savings:</strong> ${data.savings} | <strong>Dimensions:</strong> ${data.dimensions.width}x${data.dimensions.height}</p>
                ${data.webp_url ? '<p><strong>WebP version created</strong> for better performance</p>' : ''}
            </div>
        </div>
    `;
}

/**
 * Remove uploaded image
 */
function removeImage() {
    document.getElementById('newsImage').value = '';
    document.getElementById('newsImageFile').value = '';
    document.getElementById('imagePreviewContainer').classList.add('hidden');
    document.getElementById('imageStats').innerHTML = '';
}

/**
 * Show upload progress
 */
function showUploadProgress() {
    const progressDiv = document.getElementById('uploadProgress');
    progressDiv.classList.remove('hidden');
    
    // Simulate progress (since we don't have real progress tracking)
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
            updateProgressBar(progress);
        } else {
            clearInterval(interval);
        }
    }, 200);
    
    // Store interval ID to clear it later
    progressDiv.dataset.intervalId = interval;
}

/**
 * Hide upload progress
 */
function hideUploadProgress() {
    const progressDiv = document.getElementById('uploadProgress');
    
    // Clear interval if exists
    if (progressDiv.dataset.intervalId) {
        clearInterval(parseInt(progressDiv.dataset.intervalId));
    }
    
    // Complete progress
    updateProgressBar(100);
    
    // Hide after a short delay
    setTimeout(() => {
        progressDiv.classList.add('hidden');
        updateProgressBar(0);
    }, 500);
}

/**
 * Update progress bar
 */
function updateProgressBar(percent) {
    document.getElementById('uploadBar').style.width = percent + '%';
    document.getElementById('uploadPercent').textContent = percent + '%';
}


/**
 * Handle image upload for EDIT form
 */
async function handleImageUploadEdit(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Format file tidak valid. Gunakan JPG, PNG, atau WebP.');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 10MB.');
        return;
    }
    
    try {
        showUploadProgressEdit();
        
        const result = await uploadImageWithOptimization(file);
        
        if (result.success) {
            // Update hidden input with filename
            document.getElementById('newsImage').value = result.data.filename;
            
            // Show preview
            showImagePreviewEdit(result.data);
            
            // Hide current image preview
            const currentPreview = document.getElementById('currentImagePreview');
            if (currentPreview) {
                currentPreview.style.display = 'none';
            }
        } else {
            alert('Upload gagal: ' + result.message);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Terjadi kesalahan saat upload: ' + error.message);
    } finally {
        hideUploadProgressEdit();
    }
}

/**
 * Show image preview for EDIT form
 */
function showImagePreviewEdit(data) {
    const previewContainer = document.getElementById('newImagePreviewEdit');
    const previewImage = document.getElementById('previewImageEdit');
    const statsDiv = document.getElementById('imageStatsEdit');
    
    previewContainer.style.display = 'block';
    previewImage.src = '../' + data.url;
    
    statsDiv.innerHTML = `
        <div class="grid grid-cols-2 gap-2">
            <div>
                <span class="font-medium">Filename:</span> ${data.filename}
            </div>
            <div>
                <span class="font-medium">Size:</span> ${data.optimized_size}
            </div>
            <div>
                <span class="font-medium">Dimensions:</span> ${data.dimensions.width}x${data.dimensions.height}
            </div>
            <div>
                <span class="font-medium text-green-600">Saved:</span> ${data.savings}
            </div>
        </div>
    `;
}

/**
 * Remove uploaded image for EDIT form
 */
function removeImageEdit() {
    // Clear the hidden input
    document.getElementById('newsImage').value = '';
    
    // Clear file input
    document.getElementById('imageUploadEdit').value = '';
    
    // Hide new image preview
    document.getElementById('newImagePreviewEdit').style.display = 'none';
    
    // Show current image preview again if it exists
    const currentPreview = document.getElementById('currentImagePreview');
    if (currentPreview) {
        currentPreview.style.display = 'block';
    }
}

/**
 * Show upload progress for EDIT form
 */
function showUploadProgressEdit() {
    const progressDiv = document.getElementById('uploadProgressEdit');
    progressDiv.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
            updateProgressBarEdit(progress);
        } else {
            clearInterval(interval);
        }
    }, 200);
    
    progressDiv.dataset.intervalId = interval;
}

/**
 * Hide upload progress for EDIT form
 */
function hideUploadProgressEdit() {
    const progressDiv = document.getElementById('uploadProgressEdit');
    
    if (progressDiv.dataset.intervalId) {
        clearInterval(parseInt(progressDiv.dataset.intervalId));
    }
    
    updateProgressBarEdit(100);
    
    setTimeout(() => {
        progressDiv.style.display = 'none';
        updateProgressBarEdit(0);
    }, 500);
}

/**
 * Update progress bar for EDIT form
 */
function updateProgressBarEdit(percent) {
    const bar = document.getElementById('uploadBarEdit');
    const text = document.getElementById('uploadPercentEdit');
    
    if (bar) bar.style.width = percent + '%';
    if (text) text.textContent = percent + '%';
}
