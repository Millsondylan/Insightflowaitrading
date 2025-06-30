import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's referral code and wallet info
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_payout_wallet, total_referral_earnings')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return NextResponse.json(
        { error: 'Could not fetch profile data' },
        { status: 500 }
      );
    }
    
    // Get user's referrals
    const { data: referralsData, error: referralsError } = await supabase
      .from('user_referrals')
      .select(`
        id,
        status,
        signup_date,
        earnings_percentage,
        referred_id,
        referred:profiles!referred_id(email)
      `)
      .eq('referrer_id', user.id)
      .order('signup_date', { ascending: false });
    
    if (referralsError) {
      return NextResponse.json(
        { error: 'Could not fetch referrals data' },
        { status: 500 }
      );
    }
    
    // Transform referrals data
    const formattedReferrals = (referralsData || []).map(ref => ({
      id: ref.id,
      referred_email: ref.referred?.email || 'Unknown user',
      status: ref.status,
      signup_date: ref.signup_date,
      earnings_percentage: ref.earnings_percentage
    }));
    
    // Get earnings data
    const { data: earningsData, error: earningsError } = await supabase
      .from('referral_earnings')
      .select(`
        id,
        amount,
        currency,
        payment_date,
        status,
        referred_id,
        referred:profiles!referred_id(email)
      `)
      .eq('referrer_id', user.id)
      .order('payment_date', { ascending: false });
    
    if (earningsError) {
      return NextResponse.json(
        { error: 'Could not fetch earnings data' },
        { status: 500 }
      );
    }
    
    // Transform earnings data
    const formattedEarnings = (earningsData || []).map(earn => ({
      id: earn.id,
      amount: earn.amount,
      currency: earn.currency,
      payment_date: earn.payment_date,
      status: earn.status,
      referred_email: earn.referred?.email || 'Unknown user'
    }));
    
    // Calculate pending payout
    const pendingAmount = formattedEarnings
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Get Pine Script sharing rewards
    const { data: shareRewardsData, error: shareRewardsError } = await supabase
      .from('pinescript_share_rewards')
      .select('shares_count, months_earned')
      .eq('user_id', user.id)
      .single();
    
    const sharingStats = !shareRewardsError ? {
      shares_count: shareRewardsData?.shares_count || 0,
      months_earned: shareRewardsData?.months_earned || 0,
      shares_to_next_reward: shareRewardsData ? 
        5 - (shareRewardsData.shares_count % 5) : 5
    } : {
      shares_count: 0,
      months_earned: 0,
      shares_to_next_reward: 5
    };
    
    return NextResponse.json({
      success: true,
      profile: {
        referral_code: profileData?.referral_code || '',
        referral_payout_wallet: profileData?.referral_payout_wallet || '',
        total_earnings: profileData?.total_referral_earnings || 0
      },
      referrals: formattedReferrals,
      earnings: formattedEarnings,
      pending_payout: pendingAmount,
      sharing_stats: sharingStats,
      referral_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://insightflow.ai'}/signup?ref=${profileData?.referral_code}`
    });
    
  } catch (error: any) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
} 