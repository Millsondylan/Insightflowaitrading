import { supabase } from '@/integrations/supabase/client';

// Types
export interface UserSettings {
  id: string;
  user_id: string;
  notification_channels: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  notification_types: {
    trade_alerts: boolean;
    market_updates: boolean;
    strategy_signals: boolean;
    journal_reminders: boolean;
    goal_progress: boolean;
    course_updates: boolean;
    community_mentions: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  theme_preferences: {
    mode: 'light' | 'dark';
    accent_color: string;
    chart_theme: string;
  };
  layout_preferences: {
    sidebar_collapsed: boolean;
    default_view: string;
  };
  chart_settings: Record<string, any>;
  feature_toggles: {
    ai_copilot: boolean;
    auto_journaling: boolean;
    smart_notifications: boolean;
    voice_narration: boolean;
    keyboard_shortcuts: boolean;
    beta_features: boolean;
  };
  coaching_tone: 'supportive' | 'balanced' | 'challenging' | 'analytical';
  reminder_frequency: 'hourly' | 'daily' | 'weekly' | 'custom';
  language: string;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channels: ('email' | 'push' | 'in_app' | 'sms')[];
  status: 'pending' | 'sent' | 'read' | 'failed' | 'cancelled';
  sent_at?: string;
  read_at?: string;
  expires_at?: string;
  created_at: string;
}

// User Settings Management
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No settings found, create default
      return await createDefaultSettings(userId);
    }

    if (error) throw error;
    return data as UserSettings;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }
}

export async function createDefaultSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  } catch (error) {
    console.error('Error creating default settings:', error);
    return null;
  }
}

export async function updateUserSettings(
  userId: string, 
  updates: Partial<UserSettings>
): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  } catch (error) {
    console.error('Error updating user settings:', error);
    return null;
  }
}

// Notification Management
export async function createNotification(
  notification: Omit<UserNotification, 'id' | 'created_at' | 'status'>
): Promise<UserNotification | null> {
  try {
    // Check user settings to see if they want this type of notification
    const settings = await getUserSettings(notification.user_id);
    if (!settings) return null;

    // Check if notification type is enabled
    const notificationType = notification.notification_type as keyof typeof settings.notification_types;
    if (!settings.notification_types[notificationType]) {
      return null; // User has disabled this notification type
    }

    // Filter channels based on user preferences
    const enabledChannels = notification.channels.filter(channel => 
      settings.notification_channels[channel as keyof typeof settings.notification_channels]
    );

    if (enabledChannels.length === 0) {
      return null; // No enabled channels for this notification
    }

    // Check quiet hours
    if (settings.quiet_hours.enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(settings.quiet_hours.start.split(':')[0]);
      const endHour = parseInt(settings.quiet_hours.end.split(':')[0]);
      
      if (
        (startHour < endHour && currentHour >= startHour && currentHour < endHour) ||
        (startHour > endHour && (currentHour >= startHour || currentHour < endHour))
      ) {
        // In quiet hours, only send urgent notifications
        if (notification.priority !== 'urgent') {
          return null;
        }
      }
    }

    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        ...notification,
        channels: enabledChannels,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

export async function getUserNotifications(
  userId: string,
  options: {
    status?: UserNotification['status'];
    limit?: number;
    unreadOnly?: boolean;
  } = {}
): Promise<UserNotification[]> {
  try {
    let query = supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.unreadOnly) {
      query = query.is('read_at', null);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .is('read_at', null);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}

// Helper function to send notifications based on events
export async function sendEventNotification(
  userId: string,
  event: {
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: UserNotification['priority'];
  }
): Promise<void> {
  await createNotification({
    user_id: userId,
    notification_type: event.type,
    title: event.title,
    message: event.message,
    data: event.data || {},
    priority: event.priority || 'normal',
    channels: ['in_app', 'email', 'push'] // Default to all, will be filtered by user prefs
  });
}

// Batch notification operations
export async function sendBatchNotifications(
  notifications: Array<Omit<UserNotification, 'id' | 'created_at' | 'status'>>
): Promise<void> {
  try {
    // Process in parallel but respect rate limits
    const batchSize = 10;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await Promise.all(batch.map(notification => createNotification(notification)));
    }
  } catch (error) {
    console.error('Error sending batch notifications:', error);
  }
} 