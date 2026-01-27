// Service Worker untuk Stasiun Geofisika Mataram
// Menyediakan offline capability dan caching

const CACHE_NAME = 'sgm-bmkg-v1.0.0';
const STATIC_CACHE = 'sgm-static-v1.0.0';
const DYNAMIC_CACHE = 'sgm-dynamic-v1.0.0';

// Files to cache
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

// Dynamic cache patterns
const CACHE_PATTERNS = [
    /^https:\/\/images\.unsplash\.com/,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
    /^https:\/\/cdn\.tailwindcss\.com/
];

// Install event
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        handleFetch(request)
    );
});

async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static assets
        if (isStaticAsset(request)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First for API calls and dynamic content
        if (isApiCall(request) || isDynamicContent(request)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate for images and fonts
        if (isImageOrFont(request)) {
            return await staleWhileRevalidate(request);
        }
        
        // Default: Network First
        return await networkFirst(request);
        
    } catch (error) {
        console.error('🚨 Service Worker: Fetch error', error);
        return await handleFetchError(request, error);
    }
}

// Cache First Strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    await cacheResponse(request, networkResponse.clone(), STATIC_CACHE);
    return networkResponse;
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE);
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request)
        .then(async (networkResponse) => {
            if (networkResponse.ok) {
                await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE);
            }
            return networkResponse;
        })
        .catch(() => {
            // Network failed, but we might have cache
            return null;
        });
    
    return cachedResponse || await networkResponsePromise;
}

// Cache response helper
async function cacheResponse(request, response, cacheName) {
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return;
    }
    
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
}

// Request type checkers
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.endsWith('.css') || 
           url.pathname.endsWith('.js') || 
           url.pathname.endsWith('.html') ||
           url.pathname === '/';
}

function isApiCall(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') || 
           url.hostname.includes('api.');
}

function isDynamicContent(request) {
    const url = new URL(request.url);
    return url.search.includes('timestamp') || 
           url.search.includes('live') ||
           url.pathname.includes('/data/');
}

function isImageOrFont(request) {
    return CACHE_PATTERNS.some(pattern => pattern.test(request.url)) ||
           request.destination === 'image' ||
           request.destination === 'font';
}

// Error handling
async function handleFetchError(request, error) {
    const url = new URL(request.url);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Serve offline page for navigation requests
    if (request.mode === 'navigate') {
        const offlinePage = await caches.match('/');
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // Return a basic offline response
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.'
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Background sync', event.tag);
    
    if (event.tag === 'earthquake-data-sync') {
        event.waitUntil(syncEarthquakeData());
    }
});

async function syncEarthquakeData() {
    try {
        // Sync earthquake data when back online
        const response = await fetch('/api/earthquake/latest');
        if (response.ok) {
            const data = await response.json();
            
            // Notify clients about new data
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'EARTHQUAKE_DATA_UPDATED',
                    data: data
                });
            });
        }
    } catch (error) {
        console.error('🚨 Service Worker: Sync failed', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('📱 Service Worker: Push received');
    
    const options = {
        body: 'Gempa bumi terdeteksi di wilayah NTB',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/#gempa'
        },
        actions: [
            {
                action: 'view',
                title: 'Lihat Detail',
                icon: '/icons/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Tutup',
                icon: '/icons/action-dismiss.png'
            }
        ]
    };
    
    if (event.data) {
        const payload = event.data.json();
        options.body = payload.message || options.body;
        options.data = { ...options.data, ...payload.data };
    }
    
    event.waitUntil(
        self.registration.showNotification('Stasiun Geofisika Mataram', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from clients
self.addEventListener('message', (event) => {
    console.log('💬 Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('⏰ Service Worker: Periodic sync', event.tag);
    
    if (event.tag === 'earthquake-check') {
        event.waitUntil(checkForNewEarthquakes());
    }
});

async function checkForNewEarthquakes() {
    try {
        const response = await fetch('/api/earthquake/check');
        if (response.ok) {
            const data = await response.json();
            
            if (data.hasNewEarthquake) {
                // Show notification for significant earthquakes
                if (data.magnitude >= 4.0) {
                    await self.registration.showNotification('Gempa Bumi Terdeteksi', {
                        body: `Gempa M ${data.magnitude} di ${data.location}`,
                        icon: '/icons/icon-192x192.png',
                        tag: 'earthquake-alert',
                        requireInteraction: true
                    });
                }
            }
        }
    } catch (error) {
        console.error('🚨 Service Worker: Earthquake check failed', error);
    }
}

console.log('🌍 Service Worker: Stasiun Geofisika Mataram loaded');