const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Handles for different blockchain explorers
const API_KEYS = {
  ETH_EXPLORER: process.env.ETHERSCAN_API_KEY,
  BTC_EXPLORER: process.env.BLOCKCHAIR_API_KEY,
  TRON_EXPLORER: process.env.TRONGRID_API_KEY
};

// Transaction confirmation thresholds by network
const CONFIRMATION_THRESHOLDS = {
  BTC: 3,
  ETH: 12,
  USDT_ERC20: 12,
  USDT_TRC20: 19
};

// Handler to verify crypto transactions
exports.handler = async (event, context) => {
  console.log('Starting verification of pending crypto transactions');
  
  try {
    // 1. Fetch all pending transactions from the database
    const { data: pendingTransactions, error: fetchError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('status', 'pending');
    
    if (fetchError) {
      throw new Error(`Error fetching pending transactions: ${fetchError.message}`);
    }
    
    console.log(`Found ${pendingTransactions.length} pending transactions to verify`);
    
    // 2. Process each transaction
    const results = await Promise.allSettled(
      pendingTransactions.map(async (tx) => {
        console.log(`Verifying ${tx.cryptocurrency} transaction: ${tx.tx_hash}`);
        
        try {
          // Get blockchain API based on cryptocurrency
          const status = await verifyTransactionOnBlockchain(tx.tx_hash, tx.cryptocurrency);
          
          // Update transaction status
          await updateTransactionStatus(tx.id, status);
          
          // If confirmed, handle subscription activation
          if (status.status === 'confirmed') {
            await handleConfirmedTransaction(tx.user_id, tx);
          }
          
          return {
            id: tx.id,
            hash: tx.tx_hash,
            status: status.status,
            confirmations: status.confirmations
          };
        } catch (error) {
          console.error(`Error processing transaction ${tx.id}:`, error);
          
          // Update error count and last check time
          await supabase
            .from('wallet_transactions')
            .update({
              last_check_error: error.message,
              error_count: (tx.error_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', tx.id);
          
          return {
            id: tx.id,
            hash: tx.tx_hash,
            status: 'error',
            error: error.message
          };
        }
      })
    );
    
    // 3. Return summary
    const summary = {
      processed: results.length,
      confirmed: results.filter(r => r.status === 'fulfilled' && r.value.status === 'confirmed').length,
      failed: results.filter(r => r.status === 'rejected').length,
      details: results.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason })
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(summary)
    };
    
  } catch (error) {
    console.error('Error verifying transactions:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to verify transactions' })
    };
  }
};

