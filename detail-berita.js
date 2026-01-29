// Detail Berita JavaScript
class DetailBerita {
    constructor() {
        this.newsSlug = this.getSlugFromURL();
        this.newsData = null;
        this.init();
    }

    getSlugFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('slug');
    }

    async init() {
        if (!this.newsSlug) {
            this.showError();
            return;
        }

        try {
            await this.loadNewsDetail();
            await this.loadRelatedNews();
            await this.loadPopularNews();
            await this.loadComments();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing detail page:', error);
            this.showError();
        }
    }

    async loadNewsDetail() {
        try {
            // Simulate API call - replace with actual API endpoint
            const response = await this.fetchNewsDetail(this.newsSlug);
            
            if (!response.success) {
                throw new Error(response.message);
            }

            this.newsData = response.data;
            this.renderNewsDetail();
            this.updateMetaTags();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading news detail:', error);
            this.showError();
        }
    }

    async fetchNewsDetail(slug) {
        // Simulate API response - replace with actual API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (slug === 'gempa-bumi-magnitudo-52-guncang-jawa-barat') {
                    resolve({
                        success: true,
                        data: {
                            id_berita: 1,
                            judul: "Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat",
                            slug: "gempa-bumi-magnitudo-52-guncang-jawa-barat",
                            ringkasan: "Gempa bumi dengan magnitudo 5.2 mengguncang wilayah Jawa Barat pada pagi hari ini. BMKG melaporkan tidak ada potensi tsunami.",
                            isi_berita: `
                                <p>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melaporkan terjadinya gempa bumi dengan magnitudo 5.2 yang mengguncang wilayah Jawa Barat pada pukul 08:30 WIB hari ini.</p>
                                
                                <p>Pusat gempa berada di koordinat 6.85 LS dan 107.12 BT dengan kedalaman 10 km. Lokasi episenter berada sekitar 15 km barat daya Kota Bandung.</p>
                                
                                <h3>Detail Gempa Bumi</h3>
                                <ul>
                                    <li><strong>Magnitudo:</strong> 5.2</li>
                                    <li><strong>Kedalaman:</strong> 10 km</li>
                                    <li><strong>Koordinat:</strong> 6.85 LS, 107.12 BT</li>
                                    <li><strong>Waktu:</strong> 28 Januari 2024, 08:30 WIB</li>
                                    <li><strong>Potensi Tsunami:</strong> Tidak ada</li>
                                </ul>
                                
                                <p>Getaran gempa dirasakan di beberapa wilayah Jawa Barat dengan intensitas II-III MMI. Masyarakat diimbau untuk tetap tenang dan waspada terhadap kemungkinan gempa susulan.</p>
                                
                                <p>BMKG terus memantau aktivitas seismik di wilayah tersebut dan akan memberikan update informasi terbaru melalui kanal resmi.</p>
                            `,
                            gambar_utama: "images/gempa-jabar-2024.jpg",
                            alt_gambar: "Ilustrasi gempa bumi di Jawa Barat",
                            meta_description: "Gempa bumi magnitudo 5.2 mengguncang Jawa Barat. BMKG melaporkan tidak ada potensi tsunami.",
                            tags: ["gempa bumi", "jawa barat", "bmkg", "magnitudo 5.2"],
                            views: 1251,
                            tanggal_publish: "2024-01-28 08:30:00",
                            tanggal_publish_formatted: "28 Januari 2024, 08:30 WIB",
                            kategori: "Gempa Bumi",
                            slug_kategori: "gempa-bumi",
                            penulis: "Admin BMKG",
                            foto_penulis: null,
                            bio_penulis: "Administrator sistem berita BMKG"
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'News not found'
                    });
                }
            }, 500);
        });
    }

    renderNewsDetail() {
        const data = this.newsData;
        
        // Update breadcrumb
        document.getElementById('breadcrumbCategory').textContent = data.kategori;
        document.getElementById('breadcrumbTitle').textContent = data.judul;
        
        // Update article content
        document.getElementById('articleImage').src = data.gambar_utama;
        document.getElementById('articleImage').alt = data.alt_gambar || data.judul;
        document.getElementById('articleCategory').textContent = data.kategori;
        document.getElementById('articleViews').textContent = data.views.toLocaleString();
        document.getElementById('articleTitle').textContent = data.judul;
        document.getElementById('articleAuthor').textContent = data.penulis;
        document.getElementById('articleDate').textContent = data.tanggal_publish_formatted;
        document.getElementById('articleSummary').innerHTML = `<p class="text-blue-800 font-medium">${data.ringkasan}</p>`;
        document.getElementById('articleBody').innerHTML = data.isi_berita;
        
        // Update reading time (estimate based on content length)
        const wordCount = data.isi_berita.replace(/<[^>]*>/g, '').split(' ').length;
        const readingTime = Math.ceil(wordCount / 200); // Assume 200 words per minute
        document.getElementById('readingTime').textContent = `${readingTime} menit baca`;
        
        // Render tags
        this.renderTags(data.tags);
        
        // Show article
        document.getElementById('articleContent').classList.remove('hidden');
    }

    renderTags(tags) {
        const container = document.getElementById('articleTags').querySelector('.flex');
        container.innerHTML = tags.map(tag => `
            <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
                #${tag}
            </span>
        `).join('');
    }

    updateMetaTags() {
        const data = this.newsData;
        
        // Update page title and meta tags
        document.getElementById('pageTitle').textContent = `${data.judul} - BMKG`;
        document.getElementById('pageDescription').setAttribute('content', data.meta_description);
        document.getElementById('pageKeywords').setAttribute('content', data.tags.join(', '));
        document.getElementById('pageAuthor').setAttribute('content', data.penulis);
        
        // Update Open Graph tags
        document.getElementById('ogTitle').setAttribute('content', data.judul);
        document.getElementById('ogDescription').setAttribute('content', data.meta_description);
        document.getElementById('ogImage').setAttribute('content', window.location.origin + '/' + data.gambar_utama);
        document.getElementById('ogUrl').setAttribute('content', window.location.href);
        
        // Update page title
        document.title = `${data.judul} - BMKG`;
    }

    async loadRelatedNews() {
        try {
            const relatedNews = await this.fetchRelatedNews();
            this.renderRelatedNews(relatedNews);
        } catch (error) {
            console.error('Error loading related news:', error);
        }
    }

    async fetchRelatedNews() {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id_berita: 2,
                        judul: "Prakiraan Cuaca Hari Ini: Hujan Lebat",
                        slug: "prakiraan-cuaca-hari-ini-hujan-lebat",
                        gambar_utama: "images/cuaca-hujan-2024.jpg",
                        kategori: "Cuaca",
                        tanggal_publish_formatted: "28 Januari 2024, 06:00 WIB",
                        views: 890
                    },
                    {
                        id_berita: 3,
                        judul: "Teknologi Baru BMKG untuk Deteksi Dini Tsunami",
                        slug: "teknologi-baru-bmkg-deteksi-dini-tsunami",
                        gambar_utama: "images/teknologi-tsunami-2024.jpg",
                        kategori: "Teknologi",
                        tanggal_publish_formatted: "27 Januari 2024, 14:20 WIB",
                        views: 567
                    }
                ]);
            }, 300);
        });
    }

    renderRelatedNews(news) {
        const container = document.getElementById('relatedNews');
        container.innerHTML = news.map(item => `
            <article class="flex space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <img src="${item.gambar_utama}" alt="${item.judul}" 
                     class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                     onerror="this.src='images/placeholder-news.jpg'">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                        <a href="detail-berita.html?slug=${item.slug}" class="hover:text-blue-600">
                            ${item.judul}
                        </a>
                    </h4>
                    <div class="text-xs text-gray-500 mb-1">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            ${item.kategori}
                        </span>
                    </div>
                    <div class="text-xs text-gray-500">
                        <span>${item.tanggal_publish_formatted}</span>
                        <span class="mx-1">•</span>
                        <span>${item.views} views</span>
                    </div>
                </div>
            </article>
        `).join('');
    }

    async loadPopularNews() {
        try {
            const popularNews = await this.fetchPopularNews();
            this.renderPopularNews(popularNews);
        } catch (error) {
            console.error('Error loading popular news:', error);
        }
    }

    async fetchPopularNews() {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id_berita: 1,
                        judul: "Gempa Bumi Magnitudo 5.2 Guncang Jawa Barat",
                        slug: "gempa-bumi-magnitudo-52-guncang-jawa-barat",
                        views: 1251
                    },
                    {
                        id_berita: 2,
                        judul: "Prakiraan Cuaca Hari Ini: Hujan Lebat",
                        slug: "prakiraan-cuaca-hari-ini-hujan-lebat",
                        views: 890
                    }
                ]);
            }, 400);
        });
    }

    renderPopularNews(news) {
        const container = document.getElementById('popularNews');
        container.innerHTML = news.map((item, index) => `
            <article class="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ${index + 1}
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                        <a href="detail-berita.html?slug=${item.slug}" class="hover:text-blue-600">
                            ${item.judul}
                        </a>
                    </h4>
                    <div class="text-xs text-gray-500">
                        <i class="fas fa-eye mr-1"></i>
                        ${item.views.toLocaleString()} views
                    </div>
                </div>
            </article>
        `).join('');
    }

    async loadComments() {
        try {
            const comments = await this.fetchComments();
            this.renderComments(comments);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    async fetchComments() {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id_komentar: 1,
                        nama_pengunjung: "Budi Santoso",
                        isi_komentar: "Terima kasih atas informasinya. Semoga masyarakat tetap waspada.",
                        created_at_formatted: "28 Januari 2024, 09:15 WIB"
                    },
                    {
                        id_komentar: 2,
                        nama_pengunjung: "Sari Dewi",
                        isi_komentar: "Alhamdulillah tidak ada korban jiwa. BMKG selalu memberikan informasi yang akurat.",
                        created_at_formatted: "28 Januari 2024, 09:30 WIB"
                    }
                ]);
            }, 600);
        });
    }

    renderComments(comments) {
        const container = document.getElementById('commentsList');
        
        if (comments.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <div class="flex items-center space-x-2 mb-2">
                    <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        ${comment.nama_pengunjung.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 text-sm">${comment.nama_pengunjung}</h4>
                        <p class="text-xs text-gray-500">${comment.created_at_formatted}</p>
                    </div>
                </div>
                <p class="text-gray-700 ml-10">${comment.isi_komentar}</p>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Comment form submission
        document.getElementById('commentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitComment();
        });
    }

    async submitComment() {
        const name = document.getElementById('commentName').value.trim();
        const email = document.getElementById('commentEmail').value.trim();
        const comment = document.getElementById('commentText').value.trim();

        if (!name || !email || !comment) {
            alert('Semua field harus diisi!');
            return;
        }

        try {
            // Simulate API call to submit comment
            const response = await this.submitCommentToAPI({
                nama: name,
                email: email,
                komentar: comment,
                id_berita: this.newsData.id_berita
            });

            if (response.success) {
                alert('Komentar berhasil dikirim! Menunggu moderasi.');
                document.getElementById('commentForm').reset();
            } else {
                alert('Gagal mengirim komentar. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    async submitCommentToAPI(commentData) {
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    hideLoading() {
        document.getElementById('loadingState').classList.add('hidden');
    }

    showError() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
    }
}

// Global functions for sharing
function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank', 'width=600,height=400');
}

function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://wa.me/?text=${title} ${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link berhasil disalin!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link berhasil disalin!');
    });
}

// Add CSS for line-clamp utility
const style = document.createElement('style');
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .prose h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        color: #1f2937;
    }
    .prose ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }
    .prose li {
        margin: 0.5rem 0;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.detailBerita = new DetailBerita();
});