@echo off
REM Backup Script untuk Stasiun Geofisika Mataram ke GitHub
REM Repository: https://github.com/ctrd3r/webmataram

echo.
echo ============================================================
echo 🏛️ Stasiun Geofisika Mataram - GitHub Backup Script
echo ============================================================
echo.

set REPO_URL=https://github.com/ctrd3r/webmataram.git

echo 📋 Checking project status...

REM Check if git is initialized
if not exist ".git" (
    echo ⚠️  Git not initialized. Initializing...
    git init
    if errorlevel 1 (
        echo ❌ Failed to initialize git
        pause
        exit /b 1
    )
    echo ✅ Git initialized
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Adding GitHub remote...
    git remote add origin %REPO_URL%
    if errorlevel 1 (
        echo ❌ Failed to add remote
        pause
        exit /b 1
    )
    echo ✅ Remote added: %REPO_URL%
) else (
    echo ✅ Remote already configured
)

REM Check if .gitignore exists
if not exist ".gitignore" (
    echo ⚠️  .gitignore not found. Creating...
    (
        echo # Dependencies
        echo node_modules/
        echo npm-debug.log*
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo.
        echo # IDE files
        echo .vscode/settings.json
        echo .idea/
        echo.
        echo # OS generated files
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Logs
        echo *.log
        echo.
        echo # Cache
        echo .cache/
        echo.
        echo # Generated favicon files (optional^)
        echo # icons/*.png
        echo # favicon.ico
    ) > .gitignore
    echo ✅ .gitignore created
)

echo.
echo 📦 Staging files for commit...

REM Add all files
git add .
if errorlevel 1 (
    echo ❌ Failed to stage files
    pause
    exit /b 1
)

REM Check if there are changes to commit
git diff --staged --quiet
if not errorlevel 1 (
    echo ⚠️  No changes to commit
    pause
    exit /b 0
)

echo.
echo 📊 Git status:
git status --short

REM Get current date for commit message
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set CURRENT_DATE=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set CURRENT_TIME=%%a:%%b
set DATETIME=%CURRENT_DATE% %CURRENT_TIME%

echo.
echo 💾 Creating commit...

REM Create comprehensive commit message
git commit -m "🔄 Backup: Stasiun Geofisika Mataram - %DATETIME%

✅ Project Status:
- Official BMKG website implementation
- Modern Jamstack architecture
- Real-time monitoring dashboard
- Official BMKG logo integration
- Complete PWA functionality
- Error handling improvements
- Responsive design with accessibility

🛠️ Technical Features:
- HTML5 + Modern CSS + Vanilla JavaScript
- Tailwind CSS styling framework
- Service Worker for offline functionality
- RESTful API integration ready
- Core Web Vitals optimized
- SEO with Schema.org markup

📚 Documentation:
- Complete setup guides
- API documentation
- Favicon generation tools
- Deployment instructions

🚀 Ready for production deployment"

if errorlevel 1 (
    echo ❌ Failed to create commit
    pause
    exit /b 1
)

echo ✅ Commit created successfully

echo.
echo 🚀 Pushing to GitHub...

REM Set main branch and push
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo.
    echo 💡 Troubleshooting:
    echo 1. Check your GitHub credentials
    echo 2. Ensure repository exists and you have write access
    echo 3. Try: git push --set-upstream origin main
    echo.
    pause
    exit /b 1
)

echo.
echo 🎉 Successfully backed up to GitHub!
echo 📍 Repository: %REPO_URL%
echo.
echo 🔗 Next steps:
echo 1. Visit: %REPO_URL%
echo 2. Generate favicons using provided tools
echo 3. Deploy to production environment
echo 4. Setup custom domain if needed
echo.
echo 🏛️ Stasiun Geofisika Mataram backup completed!

pause