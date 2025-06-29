import * as React from "react";
import { useState, useEffect } from "react";
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
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontWeight: "700" }}>Wallet Connection</h2>
        <p >
          Connect your wallet to verify ownership and access premium features.
        </p>
      </div>

      {!isMetaMaskInstalled && (
        <div style={{ border: "1px solid #374151", padding: "16px" }}>
          MetaMask is not installed. Please install MetaMask to continue.
          <div >
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              
            >
              Download MetaMask
            </a>
          </div>
        </div>
      )}

      {error && (
        <div style={{ border: "1px solid #374151", padding: "16px" }}>
          {error}
        </div>
      )}

      {address && (
        <div style={{ padding: "16px" }}>
          <div style={{ color: "#9CA3AF" }}>Connected Address:</div>
          <div >{address}</div>
        </div>
      )}

      {status === "verified" && (
        <div className={`rounded-lg p-4 ${isSubscribed ? "bg-green-900/20 border border-green-500/30" : "bg-yellow-900/20 border border-yellow-500/30"}`}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {isSubscribed ? (
              <>
                <span >✓</span>
                <div>
                  <div >Subscription Active</div>
                  <div >You have access to all premium features.</div>
                </div>
              </>
            ) : (
              <>
                <span >⚠</span>
                <div>
                  <div >No Active Subscription</div>
                  <div >Consider upgrading to access premium features.</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div >
        {!address ? (
          <Button
            onClick={connectWallet}
            disabled={status === "connecting" || !isMetaMaskInstalled}
            style={{ width: "100%" }}
          >
            {status === "connecting" ? "Connecting..." : "🔐 Connect Wallet"}
          </Button>
        ) : status === "verified" ? (
          <Button
            onClick={() => window.location.reload()}
            style={{ width: "100%" }}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={verifyWallet}
            disabled={status === "verifying"}
            style={{ width: "100%" }}
          >
            {status === "verifying" ? "Verifying..." : "🔑 Verify Ownership"}
          </Button>
        )}
      </div>
    </div>
  );
} 