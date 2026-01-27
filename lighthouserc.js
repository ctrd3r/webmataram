module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/#gempa',
        'http://localhost:3000/#tsunami',
        'http://localhost:3000/#kontak'
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        skipAudits: [
          'canonical', // Skip jika tidak menggunakan canonical URLs
          'is-crawlable' // Skip jika robots.txt mengblok crawling
        ]
      }
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        
        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'list': 'error',
        'meta-viewport': 'error',
        
        // Best Practices
        'is-on-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error',
        'csp-xss': 'warn',
        
        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        'hreflang': 'off', // Skip jika tidak multi-language
        
        // PWA
        'service-worker': 'error',
        'installable-manifest': 'error',
        'splash-screen': 'error',
        'themed-omnibox': 'error',
        'content-width': 'error',
        'viewport': 'error',
        'without-javascript': 'warn',
        'apple-touch-icon': 'error',
        'maskable-icon': 'warn',
        
        // Performance budgets
        'resource-summary:document:size': ['warn', { maxNumericValue: 50000 }], // 50KB HTML
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 100000 }], // 100KB CSS
        'resource-summary:script:size': ['warn', { maxNumericValue: 200000 }], // 200KB JS
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }], // 500KB images
        'resource-summary:font:size': ['warn', { maxNumericValue: 150000 }], // 150KB fonts
        'resource-summary:total:size': ['warn', { maxNumericValue: 1000000 }], // 1MB total
        
        // Network requests
        'resource-summary:total:count': ['warn', { maxNumericValue: 50 }], // Max 50 requests
        'third-party-summary': ['warn', { maxNumericValue: 500000 }], // 500KB third-party
        
        // Images
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        
        // JavaScript
        'unused-javascript': ['warn', { maxNumericValue: 50000 }], // 50KB unused JS
        'legacy-javascript': 'warn',
        'duplicated-javascript': 'error',
        
        // CSS
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }], // 50KB unused CSS
        
        // Fonts
        'font-display': 'warn',
        'preload-fonts': 'warn',
        
        // Critical resources
        'render-blocking-resources': 'warn',
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
        
        // Caching
        'uses-long-cache-ttl': 'warn',
        'uses-text-compression': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage',
      // Atau gunakan LHCI server jika ada
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-lhci-token'
    },
    server: {
      // Konfigurasi LHCI server jika menggunakan
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'sqlite',
      //   sqlDatabasePath: './lhci.db'
      // }
    }
  }
};