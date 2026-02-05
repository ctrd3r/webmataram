# 🚨 URGENT FIX - Config.php Corrupted!

## Problem Found!
Your `config.php` file is **CORRUPTED**! The opening PHP tag is broken:
- **Current**: `?php` (WRONG - missing `<`)
- **Should be**: `<?php` (CORRECT)

This is why NOTHING works - the entire file is treated as plain text instead of PHP code!

## Quick Fix (Choose ONE method)

### Method 1: Replace File via FTP/File Manager (EASIEST)
1. Download `api/config_fixed.php` from this project
2. Upload to server as `api/config.php` (replace existing file)
3. Done!

### Method 2: Edit via SSH/Terminal
```bash
cd /var/www/webmataram/api
cp config.php config.php.broken
cp config_fixed.php config.php
```

### Method 3: Edit via File Manager/cPanel
1. Open File Manager
2. Navigate to `/var/www/webmataram/api/`
3. Edit `config.php`
4. Change the FIRST line from `?php` to `<?php`
5. Save

### Method 4: Manual Edit (if you can access the file)
Open `config.php` and make sure the FIRST line is:
```php
<?php
```
NOT `?php` or ` <?php` (with space) or anything else!

## Verify Fix

After replacing the file, open in browser:
```
http://10.21.224.146/api/check_config.php
```

You should see:
- ✅ All constants defined (DB_HOST, DB_NAME, etc.)
- ✅ getDBConnection() function EXISTS
- ✅ Database class EXISTS

## Then Test Category Management

1. Open: `http://10.21.224.146/api/manage_categories.php?action=list`
   - Should return JSON with success: true

2. Open admin panel: `http://10.21.224.146/admin/index.html`
   - Login
   - Go to Kategori
   - Click "Tambah Kategori"
   - Add a category
   - Should work without errors!

## Why This Happened?

Possible causes:
1. File was edited in a text editor that corrupted the encoding
2. Copy-paste error when uploading
3. FTP transfer in wrong mode (should be ASCII/text mode for PHP files)
4. File was saved with BOM (Byte Order Mark) that corrupted the opening tag

## Prevention

When uploading PHP files:
- Use FTP in **ASCII/Text mode** (not Binary)
- Use UTF-8 encoding **without BOM**
- Don't edit PHP files in Windows Notepad (use Notepad++, VS Code, etc.)

---

**Status**: File `api/config_fixed.php` is ready to use - just replace your current config.php with it!
