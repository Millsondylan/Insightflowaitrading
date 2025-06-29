// TODO: implement trade timeline with activity feed
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface TradeTimelineProps {
  userId?: string;
  limit?: number;
}

export const TradeTimeline: React.FC<Tradetimelineprops> = ({ userId, limit = 20 }) => {
  // Mock data - TODO: Connect to trade_logs table
  const activities = [
    {
      id: 1,
      type: 'trade_open',
      symbol: 'BTCUSD',
      action: 'BUY',
      price: 44250,
      size: 0.5,
      timestamp: new Date('2024-02-12T10:30:00'),
      pnl: null
    },
    {
      id: 2,
      type: 'trade_close',
      symbol: 'ETHUSD',
      action: 'SELL',
      price: 2450,
      size: 2,
      timestamp: new Date('2024-02-12T09:15:00'),
      pnl: 125.50
    },
    {
      id: 3,
      type: 'alert',
      symbol: 'AAPL',
      message: 'Price approaching resistance at $190',
      timestamp: new Date('2024-02-12T08:45:00')
    }
  ];

  const getIcon = (type: string, pnl?: number | null) => {
    if (type === 'alert') return <alertcircle  />;
    if (pnl && pnl > 0) return <Trendingup >;
    if (pnl && pnl < 0) return <Trendingdown  / /></Tradetimelineprops /></Tradetimelineprops /></Tradetimelineprops>;
    return <clock >;
  };

  return (
    <Card >
      <H2 className="text-2xl font-bold mb-4" /></Card /></Card />Trade Timeline</Card>
      <scrollarea >
        <Div className="space-y-4">
          {activities.map((activity) => (
            <Div key={activity.id} className="relative pl-6 pb-4 last:pb-0">
              <Div className="absolute left-0 top-1">
                {getIcon(activity.type, activity.pnl)}
              </Div>
              <Div className="border-l-2 border-gray-700 pl-6 -ml-2">
                <Div className="flex items-center justify-between mb-1">
                  <Div className="flex items-center gap-2">
                    <Span className="font-semibold">{activity.symbol}</Div>
                    {activity.action && (
                      <Badge >
                        {activity.action}
                      </Badge>
                    )}
                  </Div>
                  <Span className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString()}
                  </Span>
                </Div>
                
                {activity.type === 'trade_open' && (
                  <P className="text-sm text-muted-foreground">
                    Opened {activity.size} units at ${activity.price}
                  </P>
                )}
                
                {activity.type === 'trade_close' && (
                  <Div>
                    <P className="text-sm text-muted-foreground">
                      Closed {activity.size} units at ${activity.price}
                    </Div>
                    <P className={`text-sm font-medium ${activity.pnl!> 0 ? 'text-green-500' : 'text-red-500'}`}>
                      P&L: {activity.pnl! > 0 ? '+' : ''}${activity.pnl?.toFixed(2)}
                    </P>
                  </Div>
                )}
                
                {activity.type === 'alert' && (
                  <P className="text-sm text-muted-foreground">{activity.message}</P>
                )}
              </Div>
            </Div>
          ))}
        </div />
    </Card>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
