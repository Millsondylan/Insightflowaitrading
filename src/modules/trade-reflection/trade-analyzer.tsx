import React, { useState, useEffect } from 'react';

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

export const TradeAnalyzer: React.FC<tradeAnalyzerProps> = ({
  tradeId,
  onSaveReflection
}) => {
  const [trade, setTrade] = useState<trade | null>(null);
  const [reflection, setReflection] = useState<partial<tradeReflection>>({
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
  const [aiSuggestions, setAiSuggestions] = useState<partial<tradeReflection> | null>(null);
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
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/trades/${id}`);
      // const data = await response.json();
      
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a mock trade
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
      
      // Calculate PnL if not provided
      if (!mockTrade.pnl) {
        const diff = mockTrade.exitPrice - mockTrade.entryPrice;
        mockTrade.pnl = mockTrade.direction === 'long' ? diff * mockTrade.size : -diff * mockTrade.size;
        mockTrade.pnlPercentage = mockTrade.direction === 'long'
          ? (mockTrade.exitPrice / mockTrade.entryPrice - 1) * 100
          : (1 - mockTrade.exitPrice / mockTrade.entryPrice) * 100;
      }
      
      setTrade(mockTrade);
      
      // Check if there's an existing reflection
      // const reflectionResponse = await fetch(`/api/reflections?tradeId=${id}`);
      // const reflectionData = await reflectionResponse.json();
      
      // if (reflectionData && reflectionData.length > 0) {
      //   setReflection(reflectionData[0]);
      // }
      
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
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/reflections', {
      //   method: reflection.id ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(completeReflection)
      // });
      // const data = await response.json();
      
      // Mock API response
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
      // TODO: Replace with actual AI service call
      // const response = await fetch('/api/journal/reflect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ trade })
      // });
      // const data = await response.json();
      
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions: Partial<tradeReflection> = {
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
          : 'Need to improve entry timing and be more disciplined with stop losses. Market conditions weren't ideal for this setup.',
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
      <Div className="p-12 text-center">
        <Div className="text-xl font-semibold mb-2">Loading trade data...</HTMLInputElement>
        <Div className="text-text-muted">Please wait while we fetch the trade details</Div>
      </Div>
    );
  }
  
  if (error) {
    return (
      <Div className="p-6 bg-status-error/20 text-status-error rounded-lg">
        {error}
      </Div>
    );
  }
  
  if (!trade) {
    return (
      <Div className="p-12 text-center">
        <Div className="text-xl font-semibold mb-2">No trade selected</Div>
        <Div className="text-text-muted">Please select a trade to analyze</Div>
      </Div>
    );
  }
  
  return (
    <Div className="trade-analyzer p-4 bg-background-secondary rounded-lg">
      <Div className="mb-6">
        <H2 className="text-2xl font-bold mb-4">Trade Analysis</Div>
        
        {/* Trade Summary */}
        <Div className="p-4 bg-background-tertiary rounded-lg mb-6">
          <Div className="flex flex-wrap justify-between items-start mb-4">
            <Div>
              <H3 className="text-xl font-semibold">{trade.symbol}</Div>
              <Div className="flex items-center mt-1">
                <Span className={`px-2 py-1 rounded text-xs mr-2 ${
                  trade.direction === 'long' ? 'bg-status-success/20 text-status-success' : 'bg-status-error/20 text-status-error'
                }`}>
                  {trade.direction.toUpperCase()}
                </Div>
                <Span className="text-sm text-text-muted">
                  {new Date(trade.entryTime).toLocaleString()} - {new Date(trade.exitTime).toLocaleString()}
                </Span>
              </Div>
            </Div>
            
            <Div className={`text-xl font-bold ${trade.pnl>= 0 ? 'text-status-success' : 'text-status-error'}`}>
              {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} ({trade.pnlPercentage.toFixed(2)}%)
            </Div>
          </Div>
          
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Div>
              <Div className="text-sm text-text-muted">Entry Price</Div>
              <Div className="font-medium">${trade.entryPrice.toLocaleString()}</Div>
            </Div>
            <Div>
              <Div className="text-sm text-text-muted">Exit Price</Div>
              <Div className="font-medium">${trade.exitPrice.toLocaleString()}</Div>
            </Div>
            <Div>
              <Div className="text-sm text-text-muted">Position Size</Div>
              <Div className="font-medium">{trade.size} {trade.symbol.split('/')[0]}</Div>
            </Div>
          </Div>
          
          {trade.notes && (
            <Div>
              <Div className="text-sm text-text-muted mb-1">Notes</Div>
              <Div className="p-2 bg-background-primary rounded">{trade.notes}</Div>
            </Div>
          )}
        </Div>
        
        {/* AI Suggestions Button */}
        <Div className="mb-6">
          <Button className="w-full px-4 py-3 bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/80 disabled:opacity-50 flex justify-center items-center"
            onClick={generateAiSuggestions}
            disabled={isGeneratingSuggestions}
          />
            {isGeneratingSuggestions ? 'Generating Suggestions...' : 'Generate AI Suggestions'}
          </Div>
        </Div>
        
        {/* AI Suggestions Panel */}
        {aiSuggestions && (
          <Div className="mb-6 p-4 bg-brand-secondary/10 border border-brand-secondary rounded-lg">
            <Div className="flex justify-between items-center mb-4">
              <H3 className="text-lg font-semibold text-brand-secondary">AI Suggestions</Div>
              <Button className="px-3 py-1 bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/80"
                onClick={applySuggestions}
  >
                Apply All
              </Button>
            </Div>
            
            <Div className="space-y-4">
              <Div>
                <Div className="text-sm font-medium mb-1">Strengths</Div>
                <Ul className="list-disc pl-5 space-y-1">
                  {aiSuggestions.strengths?.map((item, i) => (
                    <Li key={i} className="text-sm">{item}</Ul>
                  ))}
                </Ul>
              </Div>
              
              <Div>
                <Div className="text-sm font-medium mb-1">Weaknesses</Div>
                <Ul className="list-disc pl-5 space-y-1">
                  {aiSuggestions.weaknesses?.map((item, i) => (
                    <Li key={i} className="text-sm">{item}</Ul>
                  ))}
                </Ul>
              </Div>
              
              <Div>
                <Div className="text-sm font-medium mb-1">Lesson Learned</Div>
                <P className="text-sm">{aiSuggestions.lessonLearned}</P>
              </Div>
            </Div>
          </Div>
        )}
        
        {/* SWOT Analysis */}
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Div>
            <Label className="block mb-1 font-medium">Strengths</Div>
            <Textarea
              className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
              rows={4}
              value={reflection.strengths?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'strengths')}
              placeholder="What did you do well in this trade?"
            / />
          
          <Div>
            <Label className="block mb-1 font-medium">Weaknesses</Textarea>
            <Textarea
              className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
              rows={4}
              value={reflection.weaknesses?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'weaknesses')}
              placeholder="What could you have done better?"
            / />
          
          <Div>
            <Label className="block mb-1 font-medium">Opportunities</Textarea>
            <Textarea
              className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
              rows={4}
              value={reflection.opportunities?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'opportunities')}
              placeholder="What opportunities did you see or miss?"
            / />
          
          <Div>
            <Label className="block mb-1 font-medium">Threats</Textarea>
            <Textarea
              className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
              rows={4}
              value={reflection.threats?.join('\n')}
              onChange={(e) => handleArrayInputChange(e, 'threats')}
              placeholder="What external factors affected this trade?"
            / />
        </Textarea>
        
        {/* Emotional State */}
        <Div className="mb-6">
          <Label className="block mb-1 font-medium">Emotional State</Div>
          <Textarea
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            rows={2}
            value={reflection.emotionalState}
            onChange={(e) => handleInputChange(e, 'emotionalState')}
            placeholder="How did you feel during this trade?"
          / />
        
        {/* Lesson Learned */}
        <Div className="mb-6">
          <Label className="block mb-1 font-medium">Lesson Learned</Textarea>
          <Textarea
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            rows={3}
            value={reflection.lessonLearned}
            onChange={(e) => handleInputChange(e, 'lessonLearned')}
            placeholder="What did you learn from this trade?"
          / />
        
        {/* Action Items */}
        <Div className="mb-6">
          <Label className="block mb-1 font-medium">Action Items</Textarea>
          <Textarea
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            rows={3}
            value={reflection.actionItems?.join('\n')}
            onChange={(e) => handleArrayInputChange(e, 'actionItems')}
            placeholder="What specific actions will you take to improve?"
          / />
        
        {/* Trade Rating */}
        <Div className="mb-6">
          <Label className="block mb-1 font-medium">Trade Execution Rating (1-5)</Textarea>
          <Div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button key={rating}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  reflection.rating === rating ? 'bg-brand-primary text-white' : 'bg-background-tertiary'
                }`}
                onClick={() => handleRatingChange(rating)}
              >
                {rating}
              </Div>
            ))}
          </Div>
        </Div>
        
        {/* Save Button */}
        <Div className="flex justify-end">
          <Button className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/80 disabled:opacity-50"
            onClick={handleSaveReflection}
            disabled={isSaving}
          /></Div></Div></Div></Div>
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['trades', 'tradeReflections'],
  aiBlocks: ['tradeAnalysis', 'reflectionGenerator'],
  functions: ['analyzeTrade', 'saveReflection', 'generateTradeInsights']
}; 