// Function to verify a transaction on the blockchain
async function verifyTransactionOnBlockchain(txHash, cryptocurrency) {
  let confirmations = 0;
  let status = 'pending';
  let amount = null;
  
  switch (cryptocurrency) {
    case 'BTC':
      // Call BTC Explorer API
      const btcResponse = await axios.get(`https://api.blockchair.com/bitcoin/dashboards/transaction/${txHash}`, {
        params: { key: API_KEYS.BTC_EXPLORER }
      });
      
      if (btcResponse.data?.data?.[txHash]?.transaction) {
        const txData = btcResponse.data.data[txHash];
        confirmations = txData.transaction.confirmation_count || 0;
        status = confirmations >= CONFIRMATION_THRESHOLDS.BTC ? 'confirmed' : 'pending';
        amount = `${txData.transaction.output_total / 100000000} BTC`;
      } else {
        throw new Error('Transaction not found on blockchain');
      }
      break;
      
    case 'ETH':
      // Call ETH Explorer API
      const ethResponse = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash: txHash,
          apikey: API_KEYS.ETH_EXPLORER
        }
      });
      
      if (ethResponse.data?.result) {
        const txData = ethResponse.data.result;
        
        // Get block confirmations
        const blockResponse = await axios.get(`https://api.etherscan.io/api`, {
          params: {
            module: 'proxy',
            action: 'eth_blockNumber',
            apikey: API_KEYS.ETH_EXPLORER
          }
        });
        
        if (blockResponse.data?.result && txData.blockNumber) {
          const currentBlock = parseInt(blockResponse.data.result, 16);
          const txBlock = parseInt(txData.blockNumber, 16);
          confirmations = currentBlock - txBlock;
          status = confirmations >= CONFIRMATION_THRESHOLDS.ETH ? 'confirmed' : 'pending';
          
          // Convert from wei to ETH
          const value = parseInt(txData.value, 16) / 1e18;
          amount = `${value} ETH`;
        } else {
          status = 'pending';
        }
      } else {
        throw new Error('Transaction not found on blockchain');
      }
      break;
      
    case 'USDT_ERC20':
      // Call ETH Explorer API for USDT ERC-20 token transfers
      const usdtResponse = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'tokentx',
          contractaddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT contract address
          txhash: txHash,
          apikey: API_KEYS.ETH_EXPLORER
        }
      });
      
      if (usdtResponse.data?.result?.length > 0) {
        const txData = usdtResponse.data.result[0];
        
        // Get block confirmations
        const blockResponse = await axios.get(`https://api.etherscan.io/api`, {
          params: {
            module: 'proxy',
            action: 'eth_blockNumber',
            apikey: API_KEYS.ETH_EXPLORER
          }
        });
        
        if (blockResponse.data?.result) {
          const currentBlock = parseInt(blockResponse.data.result, 16);
          confirmations = currentBlock - parseInt(txData.blockNumber);
          status = confirmations >= CONFIRMATION_THRESHOLDS.USDT_ERC20 ? 'confirmed' : 'pending';
          
          // Convert from smallest unit
          const value = parseInt(txData.value) / 1e6;
          amount = `${value} USDT`;
        } else {
          status = 'pending';
        }
      } else {
        throw new Error('Transaction not found on blockchain');
      }
      break;
      
    case 'USDT_TRC20':
      // Call TRON Explorer API
      const tronResponse = await axios.get(`https://api.trongrid.io/v1/transactions/${txHash}`, {
        headers: { 'TRON-PRO-API-KEY': API_KEYS.TRON_EXPLORER }
      });
      
      if (tronResponse.data?.data?.length > 0) {
        const txData = tronResponse.data.data[0];
        
        // Get current block
        const blockResponse = await axios.get(`https://api.trongrid.io/wallet/getnowblock`, {
          headers: { 'TRON-PRO-API-KEY': API_KEYS.TRON_EXPLORER }
        });
        
        if (blockResponse.data?.block_header?.raw_data?.number) {
          const currentBlock = blockResponse.data.block_header.raw_data.number;
          const txBlock = txData.blockNumber;
          confirmations = currentBlock - txBlock;
          status = confirmations >= CONFIRMATION_THRESHOLDS.USDT_TRC20 ? 'confirmed' : 'pending';
          
          // Extract USDT amount from the transaction
          const contractData = txData.raw_data.contract[0].parameter.value;
          if (contractData.amount) {
            const value = contractData.amount / 1e6; // Assuming 6 decimal places for USDT on TRON
            amount = `${value} USDT`;
          }
        } else {
          status = 'pending';
        }
      } else {
        throw new Error('Transaction not found on blockchain');
      }
      break;
      
    default:
      throw new Error(`Unsupported cryptocurrency: ${cryptocurrency}`);
  }
  
  return {
    confirmations,
    required_confirmations: CONFIRMATION_THRESHOLDS[cryptocurrency],
    status,
    timestamp: new Date().toISOString(),
    amount
  };
}

// Update transaction status in the database
async function updateTransactionStatus(txId, status) {
  // Update the transaction record
  const { error } = await supabase
    .from('wallet_transactions')
    .update({
      status: status.status,
      confirmations: status.confirmations,
      required_confirmations: status.required_confirmations,
      amount: status.amount || null,
      confirmation_timestamp: status.status === 'confirmed' ? status.timestamp : null,
      updated_at: new Date().toISOString(),
      last_check_at: new Date().toISOString()
    })
    .eq('id', txId);
  
  if (error) {
    throw new Error(`Error updating transaction status: ${error.message}`);
  }
}

// Handle confirmed transaction (e.g., activate subscription)
async function handleConfirmedTransaction(userId, tx) {
  console.log(`Processing confirmed transaction for user ${userId}`);
  
  try {
    // Check if there's a pending subscription for this user
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('payment_reference', tx.tx_hash)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (subscriptionError) {
      throw new Error(`Error fetching subscription: ${subscriptionError.message}`);
    }
    
    if (subscriptions && subscriptions.length > 0) {
      // Subscription exists, update it to active
      const subscription = subscriptions[0];
      
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id);
      
      console.log(`Activated subscription ${subscription.id} for user ${userId}`);
      
      // Create a notification for the user
      await supabase.from('notifications').insert({
        user_id: userId,
        title: 'Payment Confirmed',
        description: `Your payment has been confirmed and your subscription is now active.`,
        type: 'subscription',
        reference_id: subscription.id,
        is_read: false,
        created_at: new Date().toISOString()
      });
    } else {
      console.log(`No pending subscription found for transaction ${tx.tx_hash}`);
    }
  } catch (error) {
    console.error(`Error processing confirmed transaction: ${error.message}`);
    throw error;
  }
} 