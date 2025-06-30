// Mock Capacitor plugins for web environment
// This file provides stubs for Capacitor functionality when running in a web browser

/**
 * Check if the app is running in a Capacitor environment
 * Always returns false in this mock version
 */
export const isCapacitor = () => {
  return false;
};

/**
 * Check if the app is running on a specific platform
 * Always returns false in this mock version
 */
export const isNativePlatform = (platform: 'android' | 'ios') => {
  return false;
};

/**
 * Initialize Capacitor plugins
 * Does nothing in this mock version
 */
export async function initCapacitorPlugins() {
  console.log('Mock Capacitor plugins initialized for web environment');
  return;
}

// Mock SplashScreen object
export const SplashScreen = {
  hide: (options?: { fadeOutDuration?: number }) => {
    console.log('Mock SplashScreen hide called with options:', options);
    return Promise.resolve();
  },
  show: () => {
    console.log('Mock SplashScreen show called');
    return Promise.resolve();
  }
};

// Mock PushNotifications object
export const PushNotifications = {
  requestPermissions: () => {
    console.log('Mock PushNotifications requestPermissions called');
    return Promise.resolve({ receive: 'denied' });
  },
  register: () => {
    console.log('Mock PushNotifications register called');
    return Promise.resolve();
  },
  addListener: (eventName: string, callback: Function) => {
    console.log(`Mock PushNotifications addListener for ${eventName} called`);
    return { remove: () => {} };
  },
  removeAllListeners: () => {
    console.log('Mock PushNotifications removeAllListeners called');
    return Promise.resolve();
  }
}; 