import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/components/ui/use-toast";
import { TokenBalance } from "@/lib/wallet/getBalances";
import { cn } from "@/lib/utils";
import "@/styles/wallet.css";

interface TokenBalanceCardProps {
  token: TokenBalance;
  index: number;
}

const TokenBalanceCard: React.FC<Tokenbalancecardprops > = ({ token, index }) => {
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
        <Div className="relative z-10">
          {/* Header */}
          <Div className="flex items-start justify-between mb-4">
            <Div className="flex items-center space-x-3">
              <Img src={chain.logo} alt={`${chain.name} logo`} className="h-10 w-10" />
              <Div>
                <H3 className="text-xl font-bold text-white">{chain.name}</Tokenbalancecardprops>
                <P className="text-sm text-gray-400">{chain.ticker}</P>
              </Div>
            </Div>
            <Div
              className={cn(
                "status-indicator",
                hasSufficientBalance ? "status-indicator-sufficient" : "status-indicator-insufficient"
              )}
            />
          </Div>

          {/* Balance */}
          <Div className="my-6 text-center">
            <P className="text-4xl font-bold tracking-tight text-white">{balance.toLocaleString()}</Div>
            <P className="text-gray-400 text-lg">${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</P>
          </Div>

          {/* Address and Actions */}
          <Div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
            <Span className="font-mono text-sm text-gray-300">{shortAddress}</Div>
            <Div className="flex items-center space-x-2">
              <Button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                {copied ? <Check  /> : <Copy >}
              </Div>
              <Button onClick={() => setShowQr(true)} className="text-gray-400 hover:text-white transition-colors">
                <Qrcode  />
              </Button>
            </Div>
          </Div>
        </Div>

        {/* Shimmer Effect */}
        <Div className="shimmer-overlay" />
        
        {/* Glow Effect */}
        <Div className={cn("card-glow", `glow-${chain.theme.primaryColor}`)} />
      </motion.div>

      {/* QR Code Modal */}
      {showQr && (
        <Div className="qr-code-modal" onClick={() => setShowQr(false)}>
          <Div className="qr-code-content" onClick={(e) => e.stopPropagation()}>
            <H3 className="text-lg font-bold mb-4">Scan to Deposit {chain.ticker}</Div>
            <Div className="p-4 bg-white rounded-lg inline-block">
              <qrcodesvg >
            </Div>
            <P className="font-mono text-sm text-gray-400 mt-4 break-all">{address}</P>
          </Div>
        </Div>
      )}
    </>
  );
};

export default TokenBalanceCard; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
