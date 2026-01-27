#!/bin/bash

# Backup Script untuk Stasiun Geofisika Mataram ke GitHub
# Repository: https://github.com/ctrd3r/webmataram

echo "🏛️ Stasiun Geofisika Mataram - GitHub Backup Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository URL
REPO_URL="https://github.com/ctrd3r/webmataram.git"

echo -e "${BLUE}📋 Checking project status...${NC}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Adding GitHub remote...${NC}"
    git remote add origin $REPO_URL
    echo -e "${GREEN}✅ Remote added: $REPO_URL${NC}"
else
    echo -e "${GREEN}✅ Remote already configured${NC}"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}⚠️  .gitignore not found. Creating...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local

# IDE files
.vscode/settings.json
.idea/

# OS generated files
.DS_Store
Thumbs.db

# Logs
*.log

# Cache
.cache/

# Generated favicon files (optional)
# icons/*.png
# favicon.ico
EOF
    echo -e "${GREEN}✅ .gitignore created${NC}"
fi

echo -e "${BLUE}📦 Staging files for commit...${NC}"

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    exit 0
fi

# Show status
echo -e "${BLUE}📊 Git status:${NC}"
git status --short

# Get current date for commit message
CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Create comprehensive commit message
COMMIT_MESSAGE="🔄 Backup: Stasiun Geofisika Mataram - $CURRENT_DATE

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

echo -e "${BLUE}💾 Creating commit...${NC}"
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create commit${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"

# Set main branch and push
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Successfully backed up to GitHub!${NC}"
    echo -e "${GREEN}📍 Repository: $REPO_URL${NC}"
    echo ""
    echo -e "${BLUE}🔗 Next steps:${NC}"
    echo "1. Visit: $REPO_URL"
    echo "2. Generate favicons using provided tools"
    echo "3. Deploy to production environment"
    echo "4. Setup custom domain if needed"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    echo -e "${YELLOW}💡 Troubleshooting:${NC}"
    echo "1. Check your GitHub credentials"
    echo "2. Ensure repository exists and you have write access"
    echo "3. Try: git push --set-upstream origin main"
    exit 1
fi

echo ""
echo -e "${GREEN}🏛️ Stasiun Geofisika Mataram backup completed!${NC}"