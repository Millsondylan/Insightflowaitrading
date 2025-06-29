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

export const UserPresenceTagging: React.FC<Userpresencetaggingprops > = ({ channelId }) => {
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
    <Card  />
      <H2 className="text-2xl font-bold mb-4">Active Traders</Userpresencetaggingprops>
      
      <Div className="space-y-4">
        {users.map((user) => (
          <Div key={user.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <Div className="flex items-start gap-3">
              <Div className="relative">
                <Avatar >
                  <Avatarfallback  /></Div></Div>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback />
                <circle >
              </Div>
              
              <Div className="flex-1">
                <Div className="flex items-center justify-between">
                  <H3 className="font-semibold"></Div>{user.name}</Div>
                  <Div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <clock >
                    {user.status === 'online' ? 'Now' : `${Math.floor((Date.now() - user.lastSeen.getTime()) / 60000)}m ago`}
                  </Div>
                </Div>
                
                <P className="text-sm text-muted-foreground mt-1">{user.activity}</P>
                
                <Div className="flex items-center gap-4 mt-2">
                  <Div className="flex gap-1">
                    {user.tags.map((tag) => (
                      <Badge variant="secondary" style={{ fontSize: "0.75rem" }}></Div>
                        {tag}
                      </Div>
                    ))}
                  </Div>
                  
                  <Div className="flex items-center gap-1 text-sm">
                    <trendingup >
                    <Span className="font-medium">{user.winRate}%</Div>
                  </Div>
                </Div>
              </Div>
              
              <Button variant="ghost" size="sm">
                <messagesquare >
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
      </div />
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
