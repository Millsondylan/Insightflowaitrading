#!/bin/bash

echo "🚀 Building InsightFlow Trading App for Android..."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Check if Capacitor is installed
if ! npx cap --version &> /dev/null; then
    echo "❌ Capacitor is not installed. Installing..."
    npm install @capacitor/core @capacitor/cli @capacitor/android
fi

# Build web app
echo "1️⃣ Building web app..."
if npm run build; then
    echo "✅ Web app built successfully"
else
    echo "❌ Web app build failed"
    exit 1
fi

# Sync with Android
echo ""
echo "2️⃣ Syncing with Android..."
if npx cap sync android; then
    echo "✅ Android sync completed"
else
    echo "❌ Android sync failed"
    exit 1
fi

# Check if Android Studio is installed
if [ -d "/Applications/Android Studio.app" ]; then
    echo ""
    echo "3️⃣ Opening in Android Studio..."
    npx cap open android
    echo "✅ Android Studio opened"
    echo ""
    echo "📱 Next steps in Android Studio:"
    echo "   1. Wait for Gradle sync to complete"
    echo "   2. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "   3. Click 'locate' in the notification to find your APK"
else
    echo ""
    echo "⚠️  Android Studio not found in /Applications/"
    echo "   Please install Android Studio from: https://developer.android.com/studio"
    echo ""
    echo "📁 Android project location: ./android/"
    echo "   You can open this folder in Android Studio manually"
fi

echo ""
echo "🎉 Setup complete! Check ANDROID_BUILD_GUIDE.md for detailed instructions." 