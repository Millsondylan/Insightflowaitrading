import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/wallet/WalletConnect";

export default function Wallet() {
  const { toast } = useToast();

  const handleVerified = (address: string) => {
    toast({
      title: "Wallet Verified",
      description: `Successfully verified wallet: ${address.slice(0, 6)}...${address.slice(-4)}`,
    });
    
    // In a real app, you might:
    // - Update user profile with verified address
    // - Unlock premium content
    // - Redirect to subscription page
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Wallet Verification</h1>
          <p className="text-white/70">
            Connect your crypto wallet to verify ownership and unlock premium features.
          </p>
        </div>

        <WalletConnect onVerified={handleVerified} />

        <div className="mt-12 bg-black/20 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Why Connect Your Wallet?</h2>
          
          <div className="space-y-4 text-white/80">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-3">🔒</div>
              <p>
                <span className="font-medium text-white">Secure Verification:</span> We use non-custodial wallet signing to verify ownership without storing your private keys.
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-3">⚡</div>
              <p>
                <span className="font-medium text-white">Unlock Premium Features:</span> Access advanced trading strategies, backtesting capabilities, and advanced indicators.
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-3">🔄</div>
              <p>
                <span className="font-medium text-white">Seamless Experience:</span> Your wallet connects directly to our service without any intermediaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 