
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  logo?: string;
}

interface TokenBalanceCardProps {
  token: TokenBalance;
  onTrade?: (symbol: string) => void;
}

const TokenBalanceCard = ({ token, onTrade }: TokenBalanceCardProps) => {
  const isPositive = token.change24h >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {token.logo ? (
                <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg font-semibold">{token.symbol}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{token.name}</CardDescription>
              </div>
            </div>
            
            <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-2xl font-bold">{token.balance.toFixed(6)} {token.symbol}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Value: </span>
              <span className="text-lg font-semibold">${token.value.toLocaleString()}</span>
            </div>
            
            {onTrade && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onTrade(token.symbol)}
                className="w-full"
              >
                Trade {token.symbol}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenBalanceCard;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
