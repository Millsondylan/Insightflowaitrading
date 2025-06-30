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
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { wallet_address } = body;
    
    if (!wallet_address || typeof wallet_address !== 'string') {
      return NextResponse.json(
        { error: 'wallet_address is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Very basic validation - in a real app, you'd have more sophisticated validation
    // for different blockchain addresses (ETH, BNB, etc.)
    if (wallet_address.length < 10) {
      return NextResponse.json(
        { error: 'Wallet address seems too short to be valid' },
        { status: 400 }
      );
    }
    
    // Update user's wallet address
    const { error } = await supabase
      .from('profiles')
      .update({ referral_payout_wallet: wallet_address })
      .eq('id', user.id);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update wallet address' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Wallet address updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error updating wallet address:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update wallet address' },
      { status: 500 }
    );
  }
} 