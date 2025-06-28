import React, { useState, useEffect } from 'react';
import { Strategy, StrategyRule } from './types';

interface AIStrategyBuilderV2Props {
  initialStrategy?: Strategy;
  onSave: (strategy: Strategy) => void;
  onCancel: () => void;
}

export const AIStrategyBuilderV2: React.FC<AIStrategyBuilderV2Props> = ({
  initialStrategy,
  onSave,
  onCancel
}) => {
  const [strategy, setStrategy] = useState<Strategy>(
    initialStrategy || {
      id: '',
      name: '',
      description: '',
      author: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      isPublished: false,
      rules: [],
      tags: []
    }
  );
  
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrategy(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStrategy(prev => ({ ...prev, description: e.target.value }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setStrategy(prev => ({ ...prev, tags }));
  };
  
  const handleRuleChange = (index: number, rule: StrategyRule) => {
    const updatedRules = [...strategy.rules];
    updatedRules[index] = rule;
    setStrategy(prev => ({ ...prev, rules: updatedRules }));
  };
  
  const handleAddRule = () => {
    const newRule: StrategyRule = {
      id: `rule-${strategy.rules.length + 1}`,
      type: 'entry',
      condition: '',
      parameters: {},
      description: '',
      priority: strategy.rules.length + 1,
      isActive: true
    };
    
    setStrategy(prev => ({
      ...prev,
      rules: [...prev.rules, newRule]
    }));
  };
  
  const handleRemoveRule = (index: number) => {
    const updatedRules = strategy.rules.filter((_, i) => i !== index);
    setStrategy(prev => ({ ...prev, rules: updatedRules }));
  };
  
  const handleSaveStrategy = () => {
    if (!strategy.name) {
      setError('Strategy name is required');
      return;
    }
    
    if (strategy.rules.length === 0) {
      setError('At least one rule is required');
      return;
    }
    
    const updatedStrategy: Strategy = {
      ...strategy,
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedStrategy);
  };
  
  const generateStrategyFromPrompt = async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate a strategy');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // TODO: Replace with actual AI service call
      // const response = await fetch('/api/strategy/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt })
      // });
      // const data = await response.json();
      
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRules: StrategyRule[] = [
        {
          id: 'rule-1',
          type: 'entry',
          condition: 'MACD(12,26,9) crosses above Signal',
          parameters: { fast: 12, slow: 26, signal: 9 },
          description: 'Enter when MACD crosses above the signal line',
          priority: 1,
          isActive: true
        },
        {
          id: 'rule-2',
          type: 'filter',
          condition: 'Price > EMA(200)',
          parameters: { period: 200 },
          description: 'Only trade when price is above the 200 EMA',
          priority: 2,
          isActive: true
        },
        {
          id: 'rule-3',
          type: 'exit',
          condition: 'Take Profit at 2%',
          parameters: { percentage: 2 },
          description: 'Exit when profit reaches 2%',
          priority: 3,
          isActive: true
        },
        {
          id: 'rule-4',
          type: 'exit',
          condition: 'Stop Loss at 1%',
          parameters: { percentage: 1 },
          description: 'Exit when loss reaches 1%',
          priority: 4,
          isActive: true
        }
      ];
      
      const generatedStrategy: Strategy = {
        ...strategy,
        name: prompt.split(' ').slice(0, 3).join(' ') + ' Strategy',
        description: `AI-generated strategy based on: ${prompt}`,
        rules: mockRules,
        tags: ['ai-generated', 'v2', prompt.split(' ')[0].toLowerCase()]
      };
      
      setStrategy(generatedStrategy);
      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating strategy:', err);
      setError('Failed to generate strategy. Please try again.');
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="strategy-builder p-4 bg-background-secondary rounded-lg">
      <h2 className="text-2xl font-bold mb-4">AI Strategy Builder v2</h2>
      
      {/* Prompt Section */}
      <div className="mb-6 p-4 bg-background-tertiary rounded-lg">
        <label className="block mb-2 font-medium">Describe your strategy in natural language</label>
        <textarea
          className="w-full p-2 mb-2 bg-background-primary border border-border-primary rounded-md"
          rows={4}
          value={prompt}
          onChange={handlePromptChange}
          placeholder="e.g., Create a trend-following strategy using MACD and EMA for Bitcoin on the 1-hour timeframe"
        />
        <button
          className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/80 disabled:opacity-50"
          onClick={generateStrategyFromPrompt}
          disabled={isGenerating || !prompt}
        >
          {isGenerating ? 'Generating...' : 'Generate Strategy'}
        </button>
      </div>
      
      {/* Strategy Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Strategy Details</h3>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            value={strategy.name}
            onChange={handleNameChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            rows={3}
            value={strategy.description}
            onChange={handleDescriptionChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Tags (comma-separated)</label>
          <input
            type="text"
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            value={strategy.tags.join(', ')}
            onChange={handleTagsChange}
          />
        </div>
      </div>
      
      {/* Rules Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">Rules</h3>
          <button
            className="px-3 py-1 bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/80"
            onClick={handleAddRule}
          >
            Add Rule
          </button>
        </div>
        
        {strategy.rules.length === 0 ? (
          <div className="p-4 text-center text-text-muted bg-background-tertiary rounded-lg">
            No rules defined. Add rules or generate from prompt.
          </div>
        ) : (
          <div className="space-y-3">
            {strategy.rules.map((rule, index) => (
              <div key={rule.id} className="p-3 bg-background-tertiary rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs mr-2 ${
                      rule.type === 'entry' ? 'bg-status-success/20 text-status-success' :
                      rule.type === 'exit' ? 'bg-status-error/20 text-status-error' :
                      rule.type === 'filter' ? 'bg-status-info/20 text-status-info' :
                      'bg-status-warning/20 text-status-warning'
                    }`}>
                      {rule.type.toUpperCase()}
                    </span>
                    <span className="font-medium">{rule.condition}</span>
                  </div>
                  <button
                    className="text-status-error hover:text-status-error/80"
                    onClick={() => handleRemoveRule(index)}
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-text-muted">{rule.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-status-error/20 text-status-error rounded-lg">
          {error}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 border border-border-primary text-text-primary rounded-md hover:bg-background-interactive"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/80"
          onClick={handleSaveStrategy}
        >
          Save Strategy
        </button>
      </div>
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies', 'strategyRules'],
  aiBlocks: ['strategyBuilder', 'strategyAnalysis'],
  functions: ['generateStrategy', 'saveStrategy']
}; 