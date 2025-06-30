import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/wallet/WalletConnect";
import { Shield, Wallet as WalletIcon, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Wallet() {
  const { toast } = useToast();
  const [verified, setVerified] = useState(false);

  const handleVerified = (address: string) => {
    toast({
      title: "Wallet Verified",
      description: `Successfully verified wallet: ${address.slice(0, 6)}...${address.slice(-4)}`,
    });
    setVerified(true);
    
    // In a real app, you might:
    // - Update user profile with verified address
    // - Unlock premium content
    // - Enable additional features
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <WalletIcon className="w-6 h-6 text-blue-400"/>
              <CardTitle className="text-xl">Wallet Verification</CardTitle>
            </div>
            <CardDescription>
              Connect your wallet to unlock premium features and verify your identity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnect onVerified={handleVerified}/>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-white">Why Connect Your Wallet?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0"/>
              <div>
                <span className="font-medium text-white">Secure Verification: </span>We use non-custodial wallet signing to verify ownership without storing your private keys.
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0"/>
              <div>
                <span className="font-medium text-white">Unlock Premium Features: </span>Access advanced trading strategies, backtesting capabilities, and advanced indicators.
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <WalletIcon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0"/>
              <div>
                <span className="font-medium text-white">Seamless Experience: </span>Your wallet connects directly to our service without any intermediaries.
              </div>
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