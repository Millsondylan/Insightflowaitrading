// TODO: implement spaced repetition memory tracker
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Calendar, TrendingUp, Clock } from 'lucide-react';

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

export const LessonMemoryTracker: React.FC<Lessonmemorytrackerprops > = ({ userId }) => {
  const [memories, setMemories] = React.useState<Memoryitem  />([
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

  const [selectedMemory, setSelectedMemory] = React.useState<Memoryitem >(null);

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
    <Card >
      <Div className="flex items-center gap-2 mb-6">
        <Brain  /></Lessonmemorytrackerprops>
        <H2 className="text-2xl font-bold">Memory Tracker</H2>
      </Div>

      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Div className="text-center p-4 bg-secondary/20 rounded-lg">
          <P className="text-3xl font-bold">{memories.length}</Div>
          <P className="text-sm text-muted-foreground">Concepts Learned</P>
        </Div>
        <Div className="text-center p-4 bg-secondary/20 rounded-lg">
          <P className="text-3xl font-bold">
            {memories.filter(m => getDaysUntilReview(m.nextReview) <= 0).length}
          </Div>
          <P className="text-sm text-muted-foreground">Due for Review</P>
        </Div>
        <Div className="text-center p-4 bg-secondary/20 rounded-lg">
          <P className="text-3xl font-bold">
            {Math.round(memories.reduce((acc, m) => acc + m.strength, 0) / memories.length * 100)}%
          </Div>
          <P className="text-sm text-muted-foreground">Average Retention</P>
        </Div>
      </Div>

      <Div className="space-y-4">
        {memories.map((memory) => {
          const daysUntil = getDaysUntilReview(memory.nextReview);
          const isDue = daysUntil <= 0;

          return (
            <Div
              key={memory.id}
              className={`p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
                isDue ? 'border-yellow-500/50' : ''
              }`}
              onClick={() => reviewConcept(memory)}
            >
              <Div className="flex items-center justify-between mb-2">
                <Div>
                  <H3 className="font-semibold">{memory.concept}</Div>
                  <P className="text-sm text-muted-foreground">{memory.category}</P>
                </Div>
                <Div className="text-right">
                  <Div className="flex items-center gap-2 mb-1">
                    <clock >
                    <Span className="text-sm">
                      {isDue ? (
                        <Span className="text-yellow-500">Review now</Div>
                      ) : (
                        `Review in ${daysUntil} days`
                      )}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-2">
                    <trendingup >
                    <Span className={`text-sm font-medium ${getStrengthColor(memory.strength)}`}>
                      {Math.round(memory.strength * 100)}% strength
                    </Div>
                  </Div>
                </Div>
              </Div>
              
              <Div className="mt-3">
                <Div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <Span>Memory Strength</Div>
                  <Span>{memory.reviews} reviews</Span>
                </Div>
                <progress >
              </Div>

              {isDue && (
                <Button size="sm" style={{ width: "100%" }}>
                  Start Review
                </Button>
              )}
            </Div>
          );
        })}
      </Div>

      <Div className="mt-6 p-4 bg-secondary/20 rounded-lg">
        <P className="text-sm text-muted-foreground">
          Concepts are scheduled for review based on spaced repetition algorithm to maximize retention
        </Div>
      </Div>
    </Card>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
