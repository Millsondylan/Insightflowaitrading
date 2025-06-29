// TODO: implement user presence and activity tagging
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Circle, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserPresenceTaggingProps {
  channelId?: string;
}

export const UserPresenceTagging: React.FC<UserPresenceTaggingProps> = ({ channelId }) => {
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-4">Active Traders</h2>
      
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="relative">
                <avatar className="h-10 w-10">
                  <avatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`absolute bottom-0 right-0 h-3 w-3 ${getStatusColor(user.status)} fill-current`}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {user.status === 'online' ? 'Now' : `${Math.floor((Date.now() - user.lastSeen.getTime()) / 60000)}m ago`}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">{user.activity}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex gap-1">
                    {user.tags.map((tag) => (
                      <badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <trendingUp className="h-3 w-3 text-green-500" />
                    <span className="font-medium">{user.winRate}%</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{users.filter(u => u.status === 'online').length} traders online</span>
          <span>{channelId || 'Global'} channel</span>
        </div>
      </div>
    </Card>
  );
}; 