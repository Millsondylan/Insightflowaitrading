// Mindset Journaling module types
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalPrompt {
  id: string;
  question: string;
  category: 'reflection' | 'goal' | 'emotion' | 'strategy';
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface MoodTrend {
  userId: string;
  date: string;
  averageMood: number;
  entryCount: number;
} 