
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TradeAnalyzerProps {
  tradeId?: string;
  onSaveReflection: (reflection: TradeReflection) => void;
}

interface Trade {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  size: number;
  pnl: number;
  pnlPercentage: number;
  stopLoss?: number;
  takeProfit?: number;
  tags: string[];
  notes?: string;
  screenshots?: string[];
}

interface TradeReflection {
  id: string;
  tradeId: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  emotionalState: string;
  lessonLearned: string;
  actionItems: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const TradeAnalyzer: React.FC<TradeAnalyzerProps> = ({
  tradeId,
  onSaveReflection
}) => {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [reflection, setReflection] = useState<Partial<TradeReflection>>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    emotionalState: '',
    lessonLearned: '',
    actionItems: [],
    rating: 3
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<Partial<TradeReflection> | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState<boolean>(false);
  
  useEffect(() => {
    if (tradeId) {
      fetchTrade(tradeId);
    }
  }, [tradeId]);
  
  const fetchTrade = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockTrade: Trade = {
        id,
        symbol: 'BTC/USD',
        direction: Math.random() > 0.5 ? 'long' : 'short',
        entryPrice: 50000 + Math.random() * 2000,
        exitPrice: 50000 + Math.random() * 2000,
        entryTime: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
        exitTime: new Date().toISOString(),
        size: 0.5 + Math.random() * 2,
        pnl: Math.random() * 1000 - 500,
        pnlPercentage: Math.random() * 10 - 5,
        stopLoss: 49000 + Math.random() * 500,
        takeProfit: 52000 + Math.random() * 500,
        tags: ['bitcoin', 'trend-following', Math.random() > 0.5 ? 'breakout' : 'pullback'],
        notes: 'This was a trade based on the 4-hour chart breakout pattern with confirmation from RSI.'
      };
      
      if (!mockTrade.pnl) {
        const diff = mockTrade.exitPrice - mockTrade.entryPrice;
        mockTrade.pnl = mockTrade.direction === 'long' ? diff * mockTrade.size : -diff * mockTrade.size;
        mockTrade.pnlPercentage = mockTrade.direction === 'long'
          ? (mockTrade.exitPrice / mockTrade.entryPrice - 1) * 100
          : (1 - mockTrade.exitPrice / mockTrade.entryPrice) * 100;
      }
      
      setTrade(mockTrade);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trade:', err);
      setError('Failed to load trade data. Please try again.');
      setLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TradeReflection
  ) => {
    setReflection(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats' | 'actionItems'
  ) => {
    const items = e.target.value.split('\n').filter(item => item.trim() !== '');
    setReflection(prev => ({ ...prev, [field]: items }));
  };
  
  const handleRatingChange = (rating: number) => {
    setReflection(prev => ({ ...prev, rating }));
  };
  
  const handleSaveReflection = async () => {
    if (!trade) return;
    
    setIsSaving(true);
    
    try {
      const completeReflection: TradeReflection = {
        id: reflection.id || `reflection-${Date.now()}`,
        tradeId: trade.id,
        strengths: reflection.strengths || [],
        weaknesses: reflection.weaknesses || [],
        opportunities: reflection.opportunities || [],
        threats: reflection.threats || [],
        emotionalState: reflection.emotionalState || '',
        lessonLearned: reflection.lessonLearned || '',
        actionItems: reflection.actionItems || [],
        rating: reflection.rating || 3,
        createdAt: reflection.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSaveReflection(completeReflection);
      setIsSaving(false);
    } catch (err) {
      console.error('Error saving reflection:', err);
      setError('Failed to save reflection. Please try again.');
      setIsSaving(false);
    }
  };
  
  const generateAiSuggestions = async () => {
    if (!trade) return;
    
    setIsGeneratingSuggestions(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions: Partial<TradeReflection> = {
        strengths: [
          'Proper position sizing according to risk management rules',
          'Patience in waiting for confirmation before entry',
          'Clear trade plan with defined entry, stop loss, and take profit'
        ],
        weaknesses: [
          'Exited position too early, leaving profits on the table',
          'Hesitated at entry, causing a slightly worse price',
          'Did not fully document the trade setup in real-time'
        ],
        opportunities: [
          'Could have scaled in/out to maximize profit potential',
          'Market showed signs of continuation that could have been exploited',
          'Similar setups appeared on related assets'
        ],
        threats: [
          'News event during trade could have caused unexpected volatility',
          'Correlation with broader market movements not fully considered',
          'Trading session was approaching low liquidity period'
        ],
        emotionalState: trade.pnl > 0 
          ? 'Confident but cautious, felt validation when the trade worked out.'
          : 'Initially anxious when position moved against me, then disappointed with the outcome.',
        lessonLearned: trade.pnl > 0
          ? 'Patience and following the trading plan leads to successful outcomes. The strategy works when executed properly.'
          : 'Need to improve entry timing and be more disciplined with stop losses. Market conditions weren\'t ideal for this setup.',
        actionItems: [
          'Review and adjust take profit strategy',
          'Practice entries in simulator to improve timing',
          'Document trades more thoroughly in real-time'
        ],
        rating: trade.pnl > 0 ? 4 : 2
      };
      
      setAiSuggestions(mockSuggestions);
      setIsGeneratingSuggestions(false);
    } catch (err) {
      console.error('Error generating AI suggestions:', err);
      setError('Failed to generate AI suggestions. Please try again.');
      setIsGeneratingSuggestions(false);
    }
  };
  
  const applySuggestions = () => {
    if (!aiSuggestions) return;
    
    setReflection(prev => ({
      ...prev,
      ...aiSuggestions
    }));
    
    setAiSuggestions(null);
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="text-xl font-semibold mb-2">Loading trade data...</div>
        <div className="text-muted-foreground">Please wait while we fetch the trade details</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-500/20 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }
  
  if (!trade) {
    return (
      <div className="p-12 text-center">
        <div className="text-xl font-semibold mb-2">No trade selected</div>
        <div className="text-muted-foreground">Please select a trade to analyze</div>
      </div>
    );
  }
  
  return (
    <div className="trade-analyzer p-4 bg-secondary rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Trade Analysis</h2>
        
        {/* Trade Summary */}
        <div className="p-4 bg-card rounded-lg mb-6">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{trade.symbol}</h3>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded text-xs mr-2 ${
                  trade.direction === 'long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {trade.direction.toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(trade.entryTime).toLocaleString()} - {new Date(trade.exitTime).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className={`text-xl font-bold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} ({trade.pnlPercentage.toFixed(2)}%)
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Entry Price</div>
              <div className="font-medium">${trade.entryPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Exit Price</div>
              <div className="font-medium">${trade.exitPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Position Size</div>
              <div className="font-medium">{trade.size} {trade.symbol.split('/')[0]}</div>
            </div>
          </div>
          
          {trade.notes && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Notes</div>
              <div className="p-2 bg-background rounded">{trade.notes}</div>
            </div>
          )}
        </div>
        
        {/* AI Suggestions Button */}
        <div className="mb-6">
          <Button 
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
            onClick={generateAiSuggestions}
            disabled={isGeneratingSuggestions}
          >
            {isGeneratingSuggestions ? 'Generating Suggestions...' : 'Generate AI Suggestions'}
          </Button>
        </div>
        
        {/* AI Suggestions Panel */}
        {aiSuggestions && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-400">AI Suggestions</h3>
              <Button 
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={applySuggestions}
              >
                Apply All
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Strengths</div>
                <ul className="list-disc pl-5 space-y-1">
                  {aiSuggestions.strengths?.map((item, i) => (
                    <li key={i} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Weaknesses</div>
                <ul className="list-disc pl-5 space-y-1">
                  {aiSuggestions.weaknesses?.map((item, i) => (
                    <li key={i} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Lesson Learned</div>
                <p className="text-sm">{aiSuggestions.lessonLearned}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* SWOT Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="block mb-1 font-medium">Strengths</Label>
            <Textarea
              className="w-full p-2 bg-background border border-border rounded-md"
              rows={4}
              value={reflection.strengths?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'strengths')}
              placeholder="What did you do well in this trade?"
            />
          </div>
          
          <div>
            <Label className="block mb-1 font-medium">Weaknesses</Label>
            <Textarea
              className="w-full p-2 bg-background border border-border rounded-md"
              rows={4}
              value={reflection.weaknesses?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'weaknesses')}
              placeholder="What could you have done better?"
            />
          </div>
          
          <div>
            <Label className="block mb-1 font-medium">Opportunities</Label>
            <Textarea
              className="w-full p-2 bg-background border border-border rounded-md"
              rows={4}
              value={reflection.opportunities?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'opportunities')}
              placeholder="What opportunities did you see or miss?"
            />
          </div>
          
          <div>
            <Label className="block mb-1 font-medium">Threats</Label>
            <Textarea
              className="w-full p-2 bg-background border border-border rounded-md"
              rows={4}
              value={reflection.threats?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'threats')}
              placeholder="What external factors affected this trade?"
            />
          </div>
        </div>
        
        {/* Emotional State */}
        <div className="mb-6">
          <Label className="block mb-1 font-medium">Emotional State</Label>
          <Textarea
            className="w-full p-2 bg-background border border-border rounded-md"
            rows={2}
            value={reflection.emotionalState}
            onChange={(e) => handleInputChange(e, 'emotionalState')}
            placeholder="How did you feel during this trade?"
          />
        </div>
        
        {/* Lesson Learned */}
        <div className="mb-6">
          <Label className="block mb-1 font-medium">Lesson Learned</Label>
          <Textarea
            className="w-full p-2 bg-background border border-border rounded-md"
            rows={3}
            value={reflection.lessonLearned}
            onChange={(e) => handleInputChange(e, 'lessonLearned')}
            placeholder="What did you learn from this trade?"
          />
        </div>
        
        {/* Action Items */}
        <div className="mb-6">
          <Label className="block mb-1 font-medium">Action Items</Label>
          <Textarea
            className="w-full p-2 bg-background border border-border rounded-md"
            rows={3}
            value={reflection.actionItems?.join('\n')}
            onChange={(e) => handleArrayInputChange(e, 'actionItems')}
            placeholder="What specific actions will you take to improve?"
          />
        </div>
        
        {/* Trade Rating */}
        <div className="mb-6">
          <Label className="block mb-1 font-medium">Trade Execution Rating (1-5)</Label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button key={rating}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  reflection.rating === rating ? 'bg-blue-600 text-white' : 'bg-secondary'
                }`}
                onClick={() => handleRatingChange(rating)}
              >
                {rating}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            onClick={handleSaveReflection}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const lovable = {
  tables: ['trades', 'tradeReflections'],
  aiBlocks: ['tradeAnalysis', 'reflectionGenerator'],
  functions: ['analyzeTrade', 'saveReflection', 'generateTradeInsights']
};
