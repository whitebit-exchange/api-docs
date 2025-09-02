#!/bin/bash

# Git History Committer Rename Script
# This script renames all committer names and emails in the git history
# 
# WARNING: This operation rewrites git history and cannot be easily undone!
# 
# Usage: ./rename-committers.sh [new_name] [new_email]
# Example: ./rename-committers.sh "joh" "joh@whitebit.com"

set -e

# Default values
DEFAULT_NAME="joh"
DEFAULT_EMAIL="joh@whitebit.com"

# Get parameters or use defaults
NEW_NAME="${1:-$DEFAULT_NAME}"
NEW_EMAIL="${2:-$DEFAULT_EMAIL}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git History Committer Rename Script ===${NC}"
echo ""
echo -e "${YELLOW}This script will rename ALL committers in git history to:${NC}"
echo -e "  Name: ${GREEN}$NEW_NAME${NC}"
echo -e "  Email: ${GREEN}$NEW_EMAIL${NC}"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING: This operation will:${NC}"
echo -e "${RED}  - Rewrite the entire git history${NC}"
echo -e "${RED}  - Change all commit SHAs${NC}"
echo -e "${RED}  - Break existing references, PRs, and deployments${NC}"
echo -e "${RED}  - Cannot be easily reversed once pushed${NC}"
echo ""

# Check if git-filter-repo is available
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${RED}Error: git-filter-repo is not installed.${NC}"
    echo "Install it with: pip install git-filter-repo"
    echo "Or on Ubuntu/Debian: sudo apt-get install git-filter-repo"
    exit 1
fi

# Show current committer statistics
echo -e "${BLUE}=== Current Committer Statistics ===${NC}"
git log --format='%aN <%aE>' | sort | uniq -c | sort -rn
echo ""
echo -e "${BLUE}Total commits:${NC} $(git rev-list --count HEAD)"
echo ""

# Confirmation
read -p "Are you sure you want to proceed? Type 'CONFIRM_REWRITE' to continue: " confirmation
if [ "$confirmation" != "CONFIRM_REWRITE" ]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
fi

# Create backup branch
echo -e "${YELLOW}Creating backup branch...${NC}"
BACKUP_BRANCH="backup-before-rewrite-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" HEAD
echo -e "${GREEN}Backup created: $BACKUP_BRANCH${NC}"

# Configure git
git config user.name "$NEW_NAME"
git config user.email "$NEW_EMAIL"

# Rewrite git history
echo -e "${YELLOW}Rewriting git history...${NC}"
git filter-repo --force \
    --name-callback "return b'$NEW_NAME'" \
    --email-callback "return b'$NEW_EMAIL'"

# Show new statistics
echo ""
echo -e "${BLUE}=== New Committer Statistics ===${NC}"
git log --format='%aN <%aE>' | sort | uniq -c | sort -rn
echo ""
echo -e "${BLUE}Total commits:${NC} $(git rev-list --count HEAD)"

echo ""
echo -e "${GREEN}✅ Git history rewrite completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "  - All committers renamed to: $NEW_NAME <$NEW_EMAIL>"
echo -e "  - Backup branch created: $BACKUP_BRANCH"
echo ""
echo -e "${YELLOW}⚠️  Important next steps:${NC}"
echo -e "  1. Review the changes carefully"
echo -e "  2. To push the rewritten history: ${BLUE}git push --force-with-lease origin HEAD${NC}"
echo -e "  3. Team members will need to reset their local repositories"
echo -e "  4. To restore original history: ${BLUE}git reset --hard $BACKUP_BRANCH${NC}"
echo ""
echo -e "${RED}Note: The rewritten history has not been pushed yet. Use 'git push --force-with-lease' when ready.${NC}"