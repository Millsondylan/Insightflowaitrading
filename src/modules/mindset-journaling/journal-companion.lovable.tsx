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
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Trading Journal</h2>
      
      {/* Journal Entry Form */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label >Today's Journal Entry</label>
            <button
              
              onClick={getRandomPrompt}
            >
              Get Random Prompt
            </button>
          </div>
          
          {selectedPrompt && (
            <div >
              <p >{selectedPrompt.text}</p>
            </div>
          )}
          
          <textarea
            style={{ width: "100%", border: "1px solid #374151" }}
            value={currentEntry.content}
            onChange={handleContentChange}
            placeholder="Write your trading journal entry here..."
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <div>
            <label >How are you feeling?</label>
            <div style={{ display: "flex" }}>
              <button
                className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'positive' 
                    ? 'bg-status-success text-white' 
                    : 'bg-background-tertiary hover:bg-background-interactive'
                }`}
                onClick={() => handleMoodChange('positive')}
              >
                Positive
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'neutral' 
                    ? 'bg-status-warning text-white' 
                    : 'bg-background-tertiary hover:bg-background-interactive'
                }`}
                onClick={() => handleMoodChange('neutral')}
              >
                Neutral
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  currentEntry.mood === 'negative' 
                    ? 'bg-status-error text-white' 
                    : 'bg-background-tertiary hover:bg-background-interactive'
                }`}
                onClick={() => handleMoodChange('negative')}
              >
                Negative
              </button>
            </div>
          </div>
          
          <div>
            <label >Tags (comma-separated)</label>
            <input
              type="text"
              style={{ width: "100%", border: "1px solid #374151" }}
              value={currentEntry.tags?.join(', ')}
              onChange={handleTagsChange}
              placeholder="mindset, discipline, strategy, etc."
            />
          </div>
        </div>
        
        {error && (
          <div style={{ marginBottom: "16px" }}>
            {error}
          </div>
        )}
        
        <div style={{ display: "flex" }}>
          <button
            style={{ paddingLeft: "16px", paddingRight: "16px", color: "white" }}
            onClick={analyzeEntry}
            disabled={analyzing || !currentEntry.content || currentEntry.content.trim().length < 20}
          >
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
          
          <button
            style={{ paddingLeft: "16px", paddingRight: "16px", color: "white" }}
            onClick={saveEntry}
            disabled={saving || !currentEntry.content || currentEntry.content.trim().length < 10}
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>
      
      {/* AI Analysis Section */}
      {currentEntry.aiAnalysis && (
        <div style={{ marginBottom: "32px", padding: "16px", border: "1px solid #374151" }}>
          <h3 >AI Analysis</h3>
          
          <div >
            <div>
              <h4 >Summary</h4>
              <p >{currentEntry.aiAnalysis.summary}</p>
            </div>
            
            <div>
              <h4 >Insights</h4>
              <ul >
                {currentEntry.aiAnalysis.insights.map((insight, i) => (
                  <li key={i} >{insight}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 >Patterns</h4>
              <ul >
                {currentEntry.aiAnalysis.patterns.map((pattern, i) => (
                  <li key={i} >{pattern}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 >Suggestions</h4>
              <ul >
                {currentEntry.aiAnalysis.suggestions.map((suggestion, i) => (
                  <li key={i} >{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Previous Entries */}
      <div>
        <h3 >Previous Entries</h3>
        
        {loading ? (
          <div style={{ padding: "32px" }}>
            <div >Loading entries...</div>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ padding: "32px" }}>
            <div >No journal entries yet. Start writing your first entry above!</div>
          </div>
        ) : (
          <div >
            {entries.map(entry => (
              <div key={entry.id} style={{ padding: "16px" }}>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      entry.mood === 'positive' ? 'bg-status-success' :
                      entry.mood === 'negative' ? 'bg-status-error' : 'bg-status-warning'
                    }`} />
                    <span >
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <button
                    
                    onClick={() => editEntry(entry)}
                  >
                    Edit
                  </button>
                </div>
                
                <p >{entry.content}</p>
                
                <div style={{ display: "flex" }}>
                  {entry.tags.map((tag, i) => (
                    <span key={i} >
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

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['journalEntries', 'journalPrompts'],
  aiBlocks: ['journalAnalysis', 'patternRecognition'],
  functions: ['analyzeJournalEntry', 'saveJournalEntry', 'getJournalInsights']
};
