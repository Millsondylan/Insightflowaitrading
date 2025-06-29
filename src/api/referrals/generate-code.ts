import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Generate a new referral code using the database function
    const { data, error } = await supabase.rpc('generate_unique_referral_code');
    
    if (error) throw error;
    
    const newCode = data;
    
    // Save the code to the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referral_code: newCode })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    // Create an entry in the referral_codes table
    const { error: insertError } = await supabase
      .from('referral_codes')
      .insert({
        user_id: user.id,
        code: newCode,
        clicks_count: 0,
        signups_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    
    if (insertError) throw insertError;
    
    // Return the new code
    return NextResponse.json({
      success: true,
      referral_code: newCode,
      referral_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://insightflow.ai'}/signup?ref=${newCode}`
    });
    
  } catch (error: any) {
    console.error('Error generating referral code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate referral code' },
      { status: 500 }
    );
  }
} 