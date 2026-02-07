# 🔧 Environment Configuration (.env) Setup Guide

## Overview
Project sekarang menggunakan `.env` file untuk menyimpan kredensial database dan konfigurasi aplikasi. Ini lebih aman dan fleksibel untuk berbagai environment (development, staging, production).

## File Structure

### `.env.example`
Template file yang menunjukkan semua variable yang diperlukan. **Jangan commit ke git**.

### `.env`
File actual yang berisi kredensial untuk environment saat ini. **Jangan commit ke git**.

### `api/config.php`
File konfigurasi yang membaca `.env` dan menggunakan nilai-nilainya.

## Setup Instructions

### 1. Local Development (Localhost)

**File: `.env`**
```
DB_HOST=localhost
DB_NAME=db_berita
DB_USER=root
DB_PASS=

APP_ENV=development
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
```

**Langkah:**
1. Copy `.env.example` ke `.env`
2. Edit `.env` dengan kredensial database lokal Anda
3. Simpan file

### 2. Production (Hosting via SSH)

**File: `.env` (di hosting)**
```
DB_HOST=localhost
DB_NAME=db_berita_prod
DB_USER=bmkg_user
DB_PASS=your_secure_password_here

APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
```

**Langkah:**
1. SSH ke hosting
2. Buat file `.env` di root project:
   ```bash
   nano .env
   ```
3. Paste konfigurasi production
4. Ganti kredensial dengan yang sesuai
5. Save (Ctrl+X, Y, Enter)

### 3. Staging (Optional)

**File: `.env` (di staging)**
```
DB_HOST=localhost
DB_NAME=db_berita_staging
DB_USER=bmkg_staging
DB_PASS=staging_password

APP_ENV=staging
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
```

## Environment Variables

### Database Configuration
- **DB_HOST**: Database server address (localhost, IP, atau domain)
- **DB_NAME**: Database name
- **DB_USER**: Database username
- **DB_PASS**: Database password (kosong jika tidak ada)

### Application Settings
- **APP_ENV**: Environment type (development, staging, production)
- **APP_DEBUG**: Debug mode (true/false)
- **APP_TIMEZONE**: Timezone (Asia/Jakarta)

## How It Works

### Loading Process
1. `api/config.php` mencari file `.env` di root project
2. Jika ditemukan, parse setiap baris `KEY=VALUE`
3. Set sebagai environment variable menggunakan `putenv()`
4. Gunakan `getenv()` untuk membaca nilai

### Fallback Values
Jika `.env` tidak ada atau variable tidak ditemukan, gunakan default:
```php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'db_berita');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
```

## Git Configuration

### `.gitignore`
Pastikan `.env` sudah di `.gitignore` agar tidak ter-commit:

```
# Environment variables
.env
.env.local
.env.*.local

# Sensitive files
*.key
*.pem
```

### Commit hanya `.env.example`
```bash
git add .env.example
git commit -m "Add .env.example template"
```

## Troubleshooting

### Database Connection Error

**Problem**: "Connection error: SQLSTATE[HY000]"

**Solution**:
1. Cek `.env` file ada di root project
2. Verifikasi kredensial di `.env`:
   ```bash
   cat .env
   ```
3. Test koneksi database:
   ```bash
   mysql -h DB_HOST -u DB_USER -p DB_NAME
   ```
4. Pastikan database server running

### Wrong Credentials

**Problem**: "Access denied for user 'root'@'localhost'"

**Solution**:
1. Cek username dan password di `.env`
2. Verifikasi user ada di database:
   ```bash
   mysql -u root -p
   SELECT user, host FROM mysql.user;
   ```
3. Update `.env` dengan kredensial yang benar

### File Not Found

**Problem**: ".env file not found"

**Solution**:
1. Pastikan `.env` di root project (bukan di subdirectory)
2. Check file permissions:
   ```bash
   ls -la .env
   ```
3. Pastikan readable:
   ```bash
   chmod 644 .env
   ```

## Deployment Checklist

### Before Deploying to Hosting

- [ ] Create `.env` file di hosting dengan kredensial production
- [ ] Verify database credentials
- [ ] Test database connection
- [ ] Set correct file permissions (644 for .env)
- [ ] Verify `.env` is in `.gitignore`
- [ ] Don't commit `.env` to git

### After Deploying

- [ ] Test API endpoints
- [ ] Check database queries work
- [ ] Verify error logs
- [ ] Monitor application

## Security Best Practices

1. **Never commit `.env` to git**
   - Add to `.gitignore`
   - Use `.env.example` as template

2. **Protect `.env` file**
   - Set permissions: `chmod 600 .env`
   - Only readable by owner

3. **Use strong passwords**
   - Generate secure password for production
   - Use different password for each environment

4. **Rotate credentials regularly**
   - Change database password periodically
   - Update `.env` accordingly

5. **Monitor access**
   - Check who has access to `.env`
   - Audit file changes

## Example Scenarios

### Scenario 1: Local Development
```
.env (localhost credentials)
↓
api/config.php reads .env
↓
Database connects to localhost
↓
Development works
```

### Scenario 2: Production Deployment
```
1. Push code to GitHub (without .env)
2. SSH to hosting
3. Create .env with production credentials
4. Pull code from GitHub
5. api/config.php reads .env
6. Database connects to production server
7. Application works
```

### Scenario 3: Multiple Environments
```
Local:
.env → DB_USER=root, DB_PASS=''

Staging:
.env → DB_USER=bmkg_staging, DB_PASS=staging_pass

Production:
.env → DB_USER=bmkg_prod, DB_PASS=secure_password
```

## Status
✅ COMPLETED - Environment configuration system implemented

---

**Date**: February 6, 2026
**Priority**: HIGH (security and flexibility)
**Impact**: Secure credential management across environments
