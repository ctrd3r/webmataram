/**
 * BMKG Logo Implementation Validator
 * Checks if all logo references are properly implemented
 */

class LogoValidator {
    constructor() {
        this.results = {
            passed: [],
            failed: [],
            warnings: []
        };
    }

    async validate() {
        console.log('🔍 Validating BMKG Logo Implementation...\n');

        // Check SVG logo file exists
        this.checkSVGLogo();
        
        // Check HTML logo references
        this.checkHTMLReferences();
        
        // Check manifest.json icons
        this.checkManifestIcons();
        
        // Check favicon files
        this.checkFaviconFiles();
        
        // Check CSS references
        this.checkCSSReferences();
        
        // Display results
        this.displayResults();
    }

    checkSVGLogo() {
        const logoPath = 'images/logo-bmkg.svg';
        
        fetch(logoPath)
            .then(response => {
                if (response.ok) {
                    this.results.passed.push(`✅ SVG logo file exists: ${logoPath}`);
                } else {
                    this.results.failed.push(`❌ SVG logo file missing: ${logoPath}`);
                }
            })
            .catch(() => {
                this.results.failed.push(`❌ Cannot access SVG logo: ${logoPath}`);
            });
    }

    checkHTMLReferences() {
        const logoImages = document.querySelectorAll('img[src*="logo-bmkg"]');
        
        if (logoImages.length >= 2) {
            this.results.passed.push(`✅ Logo images found in HTML: ${logoImages.length} instances`);
            
            logoImages.forEach((img, index) => {
                if (img.alt && img.alt.includes('BMKG')) {
                    this.results.passed.push(`✅ Logo ${index + 1} has proper alt text: "${img.alt}"`);
                } else {
                    this.results.warnings.push(`⚠️ Logo ${index + 1} missing or incomplete alt text`);
                }
            });
        } else {
            this.results.failed.push(`❌ Logo images not found or insufficient in HTML`);
        }

        // Check favicon links
        const faviconLinks = document.querySelectorAll('link[rel*="icon"]');
        if (faviconLinks.length >= 3) {
            this.results.passed.push(`✅ Favicon links found: ${faviconLinks.length} links`);
        } else {
            this.results.failed.push(`❌ Insufficient favicon links found`);
        }
    }

    checkManifestIcons() {
        fetch('/manifest.json')
            .then(response => response.json())
            .then(manifest => {
                if (manifest.icons && manifest.icons.length >= 8) {
                    this.results.passed.push(`✅ PWA manifest icons: ${manifest.icons.length} sizes`);
                    
                    const requiredSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
                    const availableSizes = manifest.icons.map(icon => icon.sizes);
                    
                    const missingSizes = requiredSizes.filter(size => !availableSizes.includes(size));
                    if (missingSizes.length === 0) {
                        this.results.passed.push(`✅ All required PWA icon sizes present`);
                    } else {
                        this.results.warnings.push(`⚠️ Missing PWA icon sizes: ${missingSizes.join(', ')}`);
                    }
                } else {
                    this.results.failed.push(`❌ Insufficient PWA manifest icons`);
                }
            })
            .catch(() => {
                this.results.failed.push(`❌ Cannot access manifest.json`);
            });
    }

    checkFaviconFiles() {
        const requiredFavicons = [
            '/favicon.ico',
            '/icons/favicon-16x16.png',
            '/icons/favicon-32x32.png',
            '/icons/apple-touch-icon.png'
        ];

        requiredFavicons.forEach(path => {
            fetch(path, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        this.results.passed.push(`✅ Favicon file exists: ${path}`);
                    } else {
                        this.results.failed.push(`❌ Favicon file missing: ${path}`);
                    }
                })
                .catch(() => {
                    this.results.failed.push(`❌ Cannot access favicon: ${path}`);
                });
        });
    }

    checkCSSReferences() {
        // Check if logo images are properly styled
        const logoImages = document.querySelectorAll('img[src*="logo-bmkg"]');
        
        logoImages.forEach((img, index) => {
            const computedStyle = window.getComputedStyle(img);
            
            if (computedStyle.objectFit === 'contain') {
                this.results.passed.push(`✅ Logo ${index + 1} has proper object-fit styling`);
            } else {
                this.results.warnings.push(`⚠️ Logo ${index + 1} may need object-fit: contain`);
            }
        });
    }

    displayResults() {
        console.log('\n📊 BMKG Logo Implementation Validation Results\n');
        
        if (this.results.passed.length > 0) {
            console.log('✅ PASSED CHECKS:');
            this.results.passed.forEach(result => console.log(`   ${result}`));
            console.log('');
        }

        if (this.results.warnings.length > 0) {
            console.log('⚠️ WARNINGS:');
            this.results.warnings.forEach(result => console.log(`   ${result}`));
            console.log('');
        }

        if (this.results.failed.length > 0) {
            console.log('❌ FAILED CHECKS:');
            this.results.failed.forEach(result => console.log(`   ${result}`));
            console.log('');
        }

        const totalChecks = this.results.passed.length + this.results.warnings.length + this.results.failed.length;
        const passRate = Math.round((this.results.passed.length / totalChecks) * 100);
        
        console.log(`📈 Overall Score: ${passRate}% (${this.results.passed.length}/${totalChecks} checks passed)`);
        
        if (this.results.failed.length === 0) {
            console.log('🎉 BMKG Logo implementation is ready for production!');
        } else {
            console.log('🔧 Please fix the failed checks before deployment.');
        }
    }
}

// Auto-run validation when script is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const validator = new LogoValidator();
        validator.validate();
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogoValidator;
}