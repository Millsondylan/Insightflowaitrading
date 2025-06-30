import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';
import { supabase } from '@/integrations/supabase/client';

// Mock blockchain API responses for demo purposes
const mockBlockchainResponses: Record<string, any> = {
  BTC: {
    confirmations: 3,
    required_confirmations: 6,
    status: 'pending',
    timestamp: new Date().toISOString(),
    amount: '0.002 BTC',
  },
  ETH: {
    confirmations: 12,
    required_confirmations: 12,
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    amount: '0.05 ETH',
  },
  USDT_ERC20: {
    confirmations: 12,
    required_confirmations: 12,
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    amount: '100 USDT',
  },
  USDT_TRC20: {
    confirmations: 19,
    required_confirmations: 19,
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    amount: '100 USDT',
  },
};

// In a real implementation, this would call blockchain APIs like Etherscan, Blockcypher, etc.
async function verifyTransactionOnBlockchain(txHash: string, cryptocurrency: string) {
  console.log(`Verifying ${cryptocurrency} transaction: ${txHash}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, return mock data based on cryptocurrency
  // In production, this would call real blockchain APIs
  return mockBlockchainResponses[cryptocurrency] || {
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
    
    // Check if this transaction has already been processed
    const { data: existingTx, error: txError } = await supabase
      .from('wallet_transactions')
      .select('id, status')
      .eq('tx_hash', txHash)
      .single();
    
    if (existingTx && existingTx.status === 'confirmed') {
      return NextResponse.json({ 
        message: 'Transaction already processed',
        status: 'confirmed',
        confirmations: existingTx.confirmations || 0,
        required_confirmations: existingTx.required_confirmations || 0,
        timestamp: existingTx.confirmation_timestamp,
        amount: existingTx.amount
      });
    }
    
    // Verify transaction on blockchain
    const verificationResult = await verifyTransactionOnBlockchain(txHash, cryptocurrency);
    
    // Store the transaction status regardless of confirmation status
    if (!existingTx) {
      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        tx_hash: txHash,
        cryptocurrency,
        amount: verificationResult.amount,
        status: verificationResult.status,
        confirmations: verificationResult.confirmations,
        required_confirmations: verificationResult.required_confirmations,
        verification_timestamp: new Date().toISOString(),
        confirmation_timestamp: verificationResult.status === 'confirmed' ? verificationResult.timestamp : null,
      });
    } else if (verificationResult.status === 'confirmed' && existingTx.status !== 'confirmed') {
      // Update existing transaction if now confirmed
      await supabase
        .from('wallet_transactions')
        .update({
          status: 'confirmed',
          confirmations: verificationResult.confirmations,
          confirmation_timestamp: verificationResult.timestamp,
        })
        .eq('id', existingTx.id);
    }
    
    return NextResponse.json(verificationResult);
    
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 