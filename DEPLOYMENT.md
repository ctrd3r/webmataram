# Panduan Deployment Website Stasiun Geofisika Mataram

## 📋 Persiapan Deployment

### 1. Checklist Pre-Deployment
- [ ] Test website di berbagai browser (Chrome, Firefox, Safari, Edge)
- [ ] Validasi responsive design di berbagai ukuran layar
- [ ] Test dark mode functionality
- [ ] Validasi HTML, CSS, dan JavaScript
- [ ] Optimasi gambar dan assets
- [ ] Test Service Worker dan PWA functionality
- [ ] Konfigurasi SSL certificate
- [ ] Setup monitoring dan analytics

### 2. Environment Requirements
- **Web Server**: Apache 2.4+ atau Nginx 1.18+
- **PHP**: 7.4+ (jika menggunakan server-side processing)
- **SSL Certificate**: Required untuk PWA dan Service Worker
- **Domain**: geofisika-mataram.bmkg.go.id (atau subdomain yang sesuai)

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended)

#### Netlify
1. **Setup Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/bmkg/stasiun-geofisika-mataram.git
   git push -u origin main
   ```

2. **Deploy ke Netlify**
   - Login ke [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Set build settings:
     - Build command: (kosong untuk static site)
     - Publish directory: `/`
   - Deploy site

3. **Custom Domain**
   - Add custom domain: `geofisika-mataram.bmkg.go.id`
   - Configure DNS records
   - Enable HTTPS

#### Vercel
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Custom Domain**
   ```bash
   vercel domains add geofisika-mataram.bmkg.go.id
   ```

### Option 2: Traditional Web Hosting

#### Apache Setup
1. **Upload Files**
   ```bash
   # Via FTP/SFTP
   scp -r * user@server:/var/www/html/geofisika-mataram/
   ```

2. **Configure Virtual Host**
   ```apache
   <VirtualHost *:80>
       ServerName geofisika-mataram.bmkg.go.id
       DocumentRoot /var/www/html/geofisika-mataram
       
       # Redirect to HTTPS
       RewriteEngine On
       RewriteCond %{HTTPS} off
       RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   </VirtualHost>
   
   <VirtualHost *:443>
       ServerName geofisika-mataram.bmkg.go.id
       DocumentRoot /var/www/html/geofisika-mataram
       
       SSLEngine on
       SSLCertificateFile /path/to/certificate.crt
       SSLCertificateKeyFile /path/to/private.key
       
       # Include .htaccess rules
       AllowOverride All
   </VirtualHost>
   ```

#### Nginx Setup
1. **Server Block Configuration**
   ```nginx
   server {
       listen 80;
       server_name geofisika-mataram.bmkg.go.id;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name geofisika-mataram.bmkg.go.id;
       
       root /var/www/html/geofisika-mataram;
       index index.html;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
       
       # Service Worker
       location /sw.js {
           add_header Cache-Control "no-cache";
           expires 0;
       }
       
       # Manifest
       location /manifest.json {
           add_header Cache-Control "no-cache";
           expires 0;
       }
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;
       
       # Try files
       try_files $uri $uri/ /index.html;
   }
   ```

## 🔧 Configuration

### 1. Environment Variables
Buat file `.env` untuk konfigurasi:
```env
# API Endpoints
EARTHQUAKE_API_URL=https://api.bmkg.go.id/earthquake
TSUNAMI_API_URL=https://api.bmkg.go.id/tsunami
MAGNETIC_API_URL=https://api.bmkg.go.id/magnetic

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_TAG_MANAGER_ID=GTM_ID

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

### 2. Update URLs
Update semua URL di file-file berikut:
- `manifest.json` - start_url dan scope
- `sitemap.xml` - semua URL
- `robots.txt` - sitemap URL
- `script.js` - API endpoints

### 3. SSL Certificate
```bash
# Let's Encrypt (Certbot)
sudo certbot --apache -d geofisika-mataram.bmkg.go.id

# Atau untuk Nginx
sudo certbot --nginx -d geofisika-mataram.bmkg.go.id
```

## 📊 Monitoring & Analytics

### 1. Google Analytics
Tambahkan ke `index.html` sebelum `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Monitoring (Sentry)
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production'
  });
</script>
```

### 3. Uptime Monitoring
Setup monitoring dengan:
- UptimeRobot
- Pingdom
- StatusCake

## 🔄 CI/CD Pipeline

### GitHub Actions
Buat `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🧪 Testing

### 1. Performance Testing
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

### 2. Security Testing
```bash
# Security headers
curl -I https://geofisika-mataram.bmkg.go.id

# SSL test
openssl s_client -connect geofisika-mataram.bmkg.go.id:443
```

### 3. PWA Testing
- Test di Chrome DevTools > Application > Service Workers
- Test offline functionality
- Test "Add to Home Screen"

## 📱 Mobile App (Optional)

### Cordova/PhoneGap
```bash
# Install Cordova
npm install -g cordova

# Create app
cordova create SGMApp com.bmkg.sgm "Stasiun Geofisika Mataram"
cd SGMApp

# Add platforms
cordova platform add android
cordova platform add ios

# Copy web assets
cp -r ../website/* www/

# Build
cordova build
```

## 🔐 Security Checklist

- [ ] HTTPS enabled dan configured
- [ ] Security headers implemented
- [ ] Content Security Policy configured
- [ ] Input validation implemented
- [ ] Error handling tidak expose sensitive info
- [ ] Regular security updates
- [ ] Backup strategy implemented

## 📈 Performance Optimization

### 1. Image Optimization
```bash
# Install imagemin
npm install -g imagemin-cli

# Optimize images
imagemin images/* --out-dir=images/optimized --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant
```

### 2. Code Minification
```bash
# CSS minification
npm install -g clean-css-cli
cleancss -o styles.min.css styles.css

# JavaScript minification
npm install -g terser
terser script.js -o script.min.js
```

### 3. CDN Setup
- Setup CloudFlare atau AWS CloudFront
- Configure caching rules
- Enable Brotli compression

## 🚨 Troubleshooting

### Common Issues

1. **Service Worker tidak register**
   - Pastikan HTTPS enabled
   - Check console errors
   - Verify sw.js path

2. **PWA tidak bisa di-install**
   - Validate manifest.json
   - Ensure HTTPS
   - Check icon requirements

3. **Performance issues**
   - Optimize images
   - Enable compression
   - Use CDN

### Logs Location
- Apache: `/var/log/apache2/error.log`
- Nginx: `/var/log/nginx/error.log`
- Browser: DevTools > Console

## 📞 Support

Untuk bantuan deployment:
- **Email**: webmaster@bmkg.go.id
- **Phone**: (021) 4246321
- **Documentation**: https://docs.bmkg.go.id

---

**Deployment Checklist Completed ✅**
- Website deployed dan accessible
- HTTPS configured
- PWA functionality working
- Analytics tracking active
- Monitoring setup complete