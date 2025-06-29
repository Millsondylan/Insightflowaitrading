import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Storage } from '@capacitor/storage';
import { supabase } from '@/lib/db/supabase-client';
import { Device } from '@capacitor/device';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

class PushNotificationService {
  private isNative: boolean;
  private hasPermission: boolean = false;
  private pushToken: string | null = null;
  
  constructor() {
    // Check if we're running in a Capacitor native app
    this.isNative = Capacitor.isNativePlatform();
  }
  
  /**
   * Initialize push notifications and request permissions
   */
  async initialize(): Promise<void> {
    if (!this.isNative) {
      console.log('Push notifications only available in native app');
      return;
    }

    try {
      // Request permission to use push notifications
      const permissionStatus = await PushNotifications.requestPermissions();
      this.hasPermission = permissionStatus.receive === 'granted';
      
      if (this.hasPermission) {
        // Register with the native push service
        await PushNotifications.register();
        
        // Listen for registration success
        PushNotifications.addListener('registration', async ({ value }) => {
          this.pushToken = value;
          await this.savePushToken(value);
        });
        
        // Setup notification received handler
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
          this.handleNotificationReceived(notification);
        });
        
        // Setup notification action handler (when user taps notification)
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push action performed:', action);
          this.handleNotificationAction(action);
        });
      } else {
        console.log('User denied push notification permission');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
  
  /**
   * Save push token to Supabase and local storage
   */
  private async savePushToken(token: string): Promise<void> {
    try {
      // Save to local storage first
      await Storage.set({ key: 'pushToken', value: token });
      
      // Get device info
      const deviceInfo = await Device.getInfo();
      
      const { user } = await supabase.auth.getUser();
      
      if (user) {
        // Store in Supabase - use upsert to prevent duplicates
        const { error } = await supabase
          .from('push_devices')
          .upsert({
            user_id: user.id,
            push_token: token,
            platform: deviceInfo.platform,
            device_name: deviceInfo.name || undefined,
            device_model: deviceInfo.model || undefined,
            os_version: deviceInfo.osVersion || undefined,
            app_version: deviceInfo.appVersion || undefined,
            last_seen: new Date().toISOString(),
          }, { onConflict: 'push_token' });
        
        if (error) {
          console.error('Error storing push token:', error);
        } else {
          console.log('Push token stored successfully');
        }
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }
  
  /**
   * Handle received notification
   */
  private handleNotificationReceived(notification: PushNotification): void {
    // Create native notification badge, sound, etc.
    // This can be customized based on notification type or content
  }
  
  /**
   * Handle notification action when user taps
   */
  private handleNotificationAction(actionData: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): void {
    const data = actionData.notification.data;
    
    // Navigate based on notification type
    if (data.route) {
      // Use appropriate navigation method based on your app setup
      // e.g., window.location.href = data.route;
      // or use Next.js router, etc.
      console.log('Should navigate to:', data.route);
    }
  }
  
  /**
   * Get the current push token
   */
  async getPushToken(): Promise<string | null> {
    // If we have already retrieved the token during this session
    if (this.pushToken) {
      return this.pushToken;
    }
    
    // Otherwise try to get from storage
    try {
      const result = await Storage.get({ key: 'pushToken' });
      return result.value;
    } catch (error) {
      console.error('Error getting push token from storage:', error);
      return null;
    }
  }
  
  /**
   * Delete the push token (e.g., when user logs out)
   */
  async removePushToken(): Promise<void> {
    try {
      const token = await this.getPushToken();
      
      if (token) {
        // Remove from Supabase
        await supabase
          .from('push_devices')
          .delete()
          .eq('push_token', token);
      }
      
      // Clear from local storage
      await Storage.remove({ key: 'pushToken' });
      
      this.pushToken = null;
    } catch (error) {
      console.error('Error removing push token:', error);
    }
  }
}

export const pushNotificationService = new PushNotificationService();

export default pushNotificationService; 