#!/bin/bash

# BMKG News CMS - Deployment Helper Script
# Usage: ./deploy.sh [local|hosting]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_success "Git is installed"
}

# Check git status
check_status() {
    print_header "Checking Git Status"
    
    if [ -z "$(git status --porcelain)" ]; then
        print_success "Working directory is clean"
    else
        print_warning "Working directory has uncommitted changes:"
        git status --short
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
}

# Local deployment (push to GitHub)
deploy_local() {
    print_header "Local Deployment - Push to GitHub"
    
    check_git
    check_status
    
    # Get commit message
    echo ""
    read -p "Enter commit message: " commit_msg
    
    if [ -z "$commit_msg" ]; then
        print_error "Commit message cannot be empty"
        exit 1
    fi
    
    # Stage changes
    print_info "Staging changes..."
    git add .
    print_success "Changes staged"
    
    # Commit
    print_info "Creating commit..."
    git commit -m "$commit_msg"
    print_success "Commit created"
    
    # Push
    print_info "Pushing to GitHub..."
    git push origin main
    print_success "Pushed to GitHub"
    
    # Show latest commit
    echo ""
    print_info "Latest commit:"
    git log --oneline -1
    
    print_success "Local deployment completed!"
}

# Hosting deployment (pull from GitHub)
deploy_hosting() {
    print_header "Hosting Deployment - Pull from GitHub"
    
    check_git
    
    # Backup
    print_info "Creating backup..."
    backup_file="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "$backup_file" . --exclude=.git --exclude=node_modules --exclude=.env
    print_success "Backup created: $backup_file"
    
    # Pull
    print_info "Pulling from GitHub..."
    git pull origin main
    print_success "Pulled from GitHub"
    
    # Show latest commit
    echo ""
    print_info "Latest commit:"
    git log --oneline -1
    
    # Check .env
    echo ""
    if [ -f ".env" ]; then
        print_success ".env file exists"
    else
        print_warning ".env file not found"
        print_info "Create .env file with database credentials"
    fi
    
    # Test database connection
    echo ""
    read -p "Test database connection? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Testing database connection..."
        if command -v curl &> /dev/null; then
            curl -s http://localhost/api/test_db_connection.php | grep -q "Connection successful" && \
                print_success "Database connection successful" || \
                print_warning "Database connection test inconclusive"
        else
            print_warning "curl not available, skipping test"
        fi
    fi
    
    print_success "Hosting deployment completed!"
}

# Show usage
show_usage() {
    echo "BMKG News CMS - Deployment Helper"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  local      Push changes to GitHub"
    echo "  hosting    Pull changes from GitHub on hosting"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh local      # Push to GitHub"
    echo "  ./deploy.sh hosting    # Pull on hosting"
}

# Main
case "${1:-help}" in
    local)
        deploy_local
        ;;
    hosting)
        deploy_hosting
        ;;
    help)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
