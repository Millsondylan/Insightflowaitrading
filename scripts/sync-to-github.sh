#!/bin/bash

echo "🔄 Syncing to GitHub..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️ No changes to commit"
else
    echo "📝 Committing changes..."
    git add .
    git commit -m "🤖 Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Get current branch
BRANCH=$(git branch --show-current)

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin $BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully synced to GitHub!"
    echo "🔗 Repository: https://github.com/Millsondylan/Insightflowaitrading"
    echo "🌿 Branch: $BRANCH"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi 