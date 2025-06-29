// TODO: implement memory store for journal insights
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, Hash } from 'lucide-react';

interface MemoryStoreProps {
  userId?: string;
}

export const MemoryStore: React.FC<MemoryStoreProps> = ({ userId }) => {
  const [memories, setMemories] = React.useState([
    {
      id: 1,
      type: 'pattern',
      content: 'Best trades happen after morning meditation',
      strength: 0.85,
      occurrences: 12,
      lastSeen: new Date('2024-02-10')
    },
    {
      id: 2,
      type: 'lesson',
      content: 'Avoid trading during FOMC announcements',
      strength: 0.92,
      occurrences: 8,
      lastSeen: new Date('2024-02-08')
    },
    {
      id: 3,
      type: 'emotion',
      content: 'Anxiety increases after 3 consecutive losses',
      strength: 0.78,
      occurrences: 5,
      lastSeen: new Date('2024-02-05')
    }
  ]);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'bg-blue-500/20 text-blue-500';
      case 'lesson': return 'bg-green-500/20 text-green-500';
      case 'emotion': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <Card className="theme-card p-6" />
      <Div className="flex items-center gap-2 mb-4">
        <brain className="h-6 w-6" />
        <H2 className="text-2xl font-bold">Memory Store</MemoryStoreProps>
      </Div>

      <Div className="space-y-4">
        {memories.map((memory) => (
          <Div key={memory.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <Div className="flex items-start justify-between mb-2">
              <Badge variant="default" className={getTypeColor(memory.type)}>
                {memory.type}
              </Div>
              <Div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {memory.occurrences}
                </Div>
                <Span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {memory.lastSeen.toLocaleDateString()}
                </Span>
              </Div>
            </Div>
            
            <P className="text-sm mb-2">{memory.content}</P>
            
            <Div className="flex items-center gap-2">
              <Span className="text-xs text-muted-foreground">Strength:</Div>
              <Div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <Div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${memory.strength * 100}%` }}
                />
              </Div>
              <Span className="text-xs font-medium">{(memory.strength * 100).toFixed(0)}%</Span>
            </Div>
          </Div>
        ))}
      </Div>

      <Div className="mt-4 pt-4 border-t">
        <P className="text-sm text-muted-foreground">
          Memories are extracted from your journal entries and strengthen with repetition
        </Div>
      </Div>
    </Card>
  );
}; 