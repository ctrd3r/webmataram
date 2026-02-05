// Quick fix untuk debugging berita.html
// Tambahkan script ini di console browser untuk debug

console.log('=== BERITA DEBUG START ===');

// Check if elements exist
const elements = {
    'featuredNews': document.getElementById('featuredNews'),
    'newsList': document.getElementById('newsList'),
    'popularNews': document.getElementById('popularNews'),
    'categoriesWidget': document.getElementById('categoriesWidget'),
    'searchInput': document.getElementById('searchInput'),
    'categoryFilter': document.getElementById('categoryFilter'),
    'sortOrder': document.getElementById('sortOrder')
};

console.log('Elements check:', elements);

// Check if BeritaManager is loaded
console.log('BeritaManager class:', typeof BeritaManager);
console.log('beritaManager instance:', typeof window.beritaManager);

// Check if scripts are loaded
console.log('Scripts loaded:');
console.log('- bmkg-clock.js:', typeof window.BMKGClock);
console.log('- seo-helper.js:', typeof window.seoHelper);
console.log('- lazy-load.js:', typeof window.lazyLoader);

// Test API directly
async function testAPIDirectly() {
    try {
        console.log('Testing API directly...');
        const response = await fetch('api/get_news.php?limit=3');
        const result = await response.json();
        console.log('API Response:', result);
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Run test
testAPIDirectly();

console.log('=== BERITA DEBUG END ===');