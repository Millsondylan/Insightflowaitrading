
// TODO: implement live event room
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Radio, MessageSquare } from 'lucide-react';

interface LiveEventRoomProps {
  eventId?: string;
}

export const LiveEventRoom: React.FC<LiveEventRoomProps> = ({ eventId }) => {
  const [participants, setParticipants] = React.useState([
    { id: 1, name: 'John D.', role: 'Host', status: 'speaking' },
    { id: 2, name: 'Sarah M.', role: 'Participant', status: 'listening' },
    { id: 3, name: 'Mike R.', role: 'Participant', status: 'listening' }
  ]);

  const [messages, setMessages] = React.useState([
    { id: 1, user: 'Sarah M.', message: 'Great insights on risk management!', timestamp: new Date() },
    { id: 2, user: 'Mike R.', message: 'Can you share the chart analysis?', timestamp: new Date() }
  ]);

  return (
    <Card className="theme-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Radio className="h-6 w-6 text-red-500"/>
          <div>
            <h2 className="text-2xl font-bold">Trading Strategy Discussion</h2>
            <p className="text-sm text-muted-foreground">Live event room</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Radio className="h-3 w-3 mr-1"/>
          LIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-secondary/20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Current Topic</h3>
            <p className="text-sm text-muted-foreground">
              Advanced Risk Management Strategies for Volatile Markets
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Participants ({participants.length})</h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      participant.status === 'speaking' ? 'bg-green-500' : 'bg-gray-400'
                    }`}/>
                    <span className="font-medium">{participant.name}</span>
                    <Badge variant="outline">{participant.role}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {participant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5"/>
            <h3 className="font-semibold">Live Chat</h3>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="p-2 bg-secondary/10 rounded text-sm">
                <div className="font-medium text-xs mb-1">{msg.user}</div>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Join Discussion
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
