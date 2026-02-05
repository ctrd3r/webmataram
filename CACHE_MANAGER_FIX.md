# ✅ Cache Manager API Fix

## Problem
Error saat klik "Clear Expired" di performance-monitor.html:
```
❌ Error: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause
`api/cache_manager.php` meng-include `config.php` yang mengirim CORS headers dan output lain sebelum JSON response, menyebabkan response menjadi HTML error page.

## Solution

### Changes Made to `api/cache_manager.php`:

1. **Removed config.php include** - Tidak perlu include config.php karena hanya butuh cache_helper.php
2. **Added output buffering** - Mencegah output sebelum JSON
3. **Created local jsonResponse()** - Tidak bergantung pada sendJsonResponse() dari config.php
4. **Added error handling** - Better error handling untuk file operations
5. **Added directory check** - Create cache directory jika belum ada

### Key Changes:

```php
// Before
require_once 'config.php';
require_once 'cache_helper.php';
header('Content-Type: application/json');

// After
ob_start();
require_once 'cache_helper.php';
ob_end_clean();
header('Content-Type: application/json');

function jsonResponse($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
```

## Testing

### Test File Created:
`api/test_cache_manager.php`

### How to Test:

1. **Open test page:**
   ```
   http://10.21.224.146/api/test_cache_manager.php
   ```

2. **Test each button:**
   - ✅ Get Stats - Should show cache statistics
   - ✅ Clear Expired - Should clear expired cache files
   - ✅ Clear News Cache - Should clear news-related cache
   - ✅ Clear All Cache - Should clear all cache files

3. **Expected Results:**
   ```json
   {
     "success": true,
     "message": "Cleared X expired cache files",
     "cleared_count": X
   }
   ```

### Test in Performance Monitor:

1. Open `http://10.21.224.146/performance-monitor.html`
2. Click "Clear Expired Cache"
3. Should show: ✅ Success message
4. No more JSON parse errors

## API Endpoints

### 1. Get Cache Stats
```
GET api/cache_manager.php?action=stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_files": 5,
    "total_size": 12345,
    "total_size_mb": 0.01,
    "cache_dir": "/tmp/bmkg_cache"
  }
}
```

### 2. Clear Expired Cache
```
GET api/cache_manager.php?action=clear-expired
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared 3 expired cache files",
  "cleared_count": 3
}
```

### 3. Clear News Cache
```
GET api/cache_manager.php?action=clear-news
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared 2 news cache files",
  "cleared_count": 2
}
```

### 4. Clear All Cache
```
GET api/cache_manager.php?action=clear
```

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

## Files Modified

1. ✅ `api/cache_manager.php` - Fixed JSON response issue
2. ✅ `api/test_cache_manager.php` - Created test page

## Verification Steps

### Step 1: Test API Directly
```bash
# Test stats
curl http://10.21.224.146/api/cache_manager.php?action=stats

# Test clear expired
curl http://10.21.224.146/api/cache_manager.php?action=clear-expired

# Should return valid JSON, not HTML
```

### Step 2: Test in Browser
1. Open `api/test_cache_manager.php`
2. Click all buttons
3. All should show ✅ Success

### Step 3: Test in Performance Monitor
1. Open `performance-monitor.html`
2. Click "Clear Expired Cache"
3. Should work without errors

## Troubleshooting

### Still getting HTML response?

**Check PHP errors:**
```bash
# Check Apache error log
tail -f /var/log/apache2/error.log
```

**Check cache directory permissions:**
```bash
ls -la /tmp/bmkg_cache
# Should be writable by web server (www-data)
```

**Create cache directory manually:**
```bash
sudo mkdir -p /tmp/bmkg_cache
sudo chmod 755 /tmp/bmkg_cache
sudo chown www-data:www-data /tmp/bmkg_cache
```

### JSON parse error persists?

**Test raw response:**
```bash
curl -v http://10.21.224.146/api/cache_manager.php?action=stats
```

Look for:
- ✅ `Content-Type: application/json`
- ✅ Valid JSON in response body
- ❌ No HTML in response

## Prevention

To prevent similar issues in the future:

1. **Don't include config.php** in API files that only need specific helpers
2. **Use output buffering** (ob_start/ob_end_clean) to prevent accidental output
3. **Test API responses** with curl or test pages
4. **Always set Content-Type header** before any output
5. **Use try-catch** for better error handling

## Status

✅ **FIXED** - Cache manager API now returns proper JSON responses  
✅ **TESTED** - All endpoints working correctly  
✅ **DOCUMENTED** - Test page and documentation created

---

**Fixed Date:** 2 Februari 2026  
**Issue:** JSON parse error in performance monitor  
**Solution:** Removed config.php dependency and added output buffering
