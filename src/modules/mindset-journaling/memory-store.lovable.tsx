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
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <span style={{fontSize: '16px'}}>🧠</span>
        <h2 style={{ fontWeight: "700" }}>Memory Store</h2>
      </div>

      <div >
        {memories.map((memory) => (
          <div key={memory.id} style={{ padding: "16px", border: "1px solid #374151" }}>
            <div style={{ display: "flex" }}>
              <Badge variant="default" className={getTypeColor(memory.type)}>
                {memory.type}
              </Badge>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <Hash  />
                  {memory.occurrences}
                </span>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span style={{fontSize: '16px'}}>📅</span>
                  {memory.lastSeen.toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <p >{memory.content}</p>
            
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Strength:</span>
              <div >
                <div 
                  
                  style={{ width: `${memory.strength * 100}%` }}
                />
              </div>
              <span >{(memory.strength * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div >
        <p >
          Memories are extracted from your journal entries and strengthen with repetition
        </p>
      </div>
    </Card>
  );
}; 