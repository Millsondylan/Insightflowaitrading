# Android APK Build Guide

## Prerequisites

### 1. Install Android Studio
Download and install Android Studio from: https://developer.android.com/studio

### 2. Install Java Development Kit (JDK)
```bash
# On macOS with Homebrew
brew install openjdk@17

# Or download from Oracle
# https://www.oracle.com/java/technologies/downloads/
```

### 3. Set up Android SDK
1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install:
   - Android SDK Platform 33 (or latest)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools

## Build Steps

### 1. Build the Web App
```bash
npm run build
```

### 2. Sync with Android
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build APK in Android Studio
1. In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. Click **locate** in the notification to find your APK

### Alternative: Command Line Build

If you have the Android SDK installed and configured:

```bash
# Navigate to Android project
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

The APK will be located at:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Quick Setup Script

Run this script to automate the process:

```bash
#!/bin/bash
echo "Building InsightFlow Trading App for Android..."

# Build web app
echo "1. Building web app..."
npm run build

# Sync with Android
echo "2. Syncing with Android..."
npx cap sync android

# Open in Android Studio
echo "3. Opening in Android Studio..."
npx cap open android

echo "✅ Setup complete! Build APK in Android Studio."
```

## Troubleshooting

### Java not found
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$JAVA_HOME/bin:$PATH
```

### Android SDK not found
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Gradle sync failed
1. Open Android Studio
2. Go to File → Invalidate Caches and Restart
3. Try syncing again

## APK Distribution

Once you have the APK:
1. **Debug APK**: Can be installed directly on devices with "Unknown sources" enabled
2. **Release APK**: Requires signing and can be distributed via:
   - Google Play Store
   - Direct download
   - App stores

## Next Steps

1. Test the APK on your device
2. Configure app signing for release builds
3. Set up Google Play Console for distribution
4. Consider using App Bundle (.aab) for Play Store

## Support

If you encounter issues:
1. Check Capacitor documentation: https://capacitorjs.com/docs
2. Verify Android Studio setup
3. Check console logs in Android Studio 