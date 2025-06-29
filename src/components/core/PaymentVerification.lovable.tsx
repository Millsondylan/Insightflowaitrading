import { useState } from 'react';
import { motion } from 'framer-motion';
import { WALLET_ADDRESSES } from '../../lib/config';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';

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
      address: WALLET_ADDRESSES.eth,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
    usdt: {
      name: 'USDT (Tron)',
      address: WALLET_ADDRESSES.usdt,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    btc: {
      name: 'Bitcoin',
      address: WALLET_ADDRESSES.btc,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "24px", marginLeft: "auto", marginRight: "auto" }}
    >
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Payment Verification</h2>
      <p style={{ color: "#9CA3AF" }}>
        Send your payment to one of the addresses below to activate your account.
      </p>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        style={{ width: "100%" }}
      >
        <TabsList >
          <TabsTrigger 
            value="eth" 
            
          >
            ETH
          </TabsTrigger>
          <TabsTrigger 
            value="usdt" 
            
          >
            USDT
          </TabsTrigger>
          <TabsTrigger 
            value="btc" 
            
          >
            BTC
          </TabsTrigger>
        </TabsList>

        {Object.entries(wallets).map(([key, wallet]) => (
          <TabsContent key={key} value={key} >
            <div className={`p-4 rounded-lg ${wallet.bgColor} ${wallet.borderColor} border`}>
              <h3 className={`text-lg font-medium mb-2 ${wallet.color}`}>{wallet.name} Address</h3>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input 
                  value={wallet.address} 
                  readOnly 
                  
                />
                <Button
                  variant="ghost"
                  size="icon"
                  
                  onClick={() => handleCopy(wallet.address, key)}
                >
                  {copied === key ? <span style={{fontSize: '16px'}}>✅</span> : <Copy  />}
                </Button>
              </div>
            </div>
            
            <div >
              <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>
                After sending payment, click the button below to continue.
              </p>
              <Button 
                onClick={onVerificationComplete}
                style={{ border: "1px solid #374151", color: "white" }}
              >
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