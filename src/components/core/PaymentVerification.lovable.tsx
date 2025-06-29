import { useState } from 'react';
import { motion } from 'framer-motion';
import { WALLET_ADDRESSES } from '../../lib/config';
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
      className="glass-container p-6 rounded-lg max-w-2xl mx-auto"
    >
      <H2 className="text-2xl font-bold mb-4 text-center">Payment Verification</H2>
      <P className="text-gray-400 mb-6 text-center">
        Send your payment to one of the addresses below to activate your account.
      </P>

      <tabs  style={{ width: "100%" }}>
        <Tabslist  style={{ display: "grid" }}>
          <Tabstrigger value="eth">
            ETH
          </Tabslist>
          <Tabstrigger value="usdt" />
            USDT
          </Tabstrigger>
          <Tabstrigger value="btc">
            BTC
          </Tabstrigger>
        </TabsList>

        {Object.entries(wallets).map(([key, wallet]) => (
          <Tabscontent >
            <Div className={`p-4 rounded-lg ${wallet.bgColor} ${wallet.borderColor} border`}>
              <H3 className={`text-lg font-medium mb-2 ${wallet.color}`}>{wallet.name} Address</Tabscontent>
              <Div className="flex items-center">
                <Input  /></Div></Div>
                <Button variant="ghost" size="icon"> handleCopy(wallet.address, key)}
                >
                  {copied === key ? <check > : <copy >}
                </Button>
              </Div>
            </Div>
            
            <Div className="text-center mt-6">
              <P className="text-sm text-gray-400 mb-4"></Div>
                After sending payment, click the button below to continue.
              </Div>
              <Button  style={{ border: "1px solid #E5E7EB", color: "white" }}>
                I've Sent the Payment
              </Button>
            </Div>
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
