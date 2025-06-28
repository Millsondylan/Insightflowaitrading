// TODO: implement trade timeline with activity feed
import React from 'react';

interface TradeTimelineProps {
  userId?: string;
  limit?: number;
}

export const TradeTimeline: React.FC<TradeTimelineProps> = ({ userId, limit = 20 }) => {
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
    if (type === 'alert') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (pnl && pnl > 0) return <span style={{fontSize: '16px'}}>📈</span>;
    if (pnl && pnl < 0) return <span style={{fontSize: '16px'}}>📉</span>;
    return <span style={{fontSize: '16px'}}>⏰</span>;
  };

  return (
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-4">Trade Timeline</h2>
      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6 pb-4 last:pb-0">
              <div className="absolute left-0 top-1">
                {getIcon(activity.type, activity.pnl)}
              </div>
              <div className="border-l-2 border-gray-700 pl-6 -ml-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{activity.symbol}</span>
                    {activity.action && (
                      <Badge variant={activity.action === 'BUY' ? 'default' : 'secondary'}>
                        {activity.action}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {activity.type === 'trade_open' && (
                  <p className="text-sm text-muted-foreground">
                    Opened {activity.size} units at ${activity.price}
                  </p>
                )}
                
                {activity.type === 'trade_close' && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Closed {activity.size} units at ${activity.price}
                    </p>
                    <p className={`text-sm font-medium ${activity.pnl! > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      P&L: {activity.pnl! > 0 ? '+' : ''}${activity.pnl?.toFixed(2)}
                    </p>
                  </div>
                )}
                
                {activity.type === 'alert' && (
                  <p className="text-sm text-muted-foreground">{activity.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}; 