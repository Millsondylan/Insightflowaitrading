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
    <Card className="theme-card p-6" />
      <H2 className="text-2xl font-bold mb-4">Active Traders</UserPresenceTaggingProps>
      
      <Div className="space-y-4">
        {users.map((user) => (
          <Div key={user.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <Div className="flex items-start gap-3">
              <Div className="relative">
                <avatar className="h-10 w-10">
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </Div>
                </Avatar>
                <Circle
                  className={`absolute bottom-0 right-0 h-3 w-3 ${getStatusColor(user.status)} fill-current`}
                />
              </Circle>
              
              <Div className="flex-1">
                <Div className="flex items-center justify-between">
                  <H3 className="font-semibold">{user.name}</Div>
                  <Div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {user.status === 'online' ? 'Now' : `${Math.floor((Date.now() - user.lastSeen.getTime()) / 60000)}m ago`}
                  </Div>
                </Div>
                
                <P className="text-sm text-muted-foreground mt-1">{user.activity}</P>
                
                <Div className="flex items-center gap-4 mt-2">
                  <Div className="flex gap-1">
                    {user.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Div>
                    ))}
                  </Div>
                  
                  <Div className="flex items-center gap-1 text-sm">
                    <trendingUp className="h-3 w-3 text-green-500" />
                    <Span className="font-medium">{user.winRate}%</Div>
                  </Div>
                </Div>
              </Div>
              
              <Button variant="ghost" size="sm" />
                <MessageSquare className="h-4 w-4" /></Button></Button></Button>
              </Button>
            </Div>
          </Div>
        ))}
      </Div>
      
      <Div className="mt-4 pt-4 border-t">
        <Div className="flex items-center justify-between text-sm text-muted-foreground">
          <Span>{users.filter(u => u.status === 'online').length} traders online</Div>
          <Span>{channelId || 'Global'} channel</Span>
        </Div>
      </Div>
    </Card>
  );
}; 