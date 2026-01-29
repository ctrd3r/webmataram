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
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalNews: 25,
                    totalViews: 15420,
                    totalCategories: 5,
                    totalComments: 89
                });
            }, 500);
        });
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
        try {
            const news = await this.fetchAllNews();
            const container = document.getElementById('newsTable');
            
            container.innerHTML = `
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
                        ${news.map(item => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <img src="${item.gambar_url}" alt="${item.judul}" 
                                             class="w-10 h-10 object-cover rounded-lg mr-4"
                                             onerror="this.src='../images/placeholder-news.jpg'">
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">${item.judul}</div>
                                            <div class="text-sm text-gray-500">Oleh: ${item.penulis}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        ${item.kategori}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusBadgeClass(item.status)}">
                                        ${item.status.toUpperCase()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.views}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.tanggal_publish_formatted}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="editNews(${item.id_berita})" 
                                            class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                    <button onclick="deleteNews(${item.id_berita})" 
                                            class="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('Error loading news table:', error);
        }
    }

    async fetchAllNews() {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id_berita: 1,
                        judul: "Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat",
                        kategori: "Gempa Bumi",
                        penulis: "Admin BMKG",
                        status: "publish",
                        views: 1250,
                        tanggal_publish_formatted: "28 Jan 2024",
                        gambar_url: "../images/gempa-jabar-2024.jpg"
                    },
                    {
                        id_berita: 2,
                        judul: "Prakiraan Cuaca Hari Ini: Hujan Lebat",
                        kategori: "Cuaca",
                        penulis: "Tim Redaksi",
                        status: "publish",
                        views: 890,
                        tanggal_publish_formatted: "28 Jan 2024",
                        gambar_url: "../images/cuaca-hujan-2024.jpg"
                    }
                ]);
            }, 500);
        });
    }

    async loadCategoriesTable() {
        try {
            const categories = await this.fetchCategories();
            const container = document.getElementById('categoriesTable');
            
            container.innerHTML = `
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Berita</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${categories.map(category => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${category.nama_kategori}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${category.slug_kategori}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.jumlah_berita}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="editCategory(${category.id_kategori})" 
                                            class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                    <button onclick="deleteCategory(${category.id_kategori})" 
                                            class="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('Error loading categories table:', error);
        }
    }

    async fetchCategories() {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id_kategori: 1, nama_kategori: "Gempa Bumi", slug_kategori: "gempa-bumi", jumlah_berita: 12 },
                    { id_kategori: 2, nama_kategori: "Cuaca", slug_kategori: "cuaca", jumlah_berita: 8 },
                    { id_kategori: 3, nama_kategori: "Tsunami", slug_kategori: "tsunami", jumlah_berita: 3 },
                    { id_kategori: 4, nama_kategori: "Teknologi", slug_kategori: "teknologi", jumlah_berita: 2 }
                ]);
            }, 300);
        });
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
    // Implementation for add news form
    alert('Add News Form - To be implemented');
}

function showAddCategoryForm() {
    // Implementation for add category form
    alert('Add Category Form - To be implemented');
}

function showAddAuthorForm() {
    // Implementation for add author form
    alert('Add Author Form - To be implemented');
}

function editNews(id) {
    alert(`Edit News ID: ${id} - To be implemented`);
}

function deleteNews(id) {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        alert(`Delete News ID: ${id} - To be implemented`);
    }
}

function editCategory(id) {
    alert(`Edit Category ID: ${id} - To be implemented`);
}

function deleteCategory(id) {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        alert(`Delete Category ID: ${id} - To be implemented`);
    }
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

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});