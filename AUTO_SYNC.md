# Auto-Sync to GitHub

This project is configured to automatically sync all changes to GitHub. Here's how it works:

## 🔄 Automatic Syncing

### 1. **Pre-commit Hooks**
- Every commit automatically runs type checking and linting
- Builds the project to ensure everything works
- Adds any build artifacts to the commit

### 2. **Post-commit Hooks**
- Automatically pushes changes to GitHub after each commit
- No manual `git push` needed!

### 3. **GitHub Actions**
- **Auto Sync Workflow**: Runs on every push to validate and build
- **Lovable Sync Workflow**: Specialized for Lovable.dev integration
- Automatically validates Lovable configuration
- Creates deployment packages for Lovable

## 🚀 Manual Sync Commands

```bash
# Normal sync (checks for changes first)
npm run sync

# Force sync (commits and pushes everything)
npm run sync:force

# Direct git commands
git add .
git commit -m "Your message"
git push
```

## 📁 Sync Configuration Files

- `.github/workflows/auto-sync.yml` - General auto-sync workflow
- `.github/workflows/lovable-sync.yml` - Lovable-specific sync
- `.husky/pre-commit` - Pre-commit validation
- `.husky/post-commit` - Auto-push to GitHub
- `scripts/sync-to-github.sh` - Manual sync script

## 🔧 How It Works

1. **When you make changes**: Files are modified locally
2. **When you commit**: 
   - Pre-commit hook runs validation
   - Changes are committed locally
   - Post-commit hook pushes to GitHub
3. **GitHub Actions**: 
   - Validate the build
   - Run tests
   - Create deployment packages
   - Optimize for Lovable integration

## 🎯 Benefits

- ✅ **Always in sync**: No more forgetting to push changes
- ✅ **Quality checks**: Automatic validation before commits
- ✅ **Lovable ready**: Optimized for Lovable.dev deployment
- ✅ **Team friendly**: Everyone's changes are automatically synced
- ✅ **Deployment ready**: Build artifacts are always up to date

## 🔗 Repository

Your changes are automatically synced to:
**https://github.com/Millsondylan/Insightflowaitrading**

## 🚨 Troubleshooting

If auto-sync fails:

1. **Check git status**: `git status`
2. **Manual sync**: `npm run sync`
3. **Force sync**: `npm run sync:force`
4. **Check GitHub Actions**: Visit the repository to see workflow status

## 📝 Notes

- The sync system respects your git workflow
- You can still use `git push` manually if needed
- All sync operations are logged for transparency
- Lovable-specific optimizations are applied automatically 