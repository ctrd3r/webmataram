# ✅ Fix: Slug Generation for News

## Problem
Error saat menambahkan berita baru:
```
Error: Gagal menambahkan berita: Field 'slug' doesn't have a default value
```

## Root Cause
- Database field `slug` tidak punya nilai default
- API `manage_news.php` tidak generate slug saat insert
- Slug diperlukan untuk URL SEO-friendly (detail-berita.html?slug=xxx)

## Solution Applied

### 1. Added Automatic Slug Generation
✅ Function `generateSlug()` - Generate slug dari judul
✅ Function `slugExists()` - Cek apakah slug sudah ada
✅ Auto-increment jika slug duplicate (slug-1, slug-2, dst)

### 2. Updated addNews() Function
✅ Generate slug otomatis dari judul
✅ Insert slug ke database
✅ Return slug di response

### 3. Updated updateNews() Function
✅ Regenerate slug jika judul berubah
✅ Skip slug generation jika judul tidak berubah
✅ Exclude current ID saat cek duplicate

## How Slug Generation Works

### Example 1: Simple Title
```
Input:  "Gempa Bumi Magnitudo 5.2"
Output: "gempa-bumi-magnitudo-52"
```

### Example 2: Special Characters
```
Input:  "Prakiraan Cuaca: Hujan Lebat!"
Output: "prakiraan-cuaca-hujan-lebat"
```

### Example 3: Duplicate Slug
```
Input:  "Gempa Bumi" (already exists)
Output: "gempa-bumi-1"

Input:  "Gempa Bumi" (exists again)
Output: "gempa-bumi-2"
```

### Example 4: Indonesian Characters
```
Input:  "Informasi Terkini"
Output: "informasi-terkini"
```

## Slug Generation Rules

1. **Lowercase**: Convert semua ke huruf kecil
2. **Remove Special Chars**: Hapus karakter khusus (!@#$%^&*()+=[]{}|;:'",.<>?/)
3. **Replace Spaces**: Ganti spasi dengan hyphen (-)
4. **Remove Multiple Hyphens**: Ganti --- dengan -
5. **Trim Hyphens**: Hapus hyphen di awal/akhir
6. **Check Duplicate**: Tambah angka jika sudah ada

## Code Changes

### File: `api/manage_news.php`

#### New Functions Added:
```php
generateSlug($title, $conn, $excludeId = null)
slugExists($slug, $conn, $excludeId = null)
```

#### Modified Functions:
```php
addNews($conn)      // Now generates slug
updateNews($conn)   // Now regenerates slug if title changes
```

## Testing

### Test Add News:
1. Buka admin panel
2. Klik "Tambah Berita"
3. Isi form:
   - Judul: "Test Berita Baru"
   - Kategori: Pilih kategori
   - Isi: "Konten berita..."
   - Status: Draft/Publish
4. Klik "Simpan"
5. ✅ Harus berhasil tanpa error
6. Check slug di database: `test-berita-baru`

### Test Duplicate Slug:
1. Tambah berita dengan judul sama
2. Slug harus auto-increment: `test-berita-baru-1`

### Test Update News:
1. Edit berita yang sudah ada
2. Ubah judul: "Test Berita Updated"
3. Klik "Update"
4. ✅ Slug harus berubah: `test-berita-updated`

### Test Special Characters:
1. Tambah berita dengan judul: "Cuaca: Hujan Lebat!!!"
2. Slug harus: `cuaca-hujan-lebat`

## Benefits

### For SEO:
✅ URL-friendly slugs (no spaces, special chars)
✅ Readable URLs: `/detail-berita.html?slug=gempa-bumi-magnitudo-52`
✅ Better search engine indexing

### For Users:
✅ Easy to share URLs
✅ Memorable URLs
✅ Professional looking URLs

### For Developers:
✅ Automatic slug generation (no manual input)
✅ Duplicate handling (auto-increment)
✅ Consistent slug format

## Database Impact

### Before:
```sql
INSERT INTO berita (judul, isi_berita, ...) VALUES (?, ?, ...);
-- ERROR: Field 'slug' doesn't have a default value
```

### After:
```sql
INSERT INTO berita (judul, slug, isi_berita, ...) VALUES (?, ?, ?, ...);
-- SUCCESS: slug = 'gempa-bumi-magnitudo-52'
```

## API Response Changes

### Add News Response (Before):
```json
{
  "success": true,
  "message": "Berita berhasil ditambahkan",
  "data": {
    "id_berita": 123
  }
}
```

### Add News Response (After):
```json
{
  "success": true,
  "message": "Berita berhasil ditambahkan",
  "data": {
    "id_berita": 123,
    "slug": "gempa-bumi-magnitudo-52"
  }
}
```

## Edge Cases Handled

### 1. Empty Title
- Validation: "Judul harus diisi"
- No slug generation

### 2. Very Long Title
- Slug will be long but valid
- No length limit (database allows 255 chars)

### 3. Title with Only Special Characters
- Example: "!@#$%^&*()"
- Result: Empty slug → Will fail validation
- Should add validation for this case

### 4. Duplicate Slugs
- Auto-increment: slug-1, slug-2, etc.
- No conflicts

### 5. Update Without Title Change
- Slug remains the same
- No unnecessary regeneration

## Future Improvements

### Optional Enhancements:
- [ ] Add max slug length (e.g., 100 chars)
- [ ] Add slug preview in admin form
- [ ] Allow manual slug editing
- [ ] Add slug history (track old slugs for redirects)
- [ ] Add slug validation (min length, format)

### Recommended:
- [ ] Add validation for empty slug result
- [ ] Add slug to admin news list display
- [ ] Add "Copy URL" button in admin

## Files Modified
- `api/manage_news.php` - Added slug generation

## Related Files
- `detail-berita.html` - Uses slug in URL
- `detail-berita.js` - Reads slug from URL
- `api/get_news_detail.php` - Queries by slug

---

**Status**: ✅ FIXED
**Issue**: Field 'slug' doesn't have a default value
**Solution**: Automatic slug generation from title
**Priority**: HIGH (blocking add news functionality)
