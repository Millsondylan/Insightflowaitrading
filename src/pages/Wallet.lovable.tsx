import * as React from "react";
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
    <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "16px" }}>Wallet Verification</h1>
          <p >
            Connect your crypto wallet to verify ownership and unlock premium features.
          </p>
        </div>

        <WalletConnect onVerified={handleVerified} />

        <div style={{ padding: "24px" }}>
          <h2 style={{ color: "white" }}>Why Connect Your Wallet?</h2>
          
          <div >
            <div style={{ display: "flex" }}>
              <div >🔒</div>
              <p>
                <span style={{ color: "white" }}>Secure Verification:</span> We use non-custodial wallet signing to verify ownership without storing your private keys.
              </p>
            </div>
            
            <div style={{ display: "flex" }}>
              <div >⚡</div>
              <p>
                <span style={{ color: "white" }}>Unlock Premium Features:</span> Access advanced trading strategies, backtesting capabilities, and advanced indicators.
              </p>
            </div>
            
            <div style={{ display: "flex" }}>
              <div >🔄</div>
              <p>
                <span style={{ color: "white" }}>Seamless Experience:</span> Your wallet connects directly to our service without any intermediaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 