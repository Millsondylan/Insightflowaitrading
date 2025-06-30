
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface JournalCompanionProps {
  userId: string;
  onSaveEntry?: (entry: JournalEntry) => void;
}

interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: {
    summary: string;
    insights: string[];
    patterns: string[];
    suggestions: string[];
  };
}

interface JournalPrompt {
  id: string;
  text: string;
  category: 'mindset' | 'trading' | 'reflection' | 'growth';
  tags: string[];
}

export const JournalCompanion: React.FC<JournalCompanionProps> = ({
  userId,
  onSaveEntry
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    content: '',
    mood: 'neutral',
    tags: []
  });
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchEntries();
    fetchPrompts();
  }, [userId]);
  
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockEntries: JournalEntry[] = [
        {
          id: 'entry-1',
          userId,
          content: 'Today I struggled with FOMO and entered a trade without proper confirmation. I need to work on my patience and discipline.',
          mood: 'negative',
          tags: ['discipline', 'fomo', 'patience'],
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          aiAnalysis: {
            summary: 'Reflection on entering trades impulsively due to FOMO.',
            insights: [
              'Awareness of emotional triggers affecting trading decisions',
              'Recognition of need for more discipline in trade execution'
            ],
            patterns: [
              'Tendency to rush into trades when market moves quickly'
            ],
            suggestions: [
              'Create a pre-trade checklist to follow before every entry',
              'Practice paper trading to build patience without risk',
              'Set a 5-minute timer before entering any trade to reduce impulsivity'
            ]
          }
        }
      ];
      
      setEntries(mockEntries);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError('Failed to load journal entries. Please try again.');
      setLoading(false);
    }
  };
  
  const fetchPrompts = async () => {
    try {
      const mockPrompts: JournalPrompt[] = [
        {
          id: 'prompt-1',
          text: 'What emotions did you experience during your trades today, and how did they influence your decisions?',
          category: 'mindset',
          tags: ['emotions', 'awareness']
        },
        {
          id: 'prompt-2',
          text: 'Describe a trading mistake you made recently. What will you do differently next time?',
          category: 'reflection',
          tags: ['mistakes', 'learning']
        }
      ];
      
      setPrompts(mockPrompts);
    } catch (err) {
      console.error('Error fetching journal prompts:', err);
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentEntry(prev => ({ ...prev, content: e.target.value }));
  };
  
  const handleMoodChange = (mood: 'positive' | 'neutral' | 'negative') => {
    setCurrentEntry(prev => ({ ...prev, mood }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setCurrentEntry(prev => ({ ...prev, tags: tagsArray }));
  };
  
  const handlePromptSelect = (prompt: JournalPrompt) => {
    setSelectedPrompt(prompt);
    setCurrentEntry(prev => ({ 
      ...prev,
      content: prev.content ? prev.content : '',
      tags: [...(prev.tags || []), ...prompt.tags]
    }));
  };
  
  const analyzeEntry = async () => {
    if (!currentEntry.content || currentEntry.content.trim().length < 20) {
      setError('Please write at least a few sentences for AI analysis.');
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnalysis = {
        summary: 'Reflection on recent trading experiences and emotional responses.',
        insights: [
          'Awareness of how market volatility affects decision-making',
          'Recognition of progress in maintaining trading discipline'
        ],
        patterns: [
          'Tendency to become more cautious after experiencing losses'
        ],
        suggestions: [
          'Consider keeping a separate emotion log alongside trade journal',
          'Practice mindfulness techniques before making trading decisions',
          'Review successful trades to reinforce positive behaviors'
        ]
      };
      
      setCurrentEntry(prev => ({
        ...prev,
        aiAnalysis: mockAnalysis
      }));
      
      setAnalyzing(false);
    } catch (err) {
      console.error('Error analyzing journal entry:', err);
      setError('Failed to analyze journal entry. Please try again.');
      setAnalyzing(false);
    }
  };
  
  const saveEntry = async () => {
    if (!currentEntry.content || currentEntry.content.trim().length < 10) {
      setError('Please write at least a brief entry before saving.');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const newEntry: JournalEntry = {
        id: currentEntry.id || `entry-${Date.now()}`,
        userId,
        content: currentEntry.content,
        mood: currentEntry.mood || 'neutral',
        tags: currentEntry.tags || [],
        createdAt: currentEntry.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiAnalysis: currentEntry.aiAnalysis
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEntries(prev => {
        const existingIndex = prev.findIndex(e => e.id === newEntry.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newEntry;
          return updated;
        } else {
          return [newEntry, ...prev];
        }
      });
      
      setCurrentEntry({
        content: '',
        mood: 'neutral',
        tags: []
      });
      
      setSelectedPrompt(null);
      
      if (onSaveEntry) {
        onSaveEntry(newEntry);
      }
      
      setSaving(false);
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save journal entry. Please try again.');
      setSaving(false);
    }
  };
  
  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
  };
  
  const getRandomPrompt = () => {
    if (prompts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    handlePromptSelect(prompts[randomIndex]);
  };
  
  return (
    <div className="journal-companion p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Trading Journal</h2>
      
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-medium">Today's Journal Entry</Label>
            <Button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={getRandomPrompt}
            >
              Get Random Prompt
            </Button>
          </div>
          
          {selectedPrompt && (
            <div className="p-3 mb-3 bg-blue-50 border-l-4 border-blue-600 rounded">
              <p className="text-sm italic">{selectedPrompt.text}</p>
            </div>
          )}
          
          <Textarea
            className="w-full p-3 border rounded-md min-h-[200px]"
            value={currentEntry.content}
            onChange={handleContentChange}
            placeholder="Write your trading journal entry here..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="block mb-1 font-medium">How are you feeling?</Label>
            <div className="flex space-x-2">
              <Button  
                className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'positive' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleMoodChange('positive')}
              >
                Positive
              </Button>
              <Button  
                className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'neutral' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleMoodChange('neutral')}
              >
                Neutral
              </Button>
              <Button  
                className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'negative' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleMoodChange('negative')}
              >
                Negative
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="block mb-1 font-medium">Tags (comma-separated)</Label>
            <Input
              type="text"
              className="w-full p-2 border rounded-md"
              value={currentEntry.tags?.join(', ')}
              onChange={handleTagsChange}
              placeholder="mindset, discipline, strategy, etc."
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-between">
          <Button 
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            onClick={analyzeEntry}
            disabled={analyzing || !currentEntry.content || currentEntry.content.trim().length < 20}
          >
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
          
          <Button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={saveEntry}
            disabled={saving || !currentEntry.content || currentEntry.content.trim().length < 10}
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </div>
      
      {currentEntry.aiAnalysis && (
        <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">AI Analysis</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Summary</h4>
              <p className="text-sm">{currentEntry.aiAnalysis.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Insights</h4>
              <ul className="list-disc pl-5 space-y-1">
                {currentEntry.aiAnalysis.insights.map((insight, i) => (
                  <li key={i} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Patterns</h4>
              <ul className="list-disc pl-5 space-y-1">
                {currentEntry.aiAnalysis.patterns.map((pattern, i) => (
                  <li key={i} className="text-sm">{pattern}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Suggestions</h4>
              <ul className="list-disc pl-5 space-y-1">
                {currentEntry.aiAnalysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Previous Entries</h3>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading entries...</div>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">No journal entries yet. Start writing your first entry above!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="p-4 bg-white rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      entry.mood === 'positive' ? 'bg-green-500' :
                      entry.mood === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Button  
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => editEntry(entry)}
                  >
                    Edit
                  </Button>
                </div>
                
                <p className="mb-3 line-clamp-3">{entry.content}</p>
                
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const lovable = {
  tables: ['journalEntries', 'journalPrompts'],
  aiBlocks: ['journalAnalysis', 'patternRecognition'],
  functions: ['analyzeJournalEntry', 'saveJournalEntry', 'getJournalInsights']
};
