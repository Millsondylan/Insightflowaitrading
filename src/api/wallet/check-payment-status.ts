import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';
import { supabase } from '@/integrations/supabase/client';

// Mock blockchain API responses for demo purposes
const mockBlockchainResponses: Record<string, any> = {
  BTC: (confirmations = 3) => ({
    confirmations: Math.min(confirmations + 1, 6), // Increment by 1 each check until confirmed
    required_confirmations: 6,
    status: Math.min(confirmations + 1, 6) >= 6 ? 'confirmed' : 'pending',
    timestamp: new Date().toISOString(),
    amount: '0.002 BTC',
  }),
  ETH: () => ({
    confirmations: 12,
    required_confirmations: 12,
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    amount: '0.05 ETH',
  }),
  USDT_ERC20: () => ({
    confirmations: 12,
    required_confirmations: 12,
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    amount: '100 USDT',
  }),
  USDT_TRC20: () => ({
    confirmations: 19,
    required_confirmations: 19,
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    amount: '100 USDT',
  }),
};

// In a real implementation, this would call blockchain APIs
async function checkTransactionStatus(txHash: string, cryptocurrency: string, currentConfirmations = 0) {
  console.log(`Checking ${cryptocurrency} transaction status: ${txHash}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return mock data based on cryptocurrency
  // In production, this would call real blockchain APIs
  if (mockBlockchainResponses[cryptocurrency]) {
    return mockBlockchainResponses[cryptocurrency](currentConfirmations);
  }
  
  return {
    confirmations: 0,
    required_confirmations: 12,
    status: 'failed',
    timestamp: null,
    amount: null,
  };
}

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
    
    const { txHash, cryptocurrency } = body;
    
    if (!txHash || !cryptocurrency) {
      return NextResponse.json(
        { error: 'Transaction hash and cryptocurrency are required' },
        { status: 400 }
      );
    }
    
    // Check if this transaction exists in our database
    const { data: existingTx, error: txError } = await supabase
      .from('wallet_transactions')
      .select('id, status, confirmations, required_confirmations')
      .eq('tx_hash', txHash)
      .eq('user_id', user.id)
      .single();
    
    // If transaction is already confirmed in our database, return that status
    if (existingTx && existingTx.status === 'confirmed') {
      return NextResponse.json({
        confirmations: existingTx.confirmations,
        required_confirmations: existingTx.required_confirmations,
        status: 'confirmed',
        timestamp: existingTx.confirmation_timestamp,
        amount: existingTx.amount,
      });
    }
    
    // Check current status on blockchain
    const currentConfirmations = existingTx?.confirmations || 0;
    const statusResult = await checkTransactionStatus(txHash, cryptocurrency, currentConfirmations);
    
    // Update transaction in database
    if (existingTx) {
      await supabase
        .from('wallet_transactions')
        .update({
          status: statusResult.status,
          confirmations: statusResult.confirmations,
          confirmation_timestamp: statusResult.status === 'confirmed' ? statusResult.timestamp : null,
        })
        .eq('id', existingTx.id);
    } else {
      // Create a new record if it doesn't exist
      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        tx_hash: txHash,
        cryptocurrency,
        amount: statusResult.amount,
        status: statusResult.status,
        confirmations: statusResult.confirmations,
        required_confirmations: statusResult.required_confirmations,
        verification_timestamp: new Date().toISOString(),
        confirmation_timestamp: statusResult.status === 'confirmed' ? statusResult.timestamp : null,
      });
    }
    
    return NextResponse.json(statusResult);
    
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 