
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';

interface WalletPanelProps {
  balance?: number;
  currency?: string;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ 
  balance = 10000, 
  currency = 'USD' 
}) => {
  const [showTransactions, setShowTransactions] = useState(false);
  
  const transactions = [
    { id: '1', type: 'deposit', amount: 5000, date: '2024-01-15', status: 'completed' },
    { id: '2', type: 'trade', amount: -250, date: '2024-01-14', status: 'completed' },
    { id: '3', type: 'deposit', amount: 2500, date: '2024-01-10', status: 'completed' },
  ];

  const totalGains = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalLosses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {balance.toLocaleString()} {currency}
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            +2.4% Today
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/70">Total Gains</span>
            </div>
            <div className="text-lg font-semibold text-green-400">
              +${totalGains.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-sm text-white/70">Total Losses</span>
            </div>
            <div className="text-lg font-semibold text-red-400">
              -${totalLosses.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Deposit
          </Button>
          <Button variant="outline" className="flex-1 text-white border-white/20 hover:bg-white/10">
            <Minus className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-white/70 hover:text-white"
          onClick={() => setShowTransactions(!showTransactions)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {showTransactions ? 'Hide' : 'Show'} Recent Transactions
        </Button>

        {showTransactions && (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.amount > 0 ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <div className="text-sm text-white capitalize">{transaction.type}</div>
                    <div className="text-xs text-white/60">{transaction.date}</div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletPanel;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
