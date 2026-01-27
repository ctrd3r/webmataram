/**
 * Script untuk menyimpan logo resmi BMKG secara lokal
 * Jalankan di browser console atau sebagai bookmarklet
 */

async function saveOfficialBMKGLogo() {
    try {
        console.log('📥 Downloading official BMKG logo...');
        
        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
            img.onload = function() {
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0);
                
                // Convert to blob and download
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'logo-bmkg-official.png';
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    console.log('✅ Official BMKG logo downloaded successfully!');
                    resolve();
                });
            };
            
            img.onerror = function() {
                console.error('❌ Failed to load official BMKG logo');
                reject(new Error('Failed to load logo'));
            };
            
            // Load official logo
            img.src = 'https://www.bmkg.go.id/images/profil/logo-bmkg.png';
        });
        
    } catch (error) {
        console.error('Error downloading logo:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🏛️ Official BMKG Logo Downloader Ready');
    console.log('Run: saveOfficialBMKGLogo()');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { saveOfficialBMKGLogo };
}