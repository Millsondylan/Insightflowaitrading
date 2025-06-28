import React, { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { TokenBalance } from "@/lib/wallet/getBalances";
import { cn } from "@/lib/utils";
import "@/styles/wallet.css";

interface TokenBalanceCardProps {
  token: TokenBalance;
  index: number;
}

const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({ token, index }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const { chain, address, balance, balanceUSD, hasSufficientBalance } = token;

  const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: "Address Copied!", description: address });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={cn(
          "token-balance-card",
          `theme-${chain.theme.primaryColor}`
        )}
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={chain.logo} alt={`${chain.name} logo`} className="h-10 w-10" />
              <div>
                <h3 className="text-xl font-bold text-white">{chain.name}</h3>
                <p className="text-sm text-gray-400">{chain.ticker}</p>
              </div>
            </div>
            <div
              className={cn(
                "status-indicator",
                hasSufficientBalance ? "status-indicator-sufficient" : "status-indicator-insufficient"
              )}
            />
          </div>

          {/* Balance */}
          <div className="my-6 text-center">
            <p className="text-4xl font-bold tracking-tight text-white">{balance.toLocaleString()}</p>
            <p className="text-gray-400 text-lg">${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          {/* Address and Actions */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
            <span className="font-mono text-sm text-gray-300">{shortAddress}</span>
            <div className="flex items-center space-x-2">
              <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                {copied ? <span style={{fontSize: '16px'}}>✅</span> : <Copy className="h-4 w-4" />}
              </button>
              <button onClick={() => setShowQr(true)} className="text-gray-400 hover:text-white transition-colors">
                <QrCode className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="shimmer-overlay" />
        
        {/* Glow Effect */}
        <div className={cn("card-glow", `glow-${chain.theme.primaryColor}`)} />
      </motion.div>

      {/* QR Code Modal */}
      {showQr && (
        <div className="qr-code-modal" onClick={() => setShowQr(false)}>
          <div className="qr-code-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Scan to Deposit {chain.ticker}</h3>
            <div className="p-4 bg-white rounded-lg inline-block">
              <QRCodeSVG value={address} size={200} />
            </div>
            <p className="font-mono text-sm text-gray-400 mt-4 break-all">{address}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenBalanceCard; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
