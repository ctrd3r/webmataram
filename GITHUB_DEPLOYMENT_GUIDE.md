# 📤 GitHub Push & Pull Deployment Guide

## Overview
Panduan lengkap untuk push code ke GitHub dan pull di hosting menggunakan SSH key.

## Prerequisites

Pastikan sudah setup:
- ✅ Git installed (local)
- ✅ GitHub account
- ✅ SSH key configured (local)
- ✅ SSH key added to GitHub
- ✅ SSH access ke hosting
- ✅ Git installed di hosting

## Part 1: Local Setup (First Time Only)

### Step 1: Initialize Git Repository (jika belum ada)

```bash
cd /path/to/project
git init
```

### Step 2: Add Remote Repository

```bash
git remote add origin https://github.com/your-username/your-repo.git
# atau jika menggunakan SSH:
git remote add origin git@github.com:your-username/your-repo.git
```

### Step 3: Verify Remote

```bash
git remote -v
# Output:
# origin  git@github.com:your-username/your-repo.git (fetch)
# origin  git@github.com:your-username/your-repo.git (push)
```

### Step 4: Create `.gitignore`

```bash
cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.*.local

# Sensitive files
*.key
*.pem
config/secrets.php

# System files
.DS_Store
Thumbs.db
*.swp
*.swo

# IDE
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Dependencies
node_modules/
vendor/

# Logs
*.log
logs/

# Temporary files
tmp/
temp/
cache/

# Database backups
*.sql
!database/*.sql

# Uploads (optional, jika ingin exclude)
# images/uploads/
EOF
```

### Step 5: Initial Commit

```bash
git add .
git commit -m "Initial commit: BMKG News CMS"
```

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Part 2: Regular Development Workflow

### Step 1: Make Changes Locally

Edit files, add features, fix bugs, etc.

### Step 2: Check Status

```bash
git status
# Shows modified, added, deleted files
```

### Step 3: Stage Changes

```bash
# Stage specific file
git add path/to/file.php

# Stage all changes
git add .
```

### Step 4: Commit Changes

```bash
git commit -m "Descriptive message about changes"

# Examples:
# git commit -m "Fix edit news functionality"
# git commit -m "Add delete news feature"
# git commit -m "Update database configuration for .env support"
```

### Step 5: Push to GitHub

```bash
git push origin main
```

### Step 6: Verify on GitHub

Buka https://github.com/your-username/your-repo
Verifikasi commit muncul di repository.

## Part 3: Hosting Deployment (SSH)

### Step 1: SSH ke Hosting

```bash
ssh user@hosting-domain.com
# atau
ssh user@hosting-ip-address
```

### Step 2: Navigate ke Project Directory

```bash
cd /path/to/project
# Contoh:
# cd /home/username/public_html/bmkg-news
```

### Step 3: Check Git Status

```bash
git status
```

### Step 4: Pull Latest Changes

```bash
git pull origin main
```

### Step 5: Verify Changes

```bash
git log --oneline -5
# Shows last 5 commits
```

### Step 6: Update `.env` (jika diperlukan)

```bash
nano .env
# Edit database credentials untuk hosting
# Ctrl+X, Y, Enter untuk save
```

### Step 7: Test Connection

```bash
curl http://your-domain/api/test_db_connection.php
```

## Complete Workflow Example

### Local Machine

```bash
# 1. Make changes
nano admin/admin-fixed.js
# Edit file...

# 2. Check status
git status
# Output: modified: admin/admin-fixed.js

# 3. Stage changes
git add admin/admin-fixed.js

# 4. Commit
git commit -m "Fix edit news form API endpoint"

# 5. Push to GitHub
git push origin main
```

### Hosting (SSH)

```bash
# 1. SSH ke hosting
ssh user@hosting.com

# 2. Go to project
cd /home/user/public_html/bmkg-news

# 3. Pull changes
git pull origin main

# 4. Verify
git log --oneline -1
```

## Useful Git Commands

### View Commit History

```bash
# Last 5 commits
git log --oneline -5

# Detailed log
git log --oneline --graph --all

# Commits by specific file
git log --oneline path/to/file.php
```

### Check Differences

```bash
# Changes not staged
git diff

# Changes staged
git diff --staged

# Difference between commits
git diff commit1 commit2
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- path/to/file.php

# Unstage file
git reset HEAD path/to/file.php

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Branches

```bash
# List branches
git branch

# Create new branch
git branch feature/new-feature

# Switch branch
git checkout feature/new-feature

# Create and switch
git checkout -b feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

## Troubleshooting

### Issue 1: "Permission denied (publickey)"

**Cause**: SSH key not configured

**Solution**:
```bash
# Generate SSH key (local)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_rsa

# Copy public key to GitHub
cat ~/.ssh/id_rsa.pub
# Copy output to GitHub Settings → SSH Keys
```

### Issue 2: "fatal: not a git repository"

**Cause**: Not in git project directory

**Solution**:
```bash
# Check if .git exists
ls -la .git

# If not, initialize
git init

# Add remote
git remote add origin git@github.com:your-username/your-repo.git
```

### Issue 3: "Your branch is ahead of 'origin/main'"

**Cause**: Local commits not pushed

**Solution**:
```bash
git push origin main
```

### Issue 4: "Merge conflict"

**Cause**: Same file edited in different branches

**Solution**:
```bash
# View conflicts
git status

# Edit conflicted files manually
nano conflicted-file.php

# After fixing, stage and commit
git add conflicted-file.php
git commit -m "Resolve merge conflict"
```

### Issue 5: ".env file committed accidentally"

**Cause**: .env not in .gitignore

**Solution**:
```bash
# Remove from git (but keep local file)
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit
git add .gitignore
git commit -m "Remove .env from git tracking"

# Push
git push origin main
```

## Best Practices

### 1. Commit Messages
```bash
# Good
git commit -m "Fix edit news form API endpoint"
git commit -m "Add delete news functionality"
git commit -m "Update database config for .env support"

# Bad
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### 2. Commit Frequency
- Commit frequently (multiple times per day)
- One feature per commit
- Don't commit broken code

### 3. Before Pushing
```bash
# Always pull first
git pull origin main

# Resolve conflicts if any
# Then push
git push origin main
```

### 4. Protect Main Branch
- Use pull requests for code review
- Don't push directly to main
- Use feature branches

### 5. Backup Before Pull
```bash
# On hosting, backup before pull
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Then pull
git pull origin main
```

## Deployment Checklist

### Before Pushing to GitHub
- [ ] All changes tested locally
- [ ] No sensitive data in code
- [ ] .env file NOT committed
- [ ] Commit message is descriptive
- [ ] No broken code

### Before Pulling on Hosting
- [ ] SSH access working
- [ ] Git installed on hosting
- [ ] Remote repository configured
- [ ] Backup created
- [ ] .env file exists on hosting

### After Pulling on Hosting
- [ ] No errors during pull
- [ ] Database connection works
- [ ] API endpoints respond
- [ ] Admin panel loads
- [ ] Test page shows ✅

## Quick Reference

### Local Development
```bash
# Make changes
nano file.php

# Stage and commit
git add .
git commit -m "Description"

# Push to GitHub
git push origin main
```

### Hosting Deployment
```bash
# SSH to hosting
ssh user@hosting.com

# Go to project
cd /path/to/project

# Pull latest
git pull origin main

# Verify
curl http://your-domain/api/test_db_connection.php
```

## Status
✅ COMPLETED - GitHub deployment guide

---

**Date**: February 6, 2026
**Priority**: HIGH (deployment workflow)
**Impact**: Streamlined development and deployment process
