# 🔍 Database Connection Troubleshooting Guide

## Quick Diagnosis

### Step 1: Test Database Connection
Buka di browser: `http://your-domain/api/test_db_connection.php`

Ini akan menampilkan:
- ✅ .env file status
- ✅ Configuration values
- ✅ PDO connection test
- ✅ MySQLi connection test
- ✅ Database info (version, size, tables)

## Common Issues & Solutions

### Issue 1: "Connection error: SQLSTATE[HY000]"

**Cause**: Database server tidak bisa diakses

**Solutions**:
1. Verifikasi database server running:
   ```bash
   # Linux/Mac
   sudo systemctl status mysql
   
   # Windows
   services.msc (cari MySQL)
   ```

2. Cek `.env` file ada:
   ```bash
   ls -la .env
   ```

3. Verifikasi DB_HOST di `.env`:
   - Localhost: `DB_HOST=localhost`
   - IP address: `DB_HOST=192.168.1.100`
   - Domain: `DB_HOST=db.example.com`

4. Test koneksi manual:
   ```bash
   mysql -h DB_HOST -u DB_USER -p DB_NAME
   ```

### Issue 2: "Access denied for user 'root'@'localhost'"

**Cause**: Username atau password salah

**Solutions**:
1. Verifikasi credentials di `.env`:
   ```bash
   cat .env | grep DB_
   ```

2. Test dengan mysql client:
   ```bash
   mysql -h localhost -u root -p
   ```

3. Jika lupa password, reset:
   ```bash
   # Stop MySQL
   sudo systemctl stop mysql
   
   # Start without password
   sudo mysqld_safe --skip-grant-tables &
   
   # Connect
   mysql -u root
   
   # Reset password
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   EXIT;
   
   # Restart MySQL
   sudo systemctl restart mysql
   ```

4. Update `.env` dengan password baru:
   ```
   DB_PASS=new_password
   ```

### Issue 3: "Unknown database 'db_berita'"

**Cause**: Database tidak ada

**Solutions**:
1. Verifikasi database ada:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

2. Jika tidak ada, create database:
   ```bash
   mysql -u root -p
   CREATE DATABASE db_berita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

3. Import database schema:
   ```bash
   mysql -u root -p db_berita < database/db_berita.sql
   ```

4. Verifikasi tables:
   ```bash
   mysql -u root -p db_berita
   SHOW TABLES;
   ```

### Issue 4: ".env file not found"

**Cause**: File `.env` tidak ada di root project

**Solutions**:
1. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit dengan credentials:
   ```bash
   nano .env
   ```

3. Verifikasi file ada:
   ```bash
   ls -la .env
   ```

4. Pastikan di root project, bukan di subdirectory:
   ```bash
   pwd
   # Should show project root
   ls -la .env
   # Should show .env file
   ```

### Issue 5: "Permission denied" reading .env

**Cause**: File permissions tidak benar

**Solutions**:
1. Check permissions:
   ```bash
   ls -la .env
   ```

2. Fix permissions:
   ```bash
   chmod 644 .env
   ```

3. Verify:
   ```bash
   ls -la .env
   # Should show: -rw-r--r--
   ```

### Issue 6: Database connection works locally but not on hosting

**Cause**: Different credentials atau environment

**Solutions**:
1. SSH ke hosting dan check `.env`:
   ```bash
   ssh user@hosting
   cat .env
   ```

2. Verify database credentials di hosting:
   ```bash
   mysql -h localhost -u hosting_user -p hosting_db
   ```

3. Update `.env` dengan hosting credentials:
   ```bash
   nano .env
   ```

4. Test connection:
   ```bash
   curl http://your-domain/api/test_db_connection.php
   ```

## Environment-Specific Setup

### Local Development
```
.env:
DB_HOST=localhost
DB_NAME=db_berita
DB_USER=root
DB_PASS=
```

### Hosting (cPanel/Plesk)
```
.env:
DB_HOST=localhost
DB_NAME=cpanel_username_db_berita
DB_USER=cpanel_username_user
DB_PASS=generated_password
```

### Hosting (VPS/Dedicated)
```
.env:
DB_HOST=localhost
DB_NAME=db_berita
DB_USER=db_user
DB_PASS=secure_password
```

### Remote Database
```
.env:
DB_HOST=db.example.com
DB_NAME=db_berita
DB_USER=remote_user
DB_PASS=remote_password
```

## Verification Checklist

After fixing connection issue:

- [ ] `.env` file exists in root project
- [ ] `.env` has correct DB_HOST, DB_NAME, DB_USER, DB_PASS
- [ ] Database server is running
- [ ] Database exists
- [ ] Database user has correct permissions
- [ ] Test page shows ✅ for both PDO and MySQLi
- [ ] API endpoints work (test with test files)
- [ ] Admin panel loads without errors

## Debug Mode

Enable debug mode in `.env`:
```
APP_DEBUG=true
```

This will show detailed error messages (only for development).

For production, disable:
```
APP_DEBUG=false
```

## Getting Help

If still having issues:

1. Run test page: `api/test_db_connection.php`
2. Check error message
3. Verify `.env` file
4. Check database server status
5. Review logs:
   ```bash
   # MySQL error log
   tail -f /var/log/mysql/error.log
   
   # PHP error log
   tail -f /var/log/php-fpm.log
   ```

## Status
✅ COMPLETED - Database connection troubleshooting guide

---

**Date**: February 6, 2026
**Priority**: HIGH (critical for functionality)
**Impact**: Quick diagnosis and resolution of database issues
