import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase-client';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
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
    
    const { userId, experience, tradingStyles } = body;
    
    // Verify the user is updating their own profile
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Permission denied: Cannot update another user\'s profile' },
        { status: 403 }
      );
    }
    
    // Log analytics data
    const { error: analyticsError } = await supabase
      .from('admin_user_summary')
      .upsert({
        user_id: userId,
        experience,
        style: tradingStyles,
        created_at: new Date().toISOString()
      });
    
    if (analyticsError) {
      console.error('Error logging analytics data:', analyticsError);
    }
    
    // Send welcome email (in a real app, you'd use a proper email service)
    try {
      console.log(`Sending welcome email to user ${userId} with experience level ${experience}`);
      
      // Example of how you might send an email in a real application:
      /*
      await emailService.sendTemplate({
        to: user.email,
        template: 'welcome',
        data: {
          experience,
          tradingStyles,
          firstName: user.user_metadata?.first_name || 'Trader'
        }
      });
      */
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }
    
    // Set up default dashboard based on user preferences
    try {
      // Get user profile to determine default settings
      const { data: profile } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        // Create default dashboard settings
        await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            default_timeframe: profile.favorite_timeframes?.[0] || 'D1',
            default_markets: profile.favorite_markets || ['forex', 'crypto'],
            default_symbols: profile.favorite_symbols?.slice(0, 5) || [],
            default_indicators: profile.indicators?.slice(0, 3) || ['RSI', 'EMA'],
            updated_at: new Date().toISOString()
          });
      }
    } catch (settingsError) {
      console.error('Error setting up default dashboard:', settingsError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully'
    });
  } catch (error: any) {
    console.error('Error processing onboarding webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process onboarding' },
      { status: 500 }
    );
  }
} 