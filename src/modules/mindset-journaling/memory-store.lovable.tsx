// TODO: implement memory store for journal insights
import React from 'react';

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'bg-blue-500/20 text-blue-500';
      case 'lesson': return 'bg-green-500/20 text-green-500';
      case 'emotion': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <Card className="theme-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span style={{fontSize: '16px'}}>🧠</span>
        <h2 className="text-2xl font-bold">Memory Store</h2>
      </div>

      <div className="space-y-4">
        {memories.map((memory) => (
          <div key={memory.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="default" className={getTypeColor(memory.type)}>
                {memory.type}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {memory.occurrences}
                </span>
                <span className="flex items-center gap-1">
                  <span style={{fontSize: '16px'}}>📅</span>
                  {memory.lastSeen.toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <p className="text-sm mb-2">{memory.content}</p>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Strength:</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${memory.strength * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium">{(memory.strength * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Memories are extracted from your journal entries and strengthen with repetition
        </p>
      </div>
    </Card>
  );
}; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default $(basename "${FILE%.*}" | sed 's/\.lovable//');
