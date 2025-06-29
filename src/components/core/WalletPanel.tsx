import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TokenBalanceCard from '@/components/ui/TokenBalanceCard';
import { getBalances, getMockInitialBalances, TokenBalance } from '@/lib/wallet/getBalances';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle } from 'lucide-react';
import '@/styles/wallet.css';

const WalletPanel: React.FC = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  // On mount, check for a stored address and load mock balances
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      fetchBalances(storedAddress);
    } else {
      fetchInitialBalances();
    }
  }, []);

  const fetchInitialBalances = async () => {
    setLoading(true);
    const mockBalances = await getMockInitialBalances();
    setBalances(mockBalances);
    setLoading(false);
  };

  const fetchBalances = async (addr: string) => {
    setLoading(true);
    try {
      const newBalances = await getBalances(addr);
      setBalances(newBalances);
      toast({
        title: 'Balances Updated',
        description: `Displaying balances for ${addr.substring(0, 6)}...`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Fetching Balances',
        description: 'Could not retrieve balances for the provided address.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (!inputValue) {
      toast({
        variant: 'destructive',
        title: 'Invalid Address',
        description: 'Please enter a valid wallet address.',
      });
      return;
    }
    localStorage.setItem('walletAddress', inputValue);
    setAddress(inputValue);
    fetchBalances(inputValue);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('walletAddress');
    setAddress(null);
    setInputValue('');
    fetchInitialBalances();
    toast({ title: 'Wallet Disconnected' });
  };

  const renderContent = () => {
    if (address) {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p>Wallet Connected: <span className="font-mono">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</span></p>
            </div>
            <Button variant="outline" onClick={handleDisconnect} size="sm">Disconnect</Button>
          </div>
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <animatePresence>
              {balances.map((token, index) => (
                <TokenBalanceCard key={token.chain.id} token={token} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="wallet-connect-cta">
        <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">Connect to access premium features and verify subscription payments.</p>
        <div className="flex max-w-md mx-auto">
          <input type="text" 
            placeholder="Enter any wallet address to simulate..."
            value={inputValue}
            onChange={(e) = /> setInputValue(e.target.value)}
            className="flex-grow mr-2 bg-gray-800/50 border-gray-600"
          />
          <button onClick={handleConnect} className="connect-wallet-btn shrink-0">Connect</Button>
        </div>
      </div>
    );
  };

  return <div className="wallet-panel">{renderContent()}</div>;
};

export default WalletPanel;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 