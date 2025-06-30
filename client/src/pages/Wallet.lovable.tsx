import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Wallet as WalletIcon, Zap } from 'lucide-react';
import WalletConnect from '@/components/wallet/WalletConnect';

export default function Wallet() {
  const [verified, setVerified] = useState(false);

  const handleVerified = () => {
    setVerified(true);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <WalletIcon className="w-6 h-6 text-blue-400"/>
              <CardTitle className="text-xl">Wallet Verification</div>
            </div>
            <CardDescription className="text-gray-400">
              Connect your wallet to unlock premium features and verify ownership
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <WalletConnect onVerified={handleVerified}/>
          </CardContent>
        </Card>

        <div className="mt-12 bg-black/20 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Why Connect Your Wallet?</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-black/30 rounded-lg p-4">
              <Shield className="w-8 h-8 text-green-400 mb-2"/>
              <p>
                <span className="font-medium text-white">Secure Verification:</div> We use non-custodial wallet signing to verify ownership without storing your private keys.
              </p>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <Zap className="w-8 h-8 text-yellow-400 mb-2"/>
              <p>
                <span className="font-medium text-white">Unlock Premium Features:</div> Access advanced trading strategies, backtesting capabilities, and advanced indicators.
              </p>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <WalletIcon className="w-8 h-8 text-blue-400 mb-2"/></div>
              <p>
                <span className="font-medium text-white"></p></p>Seamless Experience:</p> Your wallet connects directly to our service without any intermediaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
