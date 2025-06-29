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
        <div >
          {/* Header */}
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={chain.logo} alt={`${chain.name} logo`}  />
              <div>
                <h3 style={{ fontWeight: "700", color: "white" }}>{chain.name}</h3>
                <p style={{ color: "#9CA3AF" }}>{chain.ticker}</p>
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
          <div >
            <p style={{ fontWeight: "700", color: "white" }}>{balance.toLocaleString()}</p>
            <p style={{ color: "#9CA3AF" }}>${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          {/* Address and Actions */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span >{shortAddress}</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={handleCopy} style={{ color: "#9CA3AF" }}>
                {copied ? <span style={{fontSize: '16px'}}>✅</span> : <Copy  />}
              </button>
              <button onClick={() => setShowQr(true)} style={{ color: "#9CA3AF" }}>
                <QrCode  />
              </button>
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div  />
        
        {/* Glow Effect */}
        <div className={cn("card-glow", `glow-${chain.theme.primaryColor}`)} />
      </motion.div>

      {/* QR Code Modal */}
      {showQr && (
        <div  onClick={() => setShowQr(false)}>
          <div  onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: "700", marginBottom: "16px" }}>Scan to Deposit {chain.ticker}</h3>
            <div style={{ padding: "16px" }}>
              <QRCodeSVG value={address} size={200} />
            </div>
            <p style={{ color: "#9CA3AF" }}>{address}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenBalanceCard; 