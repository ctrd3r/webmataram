# 🚀 SEO Quick Setup Guide

## Step 1: Update Configuration (5 mins)

### Update Base URL

**File: `api/generate_sitemap.php` (Line 11)**
```php
$baseUrl = 'https://yourdomain.com';  // Change to your actual domain
```

**File: `seo-helper.js` (Line 8)**
```javascript
this.siteUrl = 'https://yourdomain.com';  // Change to your actual domain
```

### Update Social Media (Optional)

**File: `seo-helper.js` (Line 10)**
```javascript
this.twitterHandle = '@infoBMKG';  // Your Twitter handle
```

**File: `seo-helper.js` (Lines 180-185)**
```javascript
"sameAs": [
    "https://www.facebook.com/yourpage",
    "https://twitter.com/yourhandle",
    "https://www.instagram.com/yourhandle",
    "https://www.youtube.com/yourchannel"
]
```

---

## Step 2: Test Implementation (10 mins)

### Test 1: Check Meta Tags
```
http://10.21.224.146/detail-berita.html?slug=gempa-bumi-magnitudo-52-guncang-jawa-barat
```
- Right-click → View Page Source
- Look for `<meta property="og:` tags
- Look for `<meta name="twitter:` tags

### Test 2: Validate Structured Data
```
https://search.google.com/test/rich-results
```
- Enter your page URL
- Should show: NewsArticle, BreadcrumbList, Organization

### Test 3: Check Sitemap
```
http://10.21.224.146/api/generate_sitemap.php
```
- Should show XML with all pages
- Validate at: https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## Step 3: Submit to Search Engines (15 mins)

### Google Search Console

**1. Add Property:**
- Go to: https://search.google.com/search-console
- Click "Add Property"
- Enter your domain
- Verify ownership (HTML file or DNS)

**2. Submit Sitemap:**
- Go to "Sitemaps" in left menu
- Enter: `https://yourdomain.com/api/generate_sitemap.php`
- Click "Submit"

**3. Request Indexing:**
- Go to "URL Inspection"
- Enter your homepage URL
- Click "Request Indexing"

### Bing Webmaster Tools

**1. Add Site:**
- Go to: https://www.bing.com/webmasters
- Click "Add a site"
- Enter your domain
- Verify ownership

**2. Submit Sitemap:**
- Go to "Sitemaps"
- Enter sitemap URL
- Click "Submit"

---

## Step 4: Test Social Sharing (5 mins)

### Facebook Debugger
```
https://developers.facebook.com/tools/debug/
```
- Enter your page URL
- Click "Debug"
- Should show: Title, Description, Image
- Click "Scrape Again" if needed

### Twitter Card Validator
```
https://cards-dev.twitter.com/validator
```
- Enter your page URL
- Should show: Summary Card with Large Image

### LinkedIn Post Inspector
```
https://www.linkedin.com/post-inspector/
```
- Enter your page URL
- Should show: Title, Description, Image

---

## Checklist

### Configuration:
- [ ] Updated base URL in `generate_sitemap.php`
- [ ] Updated base URL in `seo-helper.js`
- [ ] Updated social media links (optional)

### Testing:
- [ ] Meta tags visible in page source
- [ ] Structured data validates in Rich Results Test
- [ ] Sitemap generates correctly
- [ ] Facebook preview looks good
- [ ] Twitter card displays correctly

### Submission:
- [ ] Added site to Google Search Console
- [ ] Submitted sitemap to Google
- [ ] Requested indexing for homepage
- [ ] Added site to Bing Webmaster Tools
- [ ] Submitted sitemap to Bing

---

## Expected Timeline

**Week 1:**
- Search engines discover your site
- Sitemap processed
- Initial indexing begins

**Week 2-4:**
- More pages indexed
- Rich snippets may appear
- Organic traffic starts

**Month 2-3:**
- Full indexing complete
- Rankings improve
- 20-50% traffic increase

---

## Quick Troubleshooting

### Meta tags not showing?
- Clear browser cache
- Check JavaScript console for errors
- Verify `seo-helper.js` is loaded

### Structured data errors?
- Test at: https://search.google.com/test/rich-results
- Check date formats (ISO 8601)
- Verify all required fields present

### Sitemap not working?
- Check database connection
- Verify base URL is correct
- Check PHP error log

---

## Support Resources

**Tools:**
- Google Search Console: https://search.google.com/search-console
- Rich Results Test: https://search.google.com/test/rich-results
- Facebook Debugger: https://developers.facebook.com/tools/debug/

**Documentation:**
- Full guide: `SEO_IMPLEMENTATION_COMPLETE.md`
- Schema.org: https://schema.org/
- Open Graph: https://ogp.me/

---

**Total Setup Time:** ~30 minutes  
**Maintenance:** Minimal (automatic)  
**Expected Impact:** 20-50% traffic increase in 2-3 months

✅ **Ready to go!**
