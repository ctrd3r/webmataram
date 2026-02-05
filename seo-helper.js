/**
 * SEO Helper Functions
 * Manages meta tags, Open Graph, Twitter Cards, and structured data
 */

class SEOHelper {
    constructor() {
        this.defaultImage = 'images/bmkg-logo.png';
        this.siteName = 'BMKG News';
        this.siteUrl = window.location.origin;
        this.twitterHandle = '@infoBMKG';
    }

    /**
     * Update all meta tags for a page
     */
    updateMetaTags(data) {
        // Basic meta tags
        this.setTitle(data.title);
        this.setDescription(data.description);
        this.setKeywords(data.keywords);
        this.setCanonical(data.url);
        
        // Open Graph tags
        this.setOpenGraph({
            title: data.title,
            description: data.description,
            image: data.image || this.defaultImage,
            url: data.url,
            type: data.type || 'website'
        });
        
        // Twitter Card tags
        this.setTwitterCard({
            title: data.title,
            description: data.description,
            image: data.image || this.defaultImage
        });
        
        // Article-specific tags
        if (data.type === 'article' && data.article) {
            this.setArticleTags(data.article);
        }
    }

    /**
     * Set page title
     */
    setTitle(title) {
        document.title = title;
        this.setMetaTag('property', 'og:title', title);
        this.setMetaTag('name', 'twitter:title', title);
    }

    /**
     * Set meta description
     */
    setDescription(description) {
        this.setMetaTag('name', 'description', description);
        this.setMetaTag('property', 'og:description', description);
        this.setMetaTag('name', 'twitter:description', description);
    }

    /**
     * Set meta keywords
     */
    setKeywords(keywords) {
        if (Array.isArray(keywords)) {
            keywords = keywords.join(', ');
        }
        this.setMetaTag('name', 'keywords', keywords);
    }

    /**
     * Set canonical URL
     */
    setCanonical(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url || window.location.href;
    }

    /**
     * Set Open Graph tags
     */
    setOpenGraph(data) {
        this.setMetaTag('property', 'og:site_name', this.siteName);
        this.setMetaTag('property', 'og:title', data.title);
        this.setMetaTag('property', 'og:description', data.description);
        this.setMetaTag('property', 'og:image', this.getFullUrl(data.image));
        this.setMetaTag('property', 'og:url', data.url || window.location.href);
        this.setMetaTag('property', 'og:type', data.type || 'website');
        this.setMetaTag('property', 'og:locale', 'id_ID');
    }

    /**
     * Set Twitter Card tags
     */
    setTwitterCard(data) {
        this.setMetaTag('name', 'twitter:card', 'summary_large_image');
        this.setMetaTag('name', 'twitter:site', this.twitterHandle);
        this.setMetaTag('name', 'twitter:title', data.title);
        this.setMetaTag('name', 'twitter:description', data.description);
        this.setMetaTag('name', 'twitter:image', this.getFullUrl(data.image));
    }

    /**
     * Set article-specific tags
     */
    setArticleTags(article) {
        if (article.publishedTime) {
            this.setMetaTag('property', 'article:published_time', article.publishedTime);
        }
        if (article.modifiedTime) {
            this.setMetaTag('property', 'article:modified_time', article.modifiedTime);
        }
        if (article.author) {
            this.setMetaTag('property', 'article:author', article.author);
        }
        if (article.section) {
            this.setMetaTag('property', 'article:section', article.section);
        }
        if (article.tags && Array.isArray(article.tags)) {
            article.tags.forEach(tag => {
                this.addMetaTag('property', 'article:tag', tag);
            });
        }
    }

    /**
     * Set or update a meta tag
     */
    setMetaTag(attribute, key, value) {
        let element = document.querySelector(`meta[${attribute}="${key}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, key);
            document.head.appendChild(element);
        }
        element.setAttribute('content', value);
    }

    /**
     * Add a meta tag (for multiple tags with same key)
     */
    addMetaTag(attribute, key, value) {
        const element = document.createElement('meta');
        element.setAttribute(attribute, key);
        element.setAttribute('content', value);
        document.head.appendChild(element);
    }

    /**
     * Get full URL from relative path
     */
    getFullUrl(path) {
        if (!path) return this.siteUrl + '/' + this.defaultImage;
        if (path.startsWith('http')) return path;
        return this.siteUrl + '/' + path;
    }

    /**
     * Add JSON-LD structured data
     */
    addStructuredData(data) {
        // Remove existing structured data
        const existing = document.querySelector('script[type="application/ld+json"]');
        if (existing) {
            existing.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    /**
     * Create Article structured data
     */
    createArticleSchema(article) {
        return {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "description": article.description,
            "image": this.getFullUrl(article.image),
            "datePublished": article.publishedTime,
            "dateModified": article.modifiedTime || article.publishedTime,
            "author": {
                "@type": "Person",
                "name": article.author
            },
            "publisher": {
                "@type": "Organization",
                "name": this.siteName,
                "logo": {
                    "@type": "ImageObject",
                    "url": this.getFullUrl(this.defaultImage)
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": article.url || window.location.href
            }
        };
    }

    /**
     * Create Organization structured data
     */
    createOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Badan Meteorologi, Klimatologi, dan Geofisika",
            "alternateName": "BMKG",
            "url": this.siteUrl,
            "logo": this.getFullUrl(this.defaultImage),
            "sameAs": [
                "https://www.facebook.com/infoBMKG",
                "https://twitter.com/infoBMKG",
                "https://www.instagram.com/infobmkg",
                "https://www.youtube.com/user/infoBMKG"
            ]
        };
    }

    /**
     * Create BreadcrumbList structured data
     */
    createBreadcrumbSchema(items) {
        const itemListElement = items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": this.getFullUrl(item.url)
        }));

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };
    }

    /**
     * Create WebSite structured data with search
     */
    createWebSiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": this.siteName,
            "url": this.siteUrl,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": this.siteUrl + "/berita.html?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        };
    }

    /**
     * Generate meta description from content
     */
    generateDescription(content, maxLength = 160) {
        // Remove HTML tags
        const text = content.replace(/<[^>]*>/g, '');
        
        // Trim and limit length
        let description = text.trim();
        if (description.length > maxLength) {
            description = description.substring(0, maxLength - 3) + '...';
        }
        
        return description;
    }

    /**
     * Extract keywords from content
     */
    extractKeywords(content, tags = []) {
        // Start with provided tags
        const keywords = [...tags];
        
        // Add common BMKG-related keywords
        keywords.push('BMKG', 'meteorologi', 'klimatologi', 'geofisika');
        
        return keywords;
    }
}

// Create global instance
window.seoHelper = new SEOHelper();
