// Berita Management System
class BeritaManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentCategory = '';
        this.currentSearch = '';
        this.sortOrder = 'newest';
        this.allNews = [];
        this.init();
    }

    async init() {
        await this.loadNews();
        await this.loadFeaturedNews();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search input dengan debounce
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentSearch = e.target.value;
                this.currentPage = 1;
                this.loadNews();
            }, 500);
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.currentPage = 1;
            this.loadNews();
        });

        // Sort order
        document.getElementById('sortOrder').addEventListener('change', (e) => {
            this.sortOrder = e.target.value;
            this.currentPage = 1;
            this.loadNews();
        });
    }

    async loadNews() {
        this.showLoading(true);
        
        try {
            // Simulasi API call - dalam implementasi nyata, ini akan memanggil API PHP
            const news = await this.fetchNewsFromAPI();
            
            if (this.currentPage === 1) {
                this.allNews = news;
                this.renderNews(news);
            } else {
                this.allNews = [...this.allNews, ...news];
                this.appendNews(news);
            }
            
            this.updateLoadMoreButton(news.length);
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Gagal memuat berita. Silakan coba lagi.');
        } finally {
            this.showLoading(false);
        }
    }

    async loadFeaturedNews() {
        try {
            const featuredNews = await this.fetchFeaturedNewsFromAPI();
            this.renderFeaturedNews(featuredNews);
        } catch (error) {
            console.error('Error loading featured news:', error);
        }
    }

    async fetchNewsFromAPI() {
        // Simulasi data - dalam implementasi nyata, ini akan memanggil get_news.php
        return new Promise((resolve) => {
            setTimeout(() => {
                const sampleNews = [
                    {
                        id: 1,
                        judul: "Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat",
                        slug: "gempa-bumi-magnitudo-52-guncang-jawa-barat",
                        ringkasan: "Gempa bumi dengan magnitudo 5.2 mengguncang wilayah Jawa Barat pada pagi hari ini.",
                        gambar_utama: "images/gempa-jabar-2024.jpg",
                        kategori: "Gempa Bumi",
                        slug_kategori: "gempa-bumi",
                        penulis: "Admin BMKG",
                        tanggal_publish: "2024-01-28 08:30:00",
                        views: 1250,
                        tags: ["gempa bumi", "jawa barat", "bmkg"]
                    },
                    {
                        id: 2,
                        judul: "Prakiraan Cuaca Hari Ini: Hujan Lebat di Sebagian Besar Wilayah Indonesia",
                        slug: "prakiraan-cuaca-hari-ini-hujan-lebat",
                        ringkasan: "BMKG memprakirakan cuaca hari ini akan didominasi hujan lebat di sebagian besar wilayah Indonesia.",
                        gambar_utama: "images/cuaca-hujan-2024.jpg",
                        kategori: "Cuaca",
                        slug_kategori: "cuaca",
                        penulis: "Tim Redaksi",
                        tanggal_publish: "2024-01-28 06:00:00",
                        views: 890,
                        tags: ["cuaca", "hujan lebat", "prakiraan"]
                    },
                    {
                        id: 3,
                        judul: "Teknologi Baru BMKG untuk Deteksi Dini Tsunami",
                        slug: "teknologi-baru-bmkg-deteksi-dini-tsunami",
                        ringkasan: "BMKG mengembangkan teknologi terbaru untuk meningkatkan akurasi sistem peringatan dini tsunami.",
                        gambar_utama: "images/teknologi-tsunami-2024.jpg",
                        kategori: "Teknologi",
                        slug_kategori: "teknologi",
                        penulis: "Tim Redaksi",
                        tanggal_publish: "2024-01-27 14:20:00",
                        views: 567,
                        tags: ["teknologi", "tsunami", "peringatan dini"]
                    }
                ];

                // Filter berdasarkan kategori
                let filteredNews = sampleNews;
                if (this.currentCategory) {
                    filteredNews = filteredNews.filter(news => 
                        news.slug_kategori === this.currentCategory
                    );
                }

                // Filter berdasarkan pencarian
                if (this.currentSearch) {
                    const searchTerm = this.currentSearch.toLowerCase();
                    filteredNews = filteredNews.filter(news => 
                        news.judul.toLowerCase().includes(searchTerm) ||
                        news.ringkasan.toLowerCase().includes(searchTerm) ||
                        news.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                    );
                }

                // Sorting
                filteredNews.sort((a, b) => {
                    switch (this.sortOrder) {
                        case 'newest':
                            return new Date(b.tanggal_publish) - new Date(a.tanggal_publish);
                        case 'oldest':
                            return new Date(a.tanggal_publish) - new Date(b.tanggal_publish);
                        case 'popular':
                            return b.views - a.views;
                        default:
                            return 0;
                    }
                });

                resolve(filteredNews);
            }, 500);
        });
    }

    async fetchFeaturedNewsFromAPI() {
        // Simulasi data featured news
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        judul: "Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat",
                        slug: "gempa-bumi-magnitudo-52-guncang-jawa-barat",
                        ringkasan: "Gempa bumi dengan magnitudo 5.2 mengguncang wilayah Jawa Barat pada pagi hari ini. BMKG melaporkan tidak ada potensi tsunami.",
                        gambar_utama: "images/gempa-jabar-2024.jpg",
                        kategori: "Gempa Bumi",
                        penulis: "Admin BMKG",
                        tanggal_publish: "2024-01-28 08:30:00",
                        views: 1250
                    }
                ]);
            }, 300);
        });
    }

    renderFeaturedNews(news) {
        const container = document.getElementById('featuredNews');
        container.innerHTML = news.map(item => `
            <article class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div class="relative">
                    <img src="${item.gambar_utama}" alt="${item.judul}" 
                         class="w-full h-64 object-cover"
                         onerror="this.src='images/placeholder-news.jpg'">
                    <div class="absolute top-4 left-4">
                        <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            UTAMA
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                            ${item.kategori}
                        </span>
                        <span>${this.formatDate(item.tanggal_publish)}</span>
                        <span class="mx-2">•</span>
                        <span>${item.views} views</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                        <a href="detail-berita.html?slug=${item.slug}" class="hover:text-blue-600 transition-colors">
                            ${item.judul}
                        </a>
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">${item.ringkasan}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">Oleh: ${item.penulis}</span>
                        <a href="detail-berita.html?slug=${item.slug}" 
                           class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            Baca Selengkapnya →
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    renderNews(news) {
        const container = document.getElementById('newsList');
        container.innerHTML = news.map(item => this.createNewsCard(item)).join('');
    }

    appendNews(news) {
        const container = document.getElementById('newsList');
        container.innerHTML += news.map(item => this.createNewsCard(item)).join('');
    }

    createNewsCard(item) {
        return `
            <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="relative">
                    <img src="${item.gambar_utama}" alt="${item.judul}" 
                         class="w-full h-48 object-cover"
                         onerror="this.src='images/placeholder-news.jpg'">
                    <div class="absolute top-3 left-3">
                        <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                            ${item.kategori}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex items-center text-xs text-gray-500 mb-2">
                        <span>${this.formatDate(item.tanggal_publish)}</span>
                        <span class="mx-2">•</span>
                        <span>${item.views} views</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        <a href="detail-berita.html?slug=${item.slug}" class="hover:text-blue-600 transition-colors">
                            ${item.judul}
                        </a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${item.ringkasan}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Oleh: ${item.penulis}</span>
                        <a href="detail-berita.html?slug=${item.slug}" 
                           class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            Baca →
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('id-ID', options);
    }

    showLoading(show) {
        const indicator = document.getElementById('loadingIndicator');
        if (show) {
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }

    showError(message) {
        const container = document.getElementById('newsList');
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p class="text-red-600">${message}</p>
                    <button onclick="location.reload()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Coba Lagi
                    </button>
                </div>
            </div>
        `;
    }

    updateLoadMoreButton(newsCount) {
        const button = document.getElementById('loadMoreBtn');
        if (newsCount < this.itemsPerPage) {
            button.style.display = 'none';
        } else {
            button.style.display = 'inline-block';
        }
    }

    loadMoreNews() {
        this.currentPage++;
        this.loadNews();
    }
}

// Global functions
function searchNews() {
    const searchInput = document.getElementById('searchInput');
    beritaManager.currentSearch = searchInput.value;
    beritaManager.currentPage = 1;
    beritaManager.loadNews();
}

function loadNews() {
    beritaManager.loadNews();
}

function loadMoreNews() {
    beritaManager.loadMoreNews();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.beritaManager = new BeritaManager();
});

// Add CSS for line-clamp utility
const style = document.createElement('style');
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);