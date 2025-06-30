'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  ArrowLeft, 
  Save, 
  Play, 
  Lightbulb, 
  Code, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface StrategyLogic {
  entry: string;
  exit: string;
  stopLoss: string;
  takeProfit: string;
  filters: string[];
  timeframes: string[];
}

export default function CreateStrategyPage() {
  const router = useRouter();
  const [strategyName, setStrategyName] = useState('');
  const [description, setDescription] = useState('');
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogic, setGeneratedLogic] = useState<StrategyLogic | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleGenerateStrategy = async () => {
    if (!naturalLanguage.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockLogic: StrategyLogic = {
        entry: "Enter long when price breaks above resistance level with volume confirmation",
        exit: "Exit when price closes below the 20-period moving average",
        stopLoss: "Set stop loss at 2% below entry price",
        takeProfit: "Take profit at 6% above entry price (3:1 risk-reward)",
        filters: ["RSI below 70", "Volume above average", "Trend is bullish"],
        timeframes: ["1H", "4H"]
      };
      
      setGeneratedLogic(mockLogic);
      setSuggestions([
        "Consider adding a maximum position size rule",
        "Add market session filter (avoid low liquidity periods)",
        "Include correlation check with major indices"
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveStrategy = async () => {
    // Save strategy to Supabase
    router.push('/modules/strategy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Brain className="h-8 w-8 text-blue-400 mr-3" />
                AI Strategy Builder
              </h1>
              <p className="text-slate-300">Convert your trading ideas into structured logic</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveStrategy}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Strategy
            </button>
            <button
              onClick={() => router.push('/modules/strategy/backtest')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Backtest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Strategy Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Strategy Name</label>
                  <input
                    type="text"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    placeholder="e.g., Breakout with RSI Filter"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your strategy..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Natural Language Input */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Natural Language Strategy</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Describe your strategy in plain English
                  </label>
                  <textarea
                    value={naturalLanguage}
                    onChange={(e) => setNaturalLanguage(e.target.value)}
                    placeholder="e.g., I want to enter long when price breaks above resistance with RSI confirmation below 70, and exit when price closes below the 20-period moving average..."
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleGenerateStrategy}
                  disabled={isGenerating || !naturalLanguage.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating Strategy...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Strategy Logic
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Generated Logic */}
          <div className="space-y-6">
            {/* Generated Strategy Logic */}
            {generatedLogic && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="h-5 w-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Generated Strategy Logic</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Entry Conditions</label>
                    <div className="p-3 bg-slate-700 rounded-md text-slate-300">
                      {generatedLogic.entry}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Exit Conditions</label>
                    <div className="p-3 bg-slate-700 rounded-md text-slate-300">
                      {generatedLogic.exit}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Stop Loss</label>
                      <div className="p-3 bg-slate-700 rounded-md text-slate-300">
                        {generatedLogic.stopLoss}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Take Profit</label>
                      <div className="p-3 bg-slate-700 rounded-md text-slate-300">
                        {generatedLogic.takeProfit}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Filters</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedLogic.filters.map((filter, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Timeframes</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedLogic.timeframes.map((tf, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                          {tf}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-xl font-semibold text-white">AI Suggestions</h2>
                </div>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-700 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Preview */}
            {generatedLogic && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Strategy Preview</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk-Reward Ratio:</span>
                    <span className="text-white font-medium">3:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Win Rate:</span>
                    <span className="text-white font-medium">65-75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Drawdown:</span>
                    <span className="text-white font-medium">8-12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trade Frequency:</span>
                    <span className="text-white font-medium">2-4 per week</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 