export interface Chain {
  id: string;
  name: string;
  ticker: string;
  logo: string;
  decimals: number;
  theme: {
    primaryColor: string; // e.g., 'violet'
    glowColor: string; // for tailwind shadow color, e.g., 'violet-500/30'
  };
  addressPrefix?: string;
  exampleAddress: string;
}

export const SUPPORTED_CHAINS: Record<string, Chain> = {
  ETH: {
    id: 'ethereum',
    name: 'Ethereum',
    ticker: 'ETH',
    logo: '/logos/ethereum-logo.svg', // Assuming logos are in public/logos
    decimals: 18,
    theme: {
      primaryColor: 'violet',
      glowColor: 'shadow-violet-500/30',
    },
    addressPrefix: '0x',
    exampleAddress: '0xb0b544d7d13b4e3aE24581e2F88a5314757A90aC',
  },
  BTC: {
    id: 'bitcoin',
    name: 'Bitcoin',
    ticker: 'BTC',
    logo: '/logos/bitcoin-logo.svg',
    decimals: 8,
    theme: {
      primaryColor: 'orange',
      glowColor: 'shadow-orange-500/30',
    },
    exampleAddress: '1KcYGjJeP8s8yCgwsx9dY1G3K1aB2b3c4D',
  },
  TRX: {
    id: 'tron',
    name: 'TRON (USDT)',
    ticker: 'USDT',
    logo: '/logos/tron-usdt-logo.svg',
    decimals: 6,
    theme: {
      primaryColor: 'green',
      glowColor: 'shadow-green-500/30',
    },
    addressPrefix: 'T',
    exampleAddress: 'TLEgUbA8pCjWub53kM4E2k2nF8C1D5A6E7',
  },
};

export const getChainByTicker = (ticker: string): Chain | undefined => {
  return Object.values(SUPPORTED_CHAINS).find(
    (chain) => chain.ticker === ticker
  );
}; 