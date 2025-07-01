#!/bin/bash

echo "🚀 Triggering APK Build on GitHub Actions..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Check if we have a remote origin
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found"
    exit 1
fi

# Get the repository URL
REPO_URL=$(git remote get-url origin)
echo "📦 Repository: $REPO_URL"

# Create a tag to trigger the release
TAG="v1.0.0-$(date +%Y%m%d-%H%M%S)"
echo "🏷️  Creating tag: $TAG"

# Create and push the tag
git tag $TAG
git push origin $TAG

echo ""
echo "✅ Tag pushed successfully!"
echo ""
echo "📱 APK Build Status:"
echo "   🔗 Check progress: https://github.com/Millsondylan/Insightflowaitrading/actions"
echo ""
echo "⏳ The build will take 5-10 minutes. Once complete:"
echo "   1. Go to: https://github.com/Millsondylan/Insightflowaitrading/releases"
echo "   2. Download the APK from the latest release"
echo ""
echo "📋 Alternative: Manual Build"
echo "   Run: ./build-android.sh (requires Android Studio)" 