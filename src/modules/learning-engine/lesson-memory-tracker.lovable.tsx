// TODO: implement spaced repetition memory tracker
import React from 'react';

interface LessonMemoryTrackerProps {
  userId?: string;
}

interface MemoryItem {
  id: string;
  concept: string;
  lastReview: Date;
  nextReview: Date;
  strength: number;
  reviews: number;
  category: string;
}

export const LessonMemoryTracker: React.FC<LessonMemoryTrackerProps> = ({ userId }) => {
  const [memories, setMemories] = React.useState<MemoryItem[]>([
    {
      id: '1',
      concept: 'SMA Crossover Strategy',
      lastReview: new Date('2024-02-10'),
      nextReview: new Date('2024-02-13'),
      strength: 0.85,
      reviews: 5,
      category: 'Technical Analysis'
    },
    {
      id: '2',
      concept: 'Risk-Reward Ratio',
      lastReview: new Date('2024-02-11'),
      nextReview: new Date('2024-02-12'),
      strength: 0.92,
      reviews: 8,
      category: 'Risk Management'
    },
    {
      id: '3',
      concept: 'Volume Profile Analysis',
      lastReview: new Date('2024-02-08'),
      nextReview: new Date('2024-02-14'),
      strength: 0.65,
      reviews: 3,
      category: 'Market Structure'
    }
  ]);

  const [selectedMemory, setSelectedMemory] = React.useState<MemoryItem | null>(null);

  const reviewConcept = (memory: MemoryItem) => {
    setSelectedMemory(memory);
    // TODO: Connect to updateMemoryStrength function
  };

  const getDaysUntilReview = (date: Date) => {
    const days = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'text-green-500';
    if (strength >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{fontSize: '16px'}}>🧠</span>
        <h2 style={{ fontWeight: "700" }}>Memory Tracker</h2>
      </div>

      <div >
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "1.875rem", fontWeight: "700" }}>{memories.length}</p>
          <p >Concepts Learned</p>
        </div>
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "1.875rem", fontWeight: "700" }}>
            {memories.filter(m => getDaysUntilReview(m.nextReview) <= 0).length}
          </p>
          <p >Due for Review</p>
        </div>
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "1.875rem", fontWeight: "700" }}>
            {Math.round(memories.reduce((acc, m) => acc + m.strength, 0) / memories.length * 100)}%
          </p>
          <p >Average Retention</p>
        </div>
      </div>

      <div >
        {memories.map((memory) => {
          const daysUntil = getDaysUntilReview(memory.nextReview);
          const isDue = daysUntil <= 0;

          return (
            <div
              key={memory.id}
              className={`p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
                isDue ? 'border-yellow-500/50' : ''
              }`}
              onClick={() => reviewConcept(memory)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <h3 >{memory.concept}</h3>
                  <p >{memory.category}</p>
                </div>
                <div >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{fontSize: '16px'}}>⏰</span>
                    <span >
                      {isDue ? (
                        <span >Review now</span>
                      ) : (
                        `Review in ${daysUntil} days`
                      )}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{fontSize: '16px'}}>📈</span>
                    <span className={`text-sm font-medium ${getStrengthColor(memory.strength)}`}>
                      {Math.round(memory.strength * 100)}% strength
                    </span>
                  </div>
                </div>
              </div>
              
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>Memory Strength</span>
                  <span>{memory.reviews} reviews</span>
                </div>
                <Progress value={memory.strength * 100}  />
              </div>

              {isDue && (
                <Button size="sm" style={{ width: "100%" }}>
                  Start Review
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px" }}>
        <p >
          Concepts are scheduled for review based on spaced repetition algorithm to maximize retention
        </p>
      </div>
    </Card>
  );
}; 