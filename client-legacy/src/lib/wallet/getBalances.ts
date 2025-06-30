import { Chain, SUPPORTED_CHAINS } from './chains';

export interface TokenBalance {
  chain: Chain;
  address: string;
  balance: number;
  balanceUSD: number;
  hasSufficientBalance: boolean;
}

/**
 * Mocks fetching token balances for a given address.
 * In a real app, this would involve calling blockchain APIs (e.g., Etherscan, Infura).
 * @param address The wallet address to check.
 * @returns A promise that resolves to an array of token balances.
 */
export const getBalances = async (address: string): Promise<TokenBalance[]> => {
  console.log(`Fetching mock balances for address: ${address}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Determine which chain the address might belong to (very basic check)
  const getChainFromAddress = (addr: string): Chain | undefined => {
    if (addr.startsWith('0x')) return SUPPORTED_CHAINS.ETH;
    if (addr.startsWith('1') || addr.startsWith('3') || addr.startsWith('bc1')) return SUPPORTED_CHAINS.BTC;
    if (addr.startsWith('T')) return SUPPORTED_CHAINS.TRX;
    return undefined;
  };
  
  const targetChain = getChainFromAddress(address);
  
  // For this mock, we'll return a balance for the detected chain or for all if it's a generic string.
  const chainsToProcess = targetChain ? [targetChain] : Object.values(SUPPORTED_CHAINS);

  // Mock prices
  const mockPrices: Record<string, number> = {
    ETH: 3000,
    BTC: 60000,
    USDT: 1,
  };
  
  const balances = chainsToProcess.map(chain => {
    const balance = parseFloat((Math.random() * (chain.ticker === 'BTC' ? 0.5 : 10)).toFixed(4));
    const balanceUSD = balance * mockPrices[chain.ticker];
    
    // For now, any balance > $50 is considered "sufficient"
    const hasSufficientBalance = balanceUSD > 50;

    return {
      chain,
      address,
      balance,
      balanceUSD,
      hasSufficientBalance,
    };
  });
  
  return balances;
};

/**
 * Mocks fetching balances for all supported chains with their example addresses
 */
export const getMockInitialBalances = async (): Promise<TokenBalance[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockPrices: Record<string, number> = {
        ETH: 3000,
        BTC: 60000,
        USDT: 1,
    };

    return Object.values(SUPPORTED_CHAINS).map(chain => {
        const balance = parseFloat((Math.random() * (chain.ticker === 'BTC' ? 0.1 : 5)).toFixed(4));
        const balanceUSD = balance * mockPrices[chain.ticker];
        const hasSufficientBalance = balanceUSD > 50;

        return {
            chain,
            address: chain.exampleAddress,
            balance,
            balanceUSD,
            hasSufficientBalance,
        };
    });
}; 