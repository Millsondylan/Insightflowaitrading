import React, { useState } from 'react';
import WalletPanel from '@/components/core/WalletPanel';
import SubscriptionChecker from '@/components/core/SubscriptionChecker';
import { Wallet as WalletIcon, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WalletPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">Wallet & Subscription</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Connect your crypto wallet to verify premium access or use the subscription checker to verify your payment and unlock premium features.
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <Badge variant="outline" className="border-violet-500/50 text-violet-400">ETH</Badge>
          <Badge variant="outline" className="border-orange-500/50 text-orange-400">BTC</Badge>
          <Badge variant="outline" className="border-green-500/50 text-green-400">USDT (TRON)</Badge>
        </div>
      </div>
      
      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="verify" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Verify Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center space-x-2">
            <WalletIcon className="h-4 w-4" />
            <span>Wallet Connection</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verify">
          <SubscriptionChecker />
        </TabsContent>
        
        <TabsContent value="wallet">
          <WalletPanel />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Your wallet information is stored locally and never sent to our servers.</p>
        <p>This panel is for payment verification only.</p>
      </div>
    </div>
  );
};

export default WalletPage; 