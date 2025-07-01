export const mobileConfig = {
  appName: "InsightFlow AI Trading",
  bundleId: "com.insightflow.ai",
  appVersion: "2.0.0",
  capacitor: {
    enablePushNotifications: true,
    secureStorage: true,
    fileSharingEnabled: true,
    statusBarStyle: "dark",
    splashScreen: {
      backgroundColor: "#121212",
      spinnerColor: "#3B82F6",
      showSpinner: true
    },
    permissions: [
      "notifications",
      "camera",
      "storage",
      "biometric"
    ]
  },
  pushNotifications: {
    channels: [
      {id: "trade_alerts", name: "Trade Alerts"},
      {id: "market_updates", name: "Market Updates"},
      {id: "strategy_signals", name: "Strategy Signals"}
    ]
  },
  fileUploads: {
    maxSizeMb: 10,
    allowedTypes: ["image/*", "application/pdf"]
  }
} 