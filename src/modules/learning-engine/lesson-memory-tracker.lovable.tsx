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
    <Card className="theme-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <span style={{fontSize: '16px'}}>🧠</span>
        <h2 className="text-2xl font-bold">Memory Tracker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-secondary/20 rounded-lg">
          <p className="text-3xl font-bold">{memories.length}</p>
          <p className="text-sm text-muted-foreground">Concepts Learned</p>
        </div>
        <div className="text-center p-4 bg-secondary/20 rounded-lg">
          <p className="text-3xl font-bold">
            {memories.filter(m => getDaysUntilReview(m.nextReview) <= 0).length}
          </p>
          <p className="text-sm text-muted-foreground">Due for Review</p>
        </div>
        <div className="text-center p-4 bg-secondary/20 rounded-lg">
          <p className="text-3xl font-bold">
            {Math.round(memories.reduce((acc, m) => acc + m.strength, 0) / memories.length * 100)}%
          </p>
          <p className="text-sm text-muted-foreground">Average Retention</p>
        </div>
      </div>

      <div className="space-y-4">
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
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{memory.concept}</h3>
                  <p className="text-sm text-muted-foreground">{memory.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{fontSize: '16px'}}>⏰</span>
                    <span className="text-sm">
                      {isDue ? (
                        <span className="text-yellow-500">Review now</span>
                      ) : (
                        `Review in ${daysUntil} days`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{fontSize: '16px'}}>📈</span>
                    <span className={`text-sm font-medium ${getStrengthColor(memory.strength)}`}>
                      {Math.round(memory.strength * 100)}% strength
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Memory Strength</span>
                  <span>{memory.reviews} reviews</span>
                </div>
                <Progress value={memory.strength * 100} className="h-2" />
              </div>

              {isDue && (
                <Button size="sm" className="w-full mt-3">
                  Start Review
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Concepts are scheduled for review based on spaced repetition algorithm to maximize retention
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
