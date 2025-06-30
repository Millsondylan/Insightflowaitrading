import { Request, Response } from 'express';
import axios from 'axios';

interface VerifyPaymentRequest {
  txHash: string;
  cryptocurrency: 'BTC' | 'ETH' | 'USDT_ERC20' | 'USDT_TRC20';
  userId: string;
}

interface BlockchainTransaction {
  confirmations: number;
  amount: string;
  timestamp: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
}

const REQUIRED_CONFIRMATIONS = {
  BTC: 3,
  ETH: 12,
  USDT_ERC20: 12,
  USDT_TRC20: 19
};

const WALLET_ADDRESSES = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT_ERC20: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT_TRC20: "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYNub",
};

export async function verifyCryptoPayment(req: Request, res: Response) {
  try {
    const { txHash, cryptocurrency, userId } = req.body as VerifyPaymentRequest;

    if (!txHash || !cryptocurrency || !userId) {
      return res.status(400).json({
        error: 'Missing required parameters'
      });
    }

    let transaction: BlockchainTransaction;

    // Verify transaction based on cryptocurrency
    switch (cryptocurrency) {
      case 'BTC':
        transaction = await verifyBitcoinTransaction(txHash);
        break;
      case 'ETH':
      case 'USDT_ERC20':
        transaction = await verifyEthereumTransaction(txHash);
        break;
      case 'USDT_TRC20':
        transaction = await verifyTronTransaction(txHash);
        break;
      default:
        return res.status(400).json({
          error: 'Unsupported cryptocurrency'
        });
    }

    // Check if transaction is to our wallet
    if (transaction.to.toLowerCase() !== WALLET_ADDRESSES[cryptocurrency].toLowerCase()) {
      return res.status(400).json({
        error: 'Transaction not sent to correct wallet address'
      });
    }

    const requiredConfirmations = REQUIRED_CONFIRMATIONS[cryptocurrency];
    const isConfirmed = transaction.confirmations >= requiredConfirmations;

    return res.json({
      confirmations: transaction.confirmations,
      required_confirmations: requiredConfirmations,
      status: isConfirmed ? 'confirmed' : 'pending',
      timestamp: transaction.timestamp,
      amount: transaction.amount
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to verify payment'
    });
  }
}

async function verifyBitcoinTransaction(txHash: string): Promise<BlockchainTransaction> {
  try {
    // Using BlockCypher API (no API key required for basic usage)
    const response = await axios.get(
      `https://api.blockcypher.com/v1/btc/main/txs/${txHash}`
    );

    const data = response.data;
    const confirmations = data.confirmations || 0;
    const amount = data.outputs?.[0]?.value ? (data.outputs[0].value / 100000000).toString() : '0';
    const to = data.outputs?.[0]?.addresses?.[0] || '';

    return {
      confirmations,
      amount,
      timestamp: data.confirmed || data.received,
      to,
      status: confirmations >= REQUIRED_CONFIRMATIONS.BTC ? 'confirmed' : 'pending'
    };
  } catch (error) {
    throw new Error('Failed to verify Bitcoin transaction');
  }
}

async function verifyEthereumTransaction(txHash: string): Promise<BlockchainTransaction> {
  try {
    const etherscanApiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
    
    // Get transaction details
    const txResponse = await axios.get(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanApiKey}`
    );

    if (!txResponse.data.result) {
      throw new Error('Transaction not found');
    }

    const tx = txResponse.data.result;
    
    // Get current block number
    const blockResponse = await axios.get(
      `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${etherscanApiKey}`
    );

    const currentBlock = parseInt(blockResponse.data.result, 16);
    const txBlock = parseInt(tx.blockNumber, 16);
    const confirmations = txBlock ? currentBlock - txBlock : 0;

    // Convert amount from Wei to ETH
    const amount = (parseInt(tx.value, 16) / 1e18).toString();

    return {
      confirmations,
      amount,
      timestamp: new Date().toISOString(), // Etherscan doesn't provide timestamp in this endpoint
      to: tx.to,
      status: confirmations >= REQUIRED_CONFIRMATIONS.ETH ? 'confirmed' : 'pending'
    };
  } catch (error) {
    throw new Error('Failed to verify Ethereum transaction');
  }
}

async function verifyTronTransaction(txHash: string): Promise<BlockchainTransaction> {
  try {
    const response = await axios.get(
      `https://api.trongrid.io/v1/transactions/${txHash}`
    );

    if (!response.data.data || response.data.data.length === 0) {
      throw new Error('Transaction not found');
    }

    const tx = response.data.data[0];
    const confirmations = tx.blockNumber ? tx.confirmed ? 19 : 0 : 0;
    
    // Extract amount from contract data
    let amount = '0';
    if (tx.raw_data?.contract?.[0]?.parameter?.value?.amount) {
      amount = (tx.raw_data.contract[0].parameter.value.amount / 1000000).toString();
    }

    return {
      confirmations,
      amount,
      timestamp: new Date(tx.block_timestamp).toISOString(),
      to: tx.raw_data?.contract?.[0]?.parameter?.value?.to_address || '',
      status: confirmations >= REQUIRED_CONFIRMATIONS.USDT_TRC20 ? 'confirmed' : 'pending'
    };
  } catch (error) {
    throw new Error('Failed to verify Tron transaction');
  }
}

export default verifyCryptoPayment; 