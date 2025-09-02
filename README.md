# WhiteBit API Documentation

This repository contains the documentation for WhiteBit's API.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate OG images
npm run generate-og
```

## Git Committer Rename Pipeline

This repository includes tools to rename all committer names and emails in the git history. See [GIT_COMMITTER_RENAME.md](./GIT_COMMITTER_RENAME.md) for detailed documentation.

### Quick Test

To test the setup and see what would happen:

```bash
npm run test-rename-setup
```

### Rename All Committers

⚠️ **WARNING: This rewrites git history!**

```bash
# Using npm script
npm run rename-committers

# Or directly
./scripts/rename-committers.sh

# Or use the GitHub Actions workflow from the Actions tab
```

For complete instructions and safety information, see [GIT_COMMITTER_RENAME.md](./GIT_COMMITTER_RENAME.md).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run generate-og` - Generate OG images
- `npm run rename-committers` - Rename all git committers (⚠️ rewrites history)
- `npm run test-rename-setup` - Test committer rename setup