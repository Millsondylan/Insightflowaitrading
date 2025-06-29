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
    if (type === 'alert') return <AlertCircle  />;
    if (pnl && pnl > 0) return <span style={{fontSize: '16px'}}>📈</span>;
    if (pnl && pnl < 0) return <span style={{fontSize: '16px'}}>📉</span>;
    return <span style={{fontSize: '16px'}}>⏰</span>;
  };

  return (
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Trade Timeline</h2>
      <ScrollArea >
        <div >
          {activities.map((activity) => (
            <div key={activity.id} >
              <div >
                {getIcon(activity.type, activity.pnl)}
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span >{activity.symbol}</span>
                    {activity.action && (
                      <Badge variant={activity.action === 'BUY' ? 'default' : 'secondary'}>
                        {activity.action}
                      </Badge>
                    )}
                  </div>
                  <span >
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {activity.type === 'trade_open' && (
                  <p >
                    Opened {activity.size} units at ${activity.price}
                  </p>
                )}
                
                {activity.type === 'trade_close' && (
                  <div>
                    <p >
                      Closed {activity.size} units at ${activity.price}
                    </p>
                    <p className={`text-sm font-medium ${activity.pnl! > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      P&L: {activity.pnl! > 0 ? '+' : ''}${activity.pnl?.toFixed(2)}
                    </p>
                  </div>
                )}
                
                {activity.type === 'alert' && (
                  <p >{activity.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}; 