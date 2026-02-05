/**
 * Lazy Loading Images
 * Improves page load performance by loading images only when needed
 */

class LazyLoader {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01,
            ...options
        };
        
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.options
            );
            
            this.observeImages();
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }
    
    observeImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                this.observer.observe(img);
            }
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        
        if (!src) return;
        
        // Create a new image to preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        
        tempImg.onerror = () => {
            img.src = img.dataset.fallback || 'images/placeholder-news.jpg';
            img.classList.add('error');
        };
        
        tempImg.src = src;
    }
    
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
    
    refresh() {
        if (this.observer) {
            this.observeImages();
        }
    }
}

// Initialize lazy loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader({
        rootMargin: '100px' // Start loading 100px before image enters viewport
    });
});

// Add CSS for smooth loading transition
const style = document.createElement('style');
style.textContent = `
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    img[data-src].loaded {
        opacity: 1;
    }
    
    img[data-src].error {
        opacity: 0.5;
        filter: grayscale(100%);
    }
`;
document.head.appendChild(style);
