# Git Committer Rename Pipeline

This repository contains tools to rename all committer names and emails in the git history. This is a powerful but dangerous operation that completely rewrites git history.

## ⚠️ **IMPORTANT WARNING**

**This operation will:**
- Rewrite the entire git history
- Change all commit SHAs
- Break existing references, PRs, and deployments
- Cannot be easily reversed once pushed to a shared repository

**Only proceed if you fully understand the consequences!**

## Available Methods

### 1. GitHub Actions Workflow (Recommended for Teams)

A GitHub Actions workflow that can be triggered manually from the GitHub web interface.

**Location:** `.github/workflows/rename-committers.yml`

**How to use:**
1. Go to the "Actions" tab in your GitHub repository
2. Select "Rename All Committers" workflow
3. Click "Run workflow"
4. Fill in the required parameters:
   - **New email address**: Default is `joh@whitebit.com`
   - **New name**: Default is `joh`
   - **Confirmation**: Type `CONFIRM_REWRITE` to proceed
5. Click "Run workflow"

**Features:**
- ✅ Safety confirmation required
- ✅ Automatic backup branch creation
- ✅ Statistics before and after
- ✅ Detailed logging
- ✅ Force push with lease for safety

### 2. Local Script (For Advanced Users)

A bash script that can be run locally for more control over the process.

**Location:** `scripts/rename-committers.sh`

**Prerequisites:**
```bash
# Install git-filter-repo
pip install git-filter-repo

# Or on Ubuntu/Debian
sudo apt-get install git-filter-repo
```

**How to use:**
```bash
# With default values (joh, joh@whitebit.com)
./scripts/rename-committers.sh

# With custom values
./scripts/rename-committers.sh "New Name" "new.email@example.com"
```

**Features:**
- ✅ Interactive confirmation
- ✅ Automatic backup branch creation
- ✅ Colored output for better readability
- ✅ Statistics before and after
- ✅ Manual control over push timing

## What Happens During the Process

1. **Backup Creation**: A backup branch is created with the original history
2. **History Rewrite**: All commits are rewritten with the new committer information
3. **Statistics**: Before and after statistics are shown
4. **Push**: The rewritten history is pushed (workflow) or ready to push (script)

## Recovery

If something goes wrong, you can restore the original history:

```bash
# Find your backup branch
git branch -a | grep backup

# Reset to the backup
git reset --hard backup-before-rewrite-YYYYMMDD-HHMMSS

# Force push the original history back
git push --force-with-lease origin HEAD
```

## Team Coordination

After running this operation:

1. **Notify your team** before running this operation
2. **All team members** will need to reset their local repositories:
   ```bash
   git fetch origin
   git reset --hard origin/main  # or your main branch name
   ```
3. **Existing PRs** may need to be recreated
4. **CI/CD pipelines** may need to be retriggered

## Example Output

```
=== Current Committer Statistics ===
     15 John Doe <john@example.com>
      8 Jane Smith <jane@example.com>
      3 Bob Wilson <bob@example.com>

Total commits: 26

=== New Committer Statistics ===
     26 joh <joh@whitebit.com>

Total commits: 26
```

## Technical Details

- Uses `git-filter-repo` for safe and efficient history rewriting
- Creates timestamped backup branches
- Preserves commit messages, dates, and file changes
- Only modifies author and committer information
- Uses `--force-with-lease` for safer force pushing

## Support

If you encounter issues:
1. Check that `git-filter-repo` is installed
2. Ensure you have the necessary permissions
3. Verify that the repository is in a clean state
4. Check the backup branches if recovery is needed

For more information about `git-filter-repo`, see: https://github.com/newren/git-filter-repo