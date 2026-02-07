# ⚡ Quick Deployment Guide

## TL;DR - Fastest Way

### Local (Push to GitHub)

**Option 1: Using Script**
```bash
./deploy.sh local
# Enter commit message
# Done!
```

**Option 2: Manual**
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Hosting (Pull from GitHub)

**Option 1: Using Script**
```bash
ssh user@hosting.com
cd /path/to/project
./deploy.sh hosting
# Done!
```

**Option 2: Manual**
```bash
ssh user@hosting.com
cd /path/to/project
git pull origin main
```

---

## Step-by-Step (First Time)

### 1. Local Setup (One Time)

```bash
# Go to project
cd /path/to/bmkg-news

# Initialize git (if not already)
git init

# Add GitHub remote
git remote add origin git@github.com:your-username/your-repo.git

# Create .gitignore
echo ".env" >> .gitignore

# Initial commit
git add .
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
```

### 2. Hosting Setup (One Time)

```bash
# SSH to hosting
ssh user@hosting.com

# Go to project directory
cd /path/to/project

# Clone repository
git clone git@github.com:your-username/your-repo.git .

# Create .env with hosting credentials
nano .env
# Add:
# DB_HOST=localhost
# DB_NAME=hosting_db_name
# DB_USER=hosting_user
# DB_PASS=hosting_password

# Test connection
curl http://your-domain/api/test_db_connection.php
```

### 3. Regular Workflow

**Local:**
```bash
# Make changes
nano admin/admin-fixed.js

# Push to GitHub
./deploy.sh local
# or
git add .
git commit -m "Fix something"
git push origin main
```

**Hosting:**
```bash
# Pull latest
ssh user@hosting.com
cd /path/to/project
./deploy.sh hosting
# or
git pull origin main
```

---

## Common Commands

### Check Status
```bash
git status
```

### View Changes
```bash
git diff
```

### View Commit History
```bash
git log --oneline -5
```

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Discard Local Changes
```bash
git checkout -- .
```

---

## Troubleshooting

### "Permission denied (publickey)"
SSH key not configured. See `GITHUB_DEPLOYMENT_GUIDE.md`

### "fatal: not a git repository"
Not in git project. Run `git init` or `cd` to correct directory.

### ".env committed by mistake"
```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
git push origin main
```

### Database not connecting after pull
```bash
# SSH to hosting
ssh user@hosting.com
cd /path/to/project

# Check .env exists
cat .env

# Test connection
curl http://your-domain/api/test_db_connection.php
```

---

## Files

- `GITHUB_DEPLOYMENT_GUIDE.md` - Complete guide
- `deploy.sh` - Linux/Mac deployment script
- `deploy.bat` - Windows deployment script
- `ENV_SETUP_GUIDE.md` - Environment setup
- `DATABASE_CONNECTION_TROUBLESHOOTING.md` - Database issues

---

## Status
✅ READY - Quick deployment guide

---

**Date**: February 6, 2026
**Priority**: HIGH (deployment workflow)
