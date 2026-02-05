# 🔍 Cache Manager Debug Steps

## Problem
Cache manager returning empty response or HTML instead of JSON.

## Debug Steps

### Step 1: Run Debug Page
```
http://10.21.224.146/api/debug_cache_manager.php
```

**What to check:**
- ✅ cache_helper.php exists and loads
- ✅ cache() function works
- ✅ getStats() returns data
- ✅ clearExpired() works
- ✅ Cache directory exists and is writable

**If any step fails, note the error message.**

### Step 2: Test Simple Version
```
http://10.21.224.146/api/test_simple.php
```

**Test both versions:**
1. Click "Stats (Original)" - Test cache_manager.php
2. Click "Stats (Simple)" - Test cache_manager_simple.php

**Expected:**
- Simple version should work (✅ Success with JSON)
- Original version might fail

### Step 3: Test Direct API Call

**In browser, open:**
```
http://10.21.224.146/api/cache_manager_simple.php?action=stats
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "total_files": 0,
    "total_size": 0,
    "total_size_mb": 0,
    "cache_dir": "/tmp/bmkg_cache"
  }
}
```

### Step 4: Check PHP Errors

**If still getting errors, check Apache error log:**
```bash
tail -f /var/log/apache2/error.log
```

Then reload the page and watch for errors.

## Common Issues & Solutions

### Issue 1: Cache directory not writable
**Symptoms:** Permission denied errors

**Solution:**
```bash
sudo mkdir -p /tmp/bmkg_cache
sudo chmod 755 /tmp/bmkg_cache
sudo chown www-data:www-data /tmp/bmkg_cache
```

### Issue 2: Session errors
**Symptoms:** "Headers already sent" or session errors

**Solution:** Already fixed in cache_manager.php (session_start disabled)

### Issue 3: Output buffering issues
**Symptoms:** HTML mixed with JSON

**Solution:** Use cache_manager_simple.php which has better output control

### Issue 4: cache_helper.php not found
**Symptoms:** "Failed to open stream" or "require_once" errors

**Solution:**
```bash
# Check if file exists
ls -la /var/www/webmataram/api/cache_helper.php

# Check permissions
chmod 644 /var/www/webmataram/api/cache_helper.php
```

## Quick Fix: Use Simple Version

If original cache_manager.php still has issues, use the simple version:

### Update performance-monitor.html

**Find and replace:**
```javascript
// Change from:
fetch('api/cache_manager.php?action=stats')

// To:
fetch('api/cache_manager_simple.php?action=stats')
```

**Do this for all 4 occurrences:**
1. Line ~155: loadCacheStats()
2. Line ~171: clearAllCache()
3. Line ~185: clearExpiredCache()
4. Line ~199: clearNewsCache()

## Files Created for Debugging

1. ✅ `api/debug_cache_manager.php` - Step-by-step debug
2. ✅ `api/cache_manager_simple.php` - Simplified version (no dependencies)
3. ✅ `api/test_simple.php` - Compare both versions
4. ✅ `CACHE_DEBUG_STEPS.md` - This file

## Testing Checklist

- [ ] Run debug_cache_manager.php - All steps pass?
- [ ] Test cache_manager_simple.php - Returns JSON?
- [ ] Test direct API call in browser - Shows JSON?
- [ ] Check Apache error log - Any PHP errors?
- [ ] Test in performance-monitor.html - Works now?

## Next Steps

**If simple version works:**
1. Update performance-monitor.html to use cache_manager_simple.php
2. Test all cache operations
3. Done! ✅

**If simple version also fails:**
1. Check debug_cache_manager.php output
2. Check Apache error log
3. Verify cache directory permissions
4. Share error messages for further debugging

## Expected Results

### Debug Page (debug_cache_manager.php)
```
✅ cache_helper.php exists
✅ cache_helper.php loaded
✅ cache() function works
✅ getStats() works
✅ clearExpired() works
✅ Directory exists
✅ Writable: Yes
```

### Simple Test (test_simple.php)
```json
{
  "success": true,
  "data": {
    "total_files": 0,
    "total_size": 0,
    "total_size_mb": 0,
    "cache_dir": "/tmp/bmkg_cache"
  }
}
```

### Performance Monitor
```
✅ Cache cleared successfully
✅ Cleared X expired cache files
```

---

**Start with Step 1 and report what you see!**
