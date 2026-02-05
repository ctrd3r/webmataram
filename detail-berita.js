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
            const response = await this.fetchNewsDetail(this.newsSlug);
            
            if (!response.success) {
                throw new Error(response.message);
            }

            // Store the full response (includes data, related_news, comments)
            this.newsData = response.data;
            this.newsData.related_news = response.related_news || [];
            this.newsData.comments = response.comments || [];
            
            this.renderNewsDetail();
            
            // Update meta tags (with error handling)
            try {
                this.updateMetaTags();
            } catch (error) {
                console.warn('SEO meta tags update failed:', error);
                // Continue anyway - page should still work
            }
            
            this.hideLoading();
        } catch (error) {
            console.error('Error loading news detail:', error);
            this.showError();
        }
    }

    async fetchNewsDetail(slug) {
        try {
            const response = await fetch(`api/get_news_detail.php?slug=${encodeURIComponent(slug)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching news detail:', error);
            return {
                success: false,
                message: 'Failed to load news detail'
            };
        }
    }

    renderNewsDetail() {
        const data = this.newsData;
        
        // Update breadcrumb
        document.getElementById('breadcrumbCategory').textContent = data.kategori;
        document.getElementById('breadcrumbTitle').textContent = data.judul;
        
        // Update article content - use data-src for lazy loading
        const articleImage = document.getElementById('articleImage');
        const imageUrl = data.gambar_url || data.gambar_utama || 'images/placeholder-news.jpg';
        articleImage.setAttribute('data-src', imageUrl);
        articleImage.alt = data.alt_gambar || data.judul;
        
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
        this.renderTags(data.tags || []);
        
        // Show article
        document.getElementById('articleContent').classList.remove('hidden');
        
        // Refresh lazy loader for new images
        if (window.lazyLoader) {
            window.lazyLoader.refresh();
        }
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
        
        // Check if SEO Helper is loaded
        if (!window.seoHelper) {
            console.warn('SEO Helper not loaded yet');
            return;
        }
        
        // Use SEO Helper to update all meta tags
        window.seoHelper.updateMetaTags({
            title: `${data.judul} - BMKG News`,
            description: data.meta_description || data.ringkasan,
            keywords: data.tags || ['bmkg', 'berita', data.kategori.toLowerCase()],
            url: window.location.href,
            image: data.gambar_utama,
            type: 'article',
            article: {
                publishedTime: data.tanggal_publish,
                modifiedTime: data.tanggal_update || data.tanggal_publish,
                author: data.penulis,
                section: data.kategori,
                tags: data.tags
            }
        });
        
        // Add Article structured data
        const articleSchema = window.seoHelper.createArticleSchema({
            title: data.judul,
            description: data.meta_description || data.ringkasan,
            image: data.gambar_utama,
            publishedTime: data.tanggal_publish,
            modifiedTime: data.tanggal_update || data.tanggal_publish,
            author: data.penulis,
            url: window.location.href
        });
        
        // Add Breadcrumb structured data
        const breadcrumbSchema = window.seoHelper.createBreadcrumbSchema([
            { name: 'Beranda', url: 'index.html' },
            { name: 'Berita', url: 'berita.html' },
            { name: data.kategori, url: `berita.html?category=${data.slug_kategori}` },
            { name: data.judul, url: window.location.href }
        ]);
        
        // Combine schemas
        const structuredData = {
            "@context": "https://schema.org",
            "@graph": [
                articleSchema,
                breadcrumbSchema,
                window.seoHelper.createOrganizationSchema()
            ]
        };
        
        window.seoHelper.addStructuredData(structuredData);
    }

    async loadRelatedNews() {
        try {
            // Related news is already included in the main API response
            if (this.newsData && this.newsData.related_news) {
                this.renderRelatedNews(this.newsData.related_news);
            }
        } catch (error) {
            console.error('Error loading related news:', error);
        }
    }

    renderRelatedNews(news) {
        const container = document.getElementById('relatedNews');
        
        if (!news || news.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">Tidak ada berita terkait</p>';
            return;
        }
        
        container.innerHTML = news.map(item => {
            const imageUrl = item.gambar_url || item.gambar_utama || 'images/placeholder-news.jpg';
            return `
                <article class="flex space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img data-src="${imageUrl}" alt="${item.judul}" 
                         loading="lazy"
                         class="w-20 h-20 object-cover rounded-lg flex-shrink-0 lazy-image"
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
            `;
        }).join('');
        
        // Refresh lazy loader for new images
        if (window.lazyLoader) {
            window.lazyLoader.refresh();
        }
    }

    async loadPopularNews() {
        try {
            // Fetch popular news from API
            const response = await fetch('api/get_news.php?sort=views&limit=5');
            const data = await response.json();
            
            if (data.success && data.data) {
                this.renderPopularNews(data.data);
            }
        } catch (error) {
            console.error('Error loading popular news:', error);
        }
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
            // Comments are already included in the main API response
            if (this.newsData && this.newsData.comments) {
                this.renderComments(this.newsData.comments);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
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

// Add CSS for line-clamp utility (if not already added)
if (!document.getElementById('detail-berita-styles')) {
    const detailStyle = document.createElement('style');
    detailStyle.id = 'detail-berita-styles';
    detailStyle.textContent = `
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
    document.head.appendChild(detailStyle);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.detailBerita = new DetailBerita();
});