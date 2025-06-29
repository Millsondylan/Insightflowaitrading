// TODO: implement user presence and activity tagging
import React from 'react';

interface UserPresenceTaggingProps {
  channelId?: string;
}

export const UserPresenceTagging: React.FC<span style={{fontSize: '16px'}}>👤</span> = ({ channelId }) => {
  const [users, setUsers] = React.useState([
    {
      id: 1,
      name: 'Alex Thompson',
      status: 'online',
      activity: 'Analyzing BTCUSD',
      tags: ['Crypto', 'Scalping'],
      lastSeen: new Date(),
      winRate: 72
    },
    {
      id: 2,
      name: 'Sarah Miller',
      status: 'away',
      activity: 'In backtest mode',
      tags: ['Forex', 'Swing Trading'],
      lastSeen: new Date(Date.now() - 15 * 60000),
      winRate: 65
    },
    {
      id: 3,
      name: 'Mike Chen',
      status: 'online',
      activity: 'Sharing strategy',
      tags: ['Options', 'Technical Analysis'],
      lastSeen: new Date(),
      winRate: 80
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Active Traders</h2>
      
      <div >
        {users.map((user) => (
          <div key={user.id} style={{ padding: "16px", border: "1px solid #374151" }}>
            <div style={{ display: "flex" }}>
              <div >
                <Avatar >
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`absolute bottom-0 right-0 h-3 w-3 ${getStatusColor(user.status)} fill-current`}
                />
              </div>
              
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3 >{user.name}</h3>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{fontSize: '16px'}}>⏰</span>
                    {user.status === 'online' ? 'Now' : `${Math.floor((Date.now() - user.lastSeen.getTime()) / 60000)}m ago`}
                  </div>
                </div>
                
                <p >{user.activity}</p>
                
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex" }}>
                    {user.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{fontSize: '16px'}}>📈</span>
                    <span >{user.winRate}%</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <MessageSquare  />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{users.filter(u => u.status === 'online').length} traders online</span>
          <span>{channelId || 'Global'} channel</span>
        </div>
      </div>
    </Card>
  );
}; 