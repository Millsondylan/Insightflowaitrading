// Crypto Payment Verifier
// This function runs periodically to check pending transactions on the blockchain

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize API keys
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN;
const BLOCKCHAIN_API_KEY = process.env.BLOCKCHAIN_API_KEY;

export const handler = async (event, context) => {
  try {
    // Check if this is a scheduled event or manual trigger
    const isScheduled = event.body === null || event.httpMethod === undefined;
    
    // If API request (not scheduled), validate token
    if (!isScheduled) {
      const authHeader = event.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Missing or invalid token' })
        };
      }
      
      // Verify the JWT token with Supabase
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Invalid token' })
        };
      }
    }

    // Get pending transactions
    const { data: pendingTransactions, error: txError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .in('status', ['pending', 'processing'])
      .order('created_at', { ascending: true });
      
    if (txError) throw txError;
    
    if (!pendingTransactions || pendingTransactions.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No pending transactions found' })
      };
    }
    
    // Process each transaction
    const processPromises = pendingTransactions.map(async (tx) => {
      try {
        return await processTransaction(tx);
      } catch (err) {
        console.error(`Error processing transaction ${tx.id}:`, err);
        return { id: tx.id, success: false, error: err.message };
      }
    });
    
    const results = await Promise.all(processPromises);
    
    // Count successful verifications
    const successCount = results.filter(result => result.success).length;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Processed ${pendingTransactions.length} transactions, ${successCount} successfully verified`,
        results
      })
    };
    
  } catch (error) {
    console.error('Error in crypto payment verification function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify crypto payments' })
    };
  }
};

async function processTransaction(transaction) {
  try {
    let confirmations = 0;
    let amount = 0;
    
    // Check transaction status on blockchain based on crypto type
    switch (transaction.currency.toLowerCase()) {
      case 'eth':
        // Check Ethereum transaction
        const ethData = await checkEthereumTransaction(transaction.tx_hash);
        confirmations = ethData.confirmations;
        amount = ethData.value;
        break;
        
      case 'btc':
        // Check Bitcoin transaction
        const btcData = await checkBitcoinTransaction(transaction.tx_hash);
        confirmations = btcData.confirmations;
        amount = btcData.value;
        break;
        
      case 'usdt':
        // Check USDT transaction (on Ethereum)
        const usdtData = await checkUSDTTransaction(transaction.tx_hash);
        confirmations = usdtData.confirmations;
        amount = usdtData.value;
        break;
        
      default:
        throw new Error(`Unsupported currency: ${transaction.currency}`);
    }
    
    // Update transaction status based on confirmations
    let newStatus = transaction.status;
    if (confirmations >= 6) {
      newStatus = 'confirmed';
    } else if (confirmations >= 1) {
      newStatus = 'processing';
    }
    
    // Update the transaction in the database
    const { error: updateError } = await supabase
      .from('wallet_transactions')
      .update({
        status: newStatus,
        confirmations: confirmations,
        verified_amount: amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);
      
    if (updateError) throw updateError;
    
    // If confirmed, update user subscription
    if (newStatus === 'confirmed') {
      await updateUserSubscription(transaction);
    }
    
    return {
      id: transaction.id,
      success: true,
      confirmations,
      status: newStatus
    };
  } catch (error) {
    console.error(`Error processing transaction ${transaction.id}:`, error);
    
    // Update the transaction to indicate error
    const { error: updateError } = await supabase
      .from('wallet_transactions')
      .update({
        status_message: error.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);
      
    if (updateError) console.error('Error updating transaction with error state:', updateError);
    
    throw error;
  }
}

async function checkEthereumTransaction(txHash) {
  const url = `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== '1' || !data.result) {
    throw new Error('Failed to fetch Ethereum transaction data');
  }
  
  // Get transaction details to get amount and confirmations
  const detailsUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`;
  const detailsResponse = await fetch(detailsUrl);
  const detailsData = await detailsResponse.json();
  
  if (!detailsData.result) {
    throw new Error('Failed to fetch Ethereum transaction details');
  }
  
  // Get current block number
  const blockUrl = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`;
  const blockResponse = await fetch(blockUrl);
  const blockData = await blockResponse.json();
  
  const currentBlock = parseInt(blockData.result, 16);
  const txBlock = parseInt(detailsData.result.blockNumber, 16);
  const confirmations = currentBlock - txBlock;
  
  // Convert wei to ETH
  const valueWei = parseInt(detailsData.result.value, 16);
  const valueEth = valueWei / 1e18;
  
  return {
    confirmations,
    value: valueEth
  };
}

async function checkBitcoinTransaction(txHash) {
  const url = `https://api.blockcypher.com/v1/btc/main/txs/${txHash}?token=${BLOCKCYPHER_TOKEN}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data || !data.confirmations) {
    throw new Error('Failed to fetch Bitcoin transaction data');
  }
  
  // Convert satoshis to BTC
  const valueSats = data.total;
  const valueBtc = valueSats / 1e8;
  
  return {
    confirmations: data.confirmations,
    value: valueBtc
  };
}

async function checkUSDTTransaction(txHash) {
  // For USDT (ERC-20), we need to check token transfers
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xdac17f958d2ee523a2206206994597c13d831ec7&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== '1' || !data.result || data.result.length === 0) {
    throw new Error('Failed to fetch USDT transaction data');
  }
  
  const tx = data.result[0];
  
  // Get current block number
  const blockUrl = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`;
  const blockResponse = await fetch(blockUrl);
  const blockData = await blockResponse.json();
  
  const currentBlock = parseInt(blockData.result, 16);
  const txBlock = parseInt(tx.blockNumber);
  const confirmations = currentBlock - txBlock;
  
  // USDT has 6 decimal places
  const valueUsdt = parseInt(tx.value) / 1e6;
  
  return {
    confirmations,
    value: valueUsdt
  };
}

async function updateUserSubscription(transaction) {
  try {
    // Get the subscription plan for this transaction
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', transaction.subscription_id)
      .single();
      
    if (subError) throw subError;
    if (!subscription) throw new Error('Subscription not found');
    
    // Calculate new expiration date
    const now = new Date();
    const expiration = new Date();
    
    switch (subscription.billing_period) {
      case 'monthly':
        expiration.setMonth(expiration.getMonth() + 1);
        break;
      case 'quarterly':
        expiration.setMonth(expiration.getMonth() + 3);
        break;
      case 'annual':
        expiration.setFullYear(expiration.getFullYear() + 1);
        break;
      default:
        expiration.setMonth(expiration.getMonth() + 1); // Default to monthly
    }
    
    // Update user's subscription status
    const { error: userSubError } = await supabase
      .from('user_subscriptions')
      .upsert([
        {
          user_id: transaction.user_id,
          plan_id: subscription.plan_id,
          status: 'active',
          starts_at: now.toISOString(),
          expires_at: expiration.toISOString(),
          payment_id: transaction.id
        }
      ]);
      
    if (userSubError) throw userSubError;
    
    // Add notification for the user
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: transaction.user_id,
          type: 'payment',
          title: 'Payment Confirmed',
          message: `Your ${subscription.amount} ${transaction.currency} payment has been confirmed. Your subscription is now active until ${expiration.toLocaleDateString()}.`,
          data: {
            transaction_id: transaction.id,
            plan_id: subscription.plan_id
          }
        }
      ]);
      
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
} 