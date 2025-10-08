#!/bin/bash

# Simple script to ghost repository to public with whitebit-robot identity
# Usage: ./ghost-to-public.sh <github_token> [target_repo]

set -e

GITHUB_TOKEN="$1"
TARGET_REPO="${2:-whitebit-exchange/api-documentation}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Usage: $0 <github_token> [target_repo]"
    exit 1
fi

echo "Ghosting repository to: $TARGET_REPO"
read -p "Type 'CONFIRM_GHOST' to proceed: " confirmation
if [ "$confirmation" != "CONFIRM_GHOST" ]; then
    echo "Operation cancelled."
    exit 1
fi

# Create backup
BACKUP_BRANCH="backup-before-ghost-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" HEAD
echo "Backup created: $BACKUP_BRANCH"

# Set remote and rewrite history
git remote set-url origin "https://whitebit-robot:${GITHUB_TOKEN}@github.com/${TARGET_REPO}.git"

git filter-branch -f --env-filter "
  GIT_AUTHOR_NAME='whitebit-robot'
  GIT_AUTHOR_EMAIL='robot@whitebit.com'
  GIT_COMMITTER_NAME='whitebit-robot'
  GIT_COMMITTER_EMAIL='robot@whitebit.com'
" HEAD

echo "History rewritten. Run 'git push --force -u origin' to push to target repository."