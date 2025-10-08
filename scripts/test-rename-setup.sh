#!/bin/bash

# Test script for the Git Committer Rename functionality
# This script demonstrates what would happen without actually rewriting history

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git Committer Rename Test ===${NC}"
echo ""
echo -e "${YELLOW}This test shows what the rename operation would do without actually changing anything.${NC}"
echo ""

# Check git-filter-branch availability
if git --version &> /dev/null; then
    echo -e "${GREEN}✅ git is available (git filter-branch is built-in)${NC}"
else
    echo -e "${RED}❌ git is not installed${NC}"
    echo "  This is required for the rename operation"
fi

# Show current repository status
echo ""
echo -e "${BLUE}=== Current Repository Status ===${NC}"
echo -e "Repository: $(git config --get remote.origin.url 2>/dev/null || echo "Not set")"
echo -e "Current branch: $(git branch --show-current)"
echo -e "Total commits: $(git rev-list --count HEAD)"

# Show current committer statistics
echo ""
echo -e "${BLUE}=== Current Committer Statistics ===${NC}"
git log --format='%aN <%aE>' | sort | uniq -c | sort -rn

# Show what would be changed
echo ""
echo -e "${BLUE}=== What Would Change ===${NC}"
echo -e "${GREEN}After running the rename operation:${NC}"
echo -e "  - All authors would become: whitebit-robot <robot@whitebit.com>"
echo -e "  - All committers would become: whitebit-robot <robot@whitebit.com>"
echo -e "  - Total commits would remain: $(git rev-list --count HEAD)"
echo -e "  - All commit SHAs would change"
echo -e "  - Remote will be updated to: whitebit-exchange/api-documentation"

# Show available tools
echo ""
echo -e "${BLUE}=== Available Tools ===${NC}"
echo -e "${GREEN}1. GitHub Actions Workflow:${NC} .github/workflows/rename-committers.yml"
echo -e "   - Trigger from GitHub Actions tab"
echo -e "   - Requires CONFIRM_REWRITE confirmation"
echo -e "   - Automatic backup and push"

echo ""
echo -e "${GREEN}2. Local Script:${NC} scripts/rename-committers.sh"
echo -e "   - Run locally with more control"
echo -e "   - Requires GitHub token parameter"
echo -e "   - Manual push timing"
echo -e "   - Interactive confirmation"

echo ""
echo -e "${GREEN}3. NPM Script:${NC} npm run rename-committers"
echo -e "   - Convenient wrapper for the local script"

# Show documentation
echo ""
echo -e "${BLUE}=== Documentation ===${NC}"
echo -e "Read ${GREEN}GIT_COMMITTER_RENAME.md${NC} for detailed instructions and safety information."

echo ""
echo -e "${GREEN}✅ Test completed. The repository is ready for committer renaming.${NC}"
echo -e "${RED}⚠️  Remember: This operation rewrites git history and cannot be easily undone!${NC}"