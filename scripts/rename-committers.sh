#!/bin/bash

# Git History Committer Rename Script
# This script renames all committer names and emails in the git history
# 
# WARNING: This operation rewrites git history and cannot be easily undone!
# 
# Usage: ./rename-committers.sh [new_name] [new_email] [github_token] [target_repo]
# Example: ./rename-committers.sh "whitebit-robot" "robot@whitebit.com" "your_token" "whitebit-exchange/api-documentation"

set -e

# Default values
DEFAULT_NAME="whitebit-robot"
DEFAULT_EMAIL="robot@whitebit.com"
DEFAULT_REPO="whitebit-exchange/api-documentation"

# Get parameters or use defaults
NEW_NAME="${1:-$DEFAULT_NAME}"
NEW_EMAIL="${2:-$DEFAULT_EMAIL}"
GITHUB_TOKEN="${3}"
TARGET_REPO="${4:-$DEFAULT_REPO}"

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
echo -e "  Target Repository: ${GREEN}$TARGET_REPO${NC}"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING: This operation will:${NC}"
echo -e "${RED}  - Rewrite the entire git history${NC}"
echo -e "${RED}  - Change all commit SHAs${NC}"
echo -e "${RED}  - Break existing references, PRs, and deployments${NC}"
echo -e "${RED}  - Cannot be easily reversed once pushed${NC}"
echo ""

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GitHub token is required.${NC}"
    echo "Usage: $0 [new_name] [new_email] [github_token] [target_repo]"
    echo "Example: $0 \"whitebit-robot\" \"robot@whitebit.com\" \"your_token\" \"whitebit-exchange/api-documentation\""
    exit 1
fi

# Check if git-filter-branch is available (it's built into git)
if ! git --version &> /dev/null; then
    echo -e "${RED}Error: git is not installed.${NC}"
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

# Set remote URL with token
echo -e "${YELLOW}Setting remote URL...${NC}"
git remote set-url origin "https://whitebit-robot:${GITHUB_TOKEN}@github.com/${TARGET_REPO}.git"

# Configure git
git config user.name "$NEW_NAME"
git config user.email "$NEW_EMAIL"

# Push backup branch
echo -e "${YELLOW}Pushing backup branch...${NC}"
git push origin "$BACKUP_BRANCH"

# Rewrite git history
echo -e "${YELLOW}Rewriting git history...${NC}"
git filter-branch -f --env-filter "
  GIT_AUTHOR_NAME='$NEW_NAME'
  GIT_AUTHOR_EMAIL='$NEW_EMAIL'
  GIT_COMMITTER_NAME='$NEW_NAME'
  GIT_COMMITTER_EMAIL='$NEW_EMAIL'
" HEAD

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
echo -e "  2. To push the rewritten history: ${BLUE}git push --force -u origin${NC}"
echo -e "  3. Team members will need to reset their local repositories"
echo -e "  4. To restore original history: ${BLUE}git reset --hard $BACKUP_BRANCH${NC}"
echo ""
echo -e "${RED}Note: The rewritten history has not been pushed yet. Use 'git push --force -u origin' when ready.${NC}"