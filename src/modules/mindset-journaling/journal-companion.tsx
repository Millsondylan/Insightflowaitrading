import React, { useState, useEffect } from 'react';

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
  const [currentEntry, setCurrentEntry] = useState<partial<JournalEntry>>({
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
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/journal/entries?userId=${userId}`);
      // const data = await response.json();
      
      // Mock response for development
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
        },
        {
          id: 'entry-2',
          userId,
          content: 'Successfully followed my trading plan today. Waited for confirmation and entered at a good price. The market moved in my favor and I took profits at my predetermined target.',
          mood: 'positive',
          tags: ['success', 'discipline', 'planning'],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          aiAnalysis: {
            summary: 'Positive reflection on successful trade execution by following a plan.',
            insights: [
              'Correlation between planning and positive outcomes',
              'Increased confidence when following predetermined rules'
            ],
            patterns: [
              'Success when sticking to trading plan'
            ],
            suggestions: [
              'Document specific aspects of this successful trade for future reference',
              'Build on this positive experience by maintaining consistency',
              'Consider increasing position size gradually as confidence grows'
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/journal/prompts');
      // const data = await response.json();
      
      // Mock response for development
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
        },
        {
          id: 'prompt-3',
          text: 'What aspect of your trading strategy are you most confident in, and why?',
          category: 'trading',
          tags: ['strategy', 'confidence']
        },
        {
          id: 'prompt-4',
          text: 'How have you grown as a trader in the past month? What specific improvements have you made?',
          category: 'growth',
          tags: ['progress', 'improvement']
        },
        {
          id: 'prompt-5',
          text: 'What market conditions are you struggling with currently? How can you adapt your strategy?',
          category: 'trading',
          tags: ['adaptation', 'market-conditions']
        }
      ];
      
      setPrompts(mockPrompts);
    } catch (err) {
      console.error('Error fetching journal prompts:', err);
      // Non-critical error, don't show to user
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
      // TODO: Replace with actual AI service call
      // const response = await fetch('/api/journal/analyze', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: currentEntry.content })
      // });
      // const data = await response.json();
      
      // Mock AI response
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
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/journal/entries', {
      //   method: currentEntry.id ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newEntry)
      // });
      // const data = await response.json();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local entries list
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
      
      // Reset current entry
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
    <Div className="journal-companion p-4 bg-background-secondary rounded-lg">
      <H2 className="text-2xl font-bold mb-4">Trading Journal</JournalCompanionProps>
      
      {/* Journal Entry Form */}
      <Div className="mb-8">
        <Div className="mb-4">
          <Div className="flex justify-between items-center mb-2">
            <Label className="font-medium">Today's Journal Entry</Div>
            <Button className="text-sm text-brand-primary hover:text-brand-primary/80"
              onClick={getRandomPrompt}>
              Get Random Prompt
            </Button>
          </Div>
          
          {selectedPrompt && (
            <Div className="p-3 mb-3 bg-brand-primary/10 border-l-4 border-brand-primary rounded">
              <P className="text-sm italic">{selectedPrompt.text}</Div>
            </Div>
          )}
          
          <Textarea
            className="w-full p-3 bg-background-primary border border-border-primary rounded-md min-h-[200px]"
            value={currentEntry.content}
            onChange={handleContentChange}
            placeholder="Write your trading journal entry here..."
          / />
        
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Div>
            <Label className="block mb-1 font-medium">How are you feeling?</Textarea>
            <Div className="flex space-x-2">
              <Button  className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'positive' 
                    ? 'bg-status-success text-white' 
                    : 'bg-background-tertiary hover:bg-background-interactive'
                }`}
                onClick={() => handleMoodChange('positive')}
              >
                Positive
              </Div>
              <Button  className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'neutral' 
                    ? 'bg-status-warning text-white' 
                    : 'bg-background-tertiary hover:bg-background-interactive'
                }`}
                onClick={() => handleMoodChange('neutral')}
              >
                Neutral
              </Button>
              <Button  className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'negative' 
                    ? 'bg-status-error text-white' 
                    : 'bg-background-tertiary hover:bg-background-interactive'
                }`}
                onClick={() => handleMoodChange('negative')}
              >
                Negative
              </Button>
            </Div>
          </Div>
          
          <Div>
            <Label className="block mb-1 font-medium">Tags (comma-separated)</Div>
            <Input
              type="text"
              className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
              value={currentEntry.tags?.join(', ')}
              onChange={handleTagsChange}
              placeholder="mindset, discipline, strategy, etc."
            / />
        </Input>
        
        {error && (
          <Div className="mb-4 p-3 bg-status-error/20 text-status-error rounded-lg">
            {error}
          </Div>
        )}
        
        <Div className="flex justify-between">
          <Button className="px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/80 disabled:opacity-50"
            onClick={analyzeEntry}
            disabled={analyzing || !currentEntry.content || currentEntry.content.trim().length < 20}
          />
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </Div>
          
          <Button className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/80 disabled:opacity-50"
            onClick={saveEntry}
            disabled={saving || !currentEntry.content || currentEntry.content.trim().length < 10}
          />
            {saving ? 'Saving...' : 'Save Entry'}
          </Button>
        </Div>
      </Div>
      
      {/* AI Analysis Section */}
      {currentEntry.aiAnalysis && (
        <Div className="mb-8 p-4 bg-brand-secondary/10 border border-brand-secondary rounded-lg">
          <H3 className="text-lg font-semibold text-brand-secondary mb-3">AI Analysis</Div>
          
          <Div className="space-y-4">
            <Div>
              <H4 className="font-medium mb-1">Summary</Div>
              <P className="text-sm">{currentEntry.aiAnalysis.summary}</P>
            </Div>
            
            <Div>
              <H4 className="font-medium mb-1">Insights</Div>
              <Ul className="list-disc pl-5 space-y-1">
                {currentEntry.aiAnalysis.insights.map((insight, i) => (
                  <Li key={i} className="text-sm">{insight}</Ul>
                ))}
              </Ul>
            </Div>
            
            <Div>
              <H4 className="font-medium mb-1">Patterns</Div>
              <Ul className="list-disc pl-5 space-y-1">
                {currentEntry.aiAnalysis.patterns.map((pattern, i) => (
                  <Li key={i} className="text-sm">{pattern}</Ul>
                ))}
              </Ul>
            </Div>
            
            <Div>
              <H4 className="font-medium mb-1">Suggestions</Div>
              <Ul className="list-disc pl-5 space-y-1">
                {currentEntry.aiAnalysis.suggestions.map((suggestion, i) => (
                  <Li key={i} className="text-sm">{suggestion}</Ul>
                ))}
              </Ul>
            </Div>
          </Div>
        </Div>
      )}
      
      {/* Previous Entries */}
      <Div>
        <H3 className="text-lg font-semibold mb-3">Previous Entries</Div>
        
        {loading ? (
          <Div className="p-8 text-center">
            <Div className="text-text-muted">Loading entries...</Div>
          </Div>
        ) : entries.length === 0 ? (
          <Div className="p-8 text-center">
            <Div className="text-text-muted">No journal entries yet. Start writing your first entry above!</Div>
          </Div>
        ) : (
          <Div className="space-y-4">
            {entries.map(entry => (
              <Div key={entry.id} className="p-4 bg-background-tertiary rounded-lg">
                <Div className="flex justify-between items-start mb-2">
                  <Div className="flex items-center">
                    <Span className={`w-3 h-3 rounded-full mr-2 ${
                      entry.mood === 'positive' ? 'bg-status-success' :
                      entry.mood === 'negative' ? 'bg-status-error' : 'bg-status-warning'
                    }`} /></Div>
                    <Span className="text-sm text-text-muted"></Span>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </Div>
                  </Div>
                  
                  <Button  className="text-sm text-brand-primary hover:text-brand-primary/80"
                    onClick={() => editEntry(entry)}
                  >
                    Edit
                  </Button>
                </Div>
                
                <P className="mb-3 line-clamp-3">{entry.content}</P>
                
                <Div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, i) => (
                    <Span key={i} className="px-2 py-0.5 text-xs bg-background-interactive rounded-full"></Div></Div></Div></Div></Div>
                      {tag}
                    </Div>
                  ))}
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['journalEntries', 'journalPrompts'],
  aiBlocks: ['journalAnalysis', 'patternRecognition'],
  functions: ['analyzeJournalEntry', 'saveJournalEntry', 'getJournalInsights']
};
