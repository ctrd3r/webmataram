/**
 * Featured News Loader
 * Mengambil 2 berita terbaru secara random dari API
 */

async function loadFeaturedNews() {
    const container = document.getElementById('featured-news-container');
    
    try {
        // Fetch berita terbaru dari API
        const response = await fetch('/api/get_news.php?limit=10&sort=newest');
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Featured News API Response:', data);
        
        if (!data.success || !data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="col-span-1 md:col-span-2 text-center py-12">
                    <p class="text-slate-600 dark:text-slate-400">Belum ada berita tersedia</p>
                </div>
            `;
            return;
        }
        
        // Ambil 2 berita secara random
        const news = data.data;
        const randomNews = getRandomNews(news, 2);
        
        console.log('Random News Selected:', randomNews);
        
        // Render berita
        container.innerHTML = randomNews.map(item => createNewsCard(item)).join('');
        
    } catch (error) {
        console.error('Error loading featured news:', error);
        container.innerHTML = `
            <div class="col-span-1 md:col-span-2 text-center py-12">
                <p class="text-red-600 dark:text-red-400">Gagal memuat berita. Silakan coba lagi.</p>
                <p class="text-sm text-slate-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Ambil N item secara random dari array
 */
function getRandomNews(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Buat card berita
 */
function createNewsCard(item) {
    const imageUrl = item.gambar_url || item.gambar_utama || '/images/placeholder-news.jpg';
    const title = item.judul || 'Berita Tanpa Judul';
    const excerpt = item.ringkasan ? truncateText(item.ringkasan, 120) : 'Tidak ada deskripsi';
    const date = formatDate(item.tanggal_publish || item.tanggal_publikasi || item.created_at);
    const slug = item.slug || '#';
    const category = item.kategori || 'Umum';
    
    return `
        <article class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group" role="listitem">
            <!-- Image Container -->
            <div class="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img 
                    src="${imageUrl}" 
                    alt="${title}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onerror="this.src='/images/placeholder-news.jpg'"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Category Badge -->
                <div class="absolute top-3 left-3">
                    <span class="inline-block px-3 py-1 bg-bmkg-blue text-white text-xs font-bold rounded-full">
                        ${category}
                    </span>
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-6">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-bmkg-blue transition-colors">
                    ${title}
                </h4>
                
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    ${excerpt}
                </p>
                
                <!-- Meta Info -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
                        <time datetime="${item.tanggal_publikasi || item.created_at}">${date}</time>
                    </div>
                    
                    <a href="detail-berita.html?slug=${slug}" class="inline-flex items-center gap-1 text-bmkg-blue hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                        Baca Selengkapnya
                        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                    </a>
                </div>
            </div>
        </article>
    `;
}

/**
 * Potong teks dengan ellipsis
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format tanggal ke format lokal
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            locale: 'id-ID'
        };
        return date.toLocaleDateString('id-ID', options);
    } catch (error) {
        return dateString;
    }
}

// Load featured news saat DOM ready
document.addEventListener('DOMContentLoaded', loadFeaturedNews);

// Refresh berita setiap 5 menit
setInterval(loadFeaturedNews, 5 * 60 * 1000);
