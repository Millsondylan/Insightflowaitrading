import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/db/supabase-client';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';

// Firebase Admin SDK for sending push notifications
// In a real implementation, you would initialize the Firebase Admin SDK 
// with your service account credentials
// import * as admin from 'firebase-admin';

// For demo, we'll simulate the FCM service
const sendPushNotification = async (deviceToken: string, notification: any) => {
  console.log(`SENDING PUSH to ${deviceToken}:`, notification);
  
  // In production, use Firebase Admin SDK:
  /*
  return admin.messaging().send({
    token: deviceToken,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.data || {},
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
    },
  });
  */
  
  // Simulate successful delivery
  return { success: true, messageId: `mock-msg-${Date.now()}` };
};

export async function POST(req: NextRequest) {
  try {
    // Check authentication (only authenticated users can send notifications)
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { userId, title, body: messageBody, data = {} } = body;
    
    if (!userId || !title || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required parameters (userId, title, body)' },
        { status: 400 }
      );
    }
    
    // Only admins can send notifications to other users
    if (userId !== user.id) {
      // Check if the requester is an admin
      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Permission denied: Cannot send notifications to other users' },
          { status: 403 }
        );
      }
    }
    
    // Fetch the user's registered devices
    const { data: devices, error: devicesError } = await supabase
      .from('push_devices')
      .select('push_token, platform')
      .eq('user_id', userId);
    
    if (devicesError) {
      console.error('Error fetching user devices:', devicesError);
      return NextResponse.json(
        { error: 'Error fetching user devices' },
        { status: 500 }
      );
    }
    
    if (!devices || devices.length === 0) {
      return NextResponse.json(
        { error: 'No devices registered for this user' },
        { status: 404 }
      );
    }
    
    // Format the notification
    const notification = {
      title,
      body: messageBody,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    };
    
    // Send to all devices
    const results = await Promise.all(
      devices.map(async (device) => {
        try {
          const result = await sendPushNotification(device.push_token, notification);
          return { 
            token: device.push_token,
            platform: device.platform,
            success: true,
            messageId: result.messageId
          };
        } catch (error) {
          console.error(`Error sending to device ${device.push_token}:`, error);
          return { 
            token: device.push_token,
            platform: device.platform,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );
    
    // Log the notification to the database
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        body: messageBody,
        data,
        sent_at: new Date().toISOString(),
        sender_id: user.id,
      });
    
    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      success: successCount > 0,
      message: `Push notification sent to ${successCount} of ${devices.length} devices`,
      results
    });
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send push notification' },
      { status: 500 }
    );
  }
} 