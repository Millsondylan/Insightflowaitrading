import React from 'react';
import { BestSetupsPage as BestSetupsComponent } from '@/components/markets/BestSetupsPage';
import { PublicSetup } from '@/lib/db/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import TradingViewChart from '@/components/charts/TradingViewChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Heart, Bookmark, Share2, Copy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Extended interface for PublicSetup with user information
interface PublicSetupWithUser extends PublicSetup {
  user?: {
    displayName?: string;
    avatarUrl?: string;
  };
}

export default function BestSetupsPage() {
  const [selectedSetup, setSelectedSetup] = useState<PublicSetupWithUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleSetupSelect = (setup: PublicSetup) => {
    // Cast to the extended interface when storing
    setSelectedSetup(setup as PublicSetupWithUser);
    setChartData(generateChartData(setup));
    setIsDialogOpen(true);
  };

  const generateChartData = (setup: PublicSetup) => {
    const data = [];
    let time = new Date(setup.sharedAt);
    time.setHours(time.getHours() - 100);
    
    // Use the entry price as the base
    let basePrice = setup.entry * 0.95 + (Math.random() * setup.entry * 0.1);
    
    for (let i = 0; i < 100; i++) {
      const volatility = 0.015;
      const changePercent = (Math.random() - 0.5) * volatility;
      basePrice *= (1 + changePercent);
      
      const open = basePrice;
      const close = basePrice * (1 + (Math.random() - 0.5) * 0.005);
      const high = Math.max(open, close) * (1 + Math.random() * 0.003);
      const low = Math.min(open, close) * (1 - Math.random() * 0.003);
      
      time = new Date(time.getTime() + 15 * 60000); // 15 minute intervals
      
      data.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close
      });
    }
    
    return data;
  };

  return (
    <div className="container py-6">
      <BestSetupsComponent onSetupSelect={handleSetupSelect}/>
      
      {selectedSetup && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="flex items-center">
                    {selectedSetup.symbol}
                    <Badge variant={selectedSetup.tp > selectedSetup.entry ? 'default' : 'destructive'} className="ml-2">
                      {selectedSetup.tp > selectedSetup.entry ? (
                        <span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3"/> LONG</span>
                      ) : (
                        <span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3"/> SHORT</span>
                      )}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedSetup.timeframe} Setup • Posted {new Date(selectedSetup.sharedAt).toLocaleDateString()}
                  </DialogDescription>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedSetup.user?.avatarUrl} alt={selectedSetup.user?.displayName}/>
                    <AvatarFallback>{selectedSetup.user?.displayName?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </DialogHeader>
            
            <div className="h-[300px] mb-4">
              {chartData.length > 0 && (
                <TradingViewChart 
                  data={chartData}
                  overlays={[
                    {
                      type: 'price',
                      price: selectedSetup.entry,
                      color: '#3b82f6',
                      lineStyle: 'solid',
                      lineWidth: 2,
                      label: 'Entry'
                    },
                    {
                      type: 'price',
                      price: selectedSetup.sl,
                      color: '#ef4444',
                      lineStyle: 'dashed',
                      lineWidth: 1,
                      label: 'SL'
                    },
                    {
                      type: 'price',
                      price: selectedSetup.tp,
                      color: '#22c55e',
                      lineStyle: 'dashed',
                      lineWidth: 1,
                      label: 'TP'
                    }
                  ]}
                  height={300}
               />
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Entry</div>
                <div className="font-semibold">{selectedSetup.entry.toFixed(5)}</div>
              </div>
              <div className="bg-red-500/10 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Stop Loss</div>
                <div className="font-semibold">{selectedSetup.sl.toFixed(5)}</div>
              </div>
              <div className="bg-green-500/10 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Take Profit</div>
                <div className="font-semibold">{selectedSetup.tp.toFixed(5)}</div>
              </div>
            </div>
            
            {selectedSetup.stats?.patternDescription && (
              <div className="bg-muted/30 p-3 rounded-md mb-4">
                <div className="text-sm font-medium mb-1">Pattern</div>
                <div className="text-sm">{selectedSetup.stats.patternDescription}</div>
              </div>
            )}
            
            {selectedSetup.stats?.backtestResults && (
              <div className="bg-muted/30 p-3 rounded-md mb-4">
                <div className="text-sm font-medium mb-2">Backtest Results</div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                    <div>{Math.round((selectedSetup.stats.backtestResults.winRate || 0) * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Profit Factor</div>
                    <div>{(selectedSetup.stats.backtestResults.profitFactor || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Avg. R</div>
                    <div>{(selectedSetup.stats.backtestResults.averageR || 0).toFixed(1)}R</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sample Size</div>
                    <div>{selectedSetup.stats.backtestResults.totalTrades || 0}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button size="sm" variant="outline">
                  <Heart className="mr-2 h-4 w-4"/> Like
                </Button>
                <Button size="sm" variant="outline">
                  <Bookmark className="mr-2 h-4 w-4"/> Save
                </Button>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline">
                  <Copy className="mr-2 h-4 w-4"/> Copy
                </Button>
                <Button size="sm">
                  <Share2 className="mr-2 h-4 w-4"/> Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

