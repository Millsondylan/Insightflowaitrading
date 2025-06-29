import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { verifyOwnership } from "@/lib/wallet/verifyOwnership";
import { checkSubscription } from "@/lib/wallet/checkSubscription";

// Define Ethereum provider interface
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (accounts: string[]) => void) => void;
  removeListener: (event: string, callback: (accounts: string[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

type Props = {
  onVerified?: (address: string) => void;
};

export default function WalletConnect({ onVerified }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "verifying" | "verified" | "error">("idle");
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && Boolean(window.ethereum);

  // Handle account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setAddress(null);
        setStatus("idle");
        setError(null);
      } else if (accounts[0] !== address) {
        // New account selected
        setAddress(accounts[0]);
        setStatus("idle");
      }
    };

    if (isMetaMaskInstalled) {
      window.ethereum?.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (isMetaMaskInstalled) {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, [address, isMetaMaskInstalled]);

  // Connect wallet function
  const connectWallet = async () => {
    setStatus("connecting");
    setError(null);
    
    try {
      if (!isMetaMaskInstalled) {
        throw new Error("MetaMask is not installed");
      }

      const accounts = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus("idle");
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      setStatus("error");
      setError(error.message || "Failed to connect wallet");
    }
  };

  // Verify wallet ownership
  const verifyWallet = async () => {
    if (!address) return;
    
    setStatus("verifying");
    setError(null);
    
    try {
      const isVerified = await verifyOwnership(address);
      
      if (isVerified) {
        setStatus("verified");
        
        // Check subscription status
        const subscriptionStatus = await checkSubscription(address);
        setIsSubscribed(subscriptionStatus);
        
        // Call onVerified callback
        if (onVerified) {
          onVerified(address);
        }
      } else {
        throw new Error("Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setStatus("error");
      setError(error.message || "Failed to verify wallet ownership");
    }
  };

  return (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md text-white space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold">Wallet Connection</h2>
        <p className="text-white/70 text-sm">
          Connect your wallet to verify ownership and access premium features.
        </p>
      </div>

      {!isMetaMaskInstalled && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm">
          MetaMask is not installed. Please install MetaMask to continue.
          <div className="mt-2">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Download MetaMask
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {address && (
        <div className="bg-gray-800/50 rounded-lg p-4 break-all">
          <div className="text-sm text-gray-400">Connected Address:</div>
          <div className="font-mono">{address}</div>
        </div>
      )}

      {status === "verified" && (
        <div className={`rounded-lg p-4 ${isSubscribed ? "bg-green-900/20 border border-green-500/30" : "bg-yellow-900/20 border border-yellow-500/30"}`}>
          <div className="flex items-center">
            {isSubscribed ? (
              <>
                <span className="text-green-400 text-xl mr-2">✓</span>
                <div>
                  <div className="font-semibold">Subscription Active</div>
                  <div className="text-sm text-white/70">You have access to all premium features.</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-yellow-400 text-xl mr-2">⚠</span>
                <div>
                  <div className="font-semibold">No Active Subscription</div>
                  <div className="text-sm text-white/70">Consider upgrading to access premium features.</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="pt-2">
        {!address ? (
          <button  style={{ width: "100%" }}>
            {status === "connecting" ? "Connecting..." : "🔐 Connect Wallet"}
          </Button>
        ) : status === "verified" ? (
          <Button > window.location.reload()}
            className="w-full bg-gray-700 hover:bg-gray-600"
          >
            Disconnect
          </Button>
        ) : (
          <button  style={{ width: "100%" }}>
            {status === "verifying" ? "Verifying..." : "🔑 Verify Ownership"}
          </Button>
        )}
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
