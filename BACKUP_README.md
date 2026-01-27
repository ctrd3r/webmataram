# 🏛️ Stasiun Geofisika Mataram - GitHub Backup

## 🎯 Quick Backup

### Automatic Backup (Recommended)

**For Linux/Mac:**
```bash
chmod +x backup-to-github.sh
./backup-to-github.sh
```

**For Windows:**
```cmd
backup-to-github.bat
```

### Manual Backup

```bash
# 1. Initialize git (if needed)
git init

# 2. Add GitHub remote
git remote add origin https://github.com/ctrd3r/webmataram.git

# 3. Stage all files
git add .

# 4. Commit with message
git commit -m "🏛️ Backup: Stasiun Geofisika Mataram"

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

## 📁 What Gets Backed Up

### ✅ Core Files
- `index.html` - Main website
- `styles.css` - Modern CSS architecture
- `script.js` - JavaScript functionality
- `manifest.json` - PWA configuration
- `sw.js` - Service Worker

### ✅ Documentation
- `README.md` - Project documentation
- `DEPLOYMENT.md` - Deployment guide
- `API_DOCUMENTATION.md` - API docs
- `FAVICON_GENERATION.md` - Favicon guide
- All implementation guides

### ✅ Tools & Utilities
- `generate-favicons.html` - Favicon generator
- `download-official-logo.html` - Logo tool
- Validation and utility scripts

### ✅ Configuration
- `package.json` - Dependencies
- `tailwind.config.js` - Tailwind config
- `.github/workflows/deploy.yml` - CI/CD
- All config files

## 🚀 After Backup

1. **Visit Repository**: https://github.com/ctrd3r/webmataram
2. **Generate Favicons**: Use provided tools
3. **Deploy**: Follow deployment guide
4. **Test**: Verify all functionality

## 🆘 Troubleshooting

**Authentication Issues:**
- Use GitHub Personal Access Token
- Configure Git credentials properly

**Push Rejected:**
- Check repository permissions
- Ensure you own the repository

**Large Files:**
- Review .gitignore exclusions
- Use Git LFS if needed

---

**Repository**: https://github.com/ctrd3r/webmataram  
**Status**: Ready for backup 🚀