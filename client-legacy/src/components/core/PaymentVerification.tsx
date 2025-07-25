import { useState } from 'react';
import { motion } from 'framer-motion';
import { config } from '../../lib/config';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Copy, Check } from 'lucide-react';

interface PaymentVerificationProps {
  onVerificationComplete?: () => void;
}

const PaymentVerification = ({ onVerificationComplete }: PaymentVerificationProps) => {
  const [activeTab, setActiveTab] = useState('eth');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const wallets = {
    eth: {
      name: 'Ethereum',
      address: config.walletAddresses.eth,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
    usdt: {
      name: 'USDT (Tron)',
      address: config.walletAddresses.usdt,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    btc: {
      name: 'Bitcoin',
      address: config.walletAddresses.btc,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-container p-6 rounded-lg max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Verification</h2>
      <p className="text-gray-400 mb-6 text-center">
        Send your payment to one of the addresses below to activate your account.
      </p>

      <Tabs value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-black/30">
          <TabsTrigger value="eth" 
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            ETH
          </TabsTrigger>
          <TabsTrigger value="usdt" 
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
            USDT
          </TabsTrigger>
          <TabsTrigger value="btc" 
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            BTC
          </TabsTrigger>
        </TabsList>

        {Object.entries(wallets).map(([key, wallet]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className={`p-4 rounded-lg ${wallet.bgColor} ${wallet.borderColor} border`}>
              <h3 className={`text-lg font-medium mb-2 ${wallet.color}`}>{wallet.name} Address</h3>
              <div className="flex items-center">
                <Input 
                  value={wallet.address} 
                  readOnly 
                  className="bg-black/30 border-gray-700 flex-grow"
                />
                <Button variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => handleCopy(wallet.address, key)}
                >
                  {copied === key ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400 mb-4">
                After sending payment, click the button below to continue.
              </p>
              <Button onClick={onVerificationComplete}
                className="glow-button bg-cyan-500/20 border border-cyan-500 text-white hover:bg-cyan-500/30">
                I've Sent the Payment
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default PaymentVerification;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 