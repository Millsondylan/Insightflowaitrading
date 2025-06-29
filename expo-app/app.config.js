export default {
  name: "InsightFlow AI Trading",
  slug: "insightflow-trading",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#121212"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.insightflow.ai",
    buildNumber: "1",
    infoPlist: {
      NSCameraUsageDescription: "This app uses the camera to capture charts for analysis",
      NSMicrophoneUsageDescription: "This app uses the microphone for voice AI features",
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#121212"
    },
    package: "com.insightflow.ai",
    versionCode: 1,
    permissions: [
      "CAMERA",
      "RECORD_AUDIO"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-camera",
      {
        "cameraPermission": "Allow InsightFlow to access your camera to analyze trading charts"
      }
    ],
    [
      "expo-document-picker", 
      {
        "iCloudContainerEnvironment": "Production"
      }
    ],
    [
      "expo-notifications",
      {
        "icon": "./assets/notification-icon.png",
        "color": "#3B82F6",
        "sounds": [
          "./assets/notification.wav",
          "./assets/alert.wav"
        ]
      }
    ],
    "expo-secure-store"
  ],
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  },
  scheme: "insightflow"
} 