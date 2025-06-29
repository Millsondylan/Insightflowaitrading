import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, FileText, Settings, Book, GitCommit } from 'lucide-react';

const ConfigItem = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3">
        <Icon >
        {title}
      </h4>
      {children}
    </div>
  );
};

export default function StrategyBuilderPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Builder Section */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg"><Bot  /></span>
                    AI Strategy Builder
                </h1>
                <p className="text-gray-400 mt-1">Craft a new strategy using natural language.</p>
            </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-3">Describe your strategy idea</h3>
          <textarea  > setPrompt(e.target.value)}
            placeholder="e.g., A mean-reversion strategy for AAPL on the 5-minute chart using Bollinger Bands and RSI..."
            className="bg-black/20 border-white/10 h-36"
          />
          <div className="flex justify-end mt-4">
            <button  style={{ color: "white" }}>
                <sparkles  >
                Generate Strategy
            </Button>
          </div>
        </div>

        {/* Generated Output */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <filetext  >
                Generated Pine Script
            </h3>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300 h-64 overflow-auto">
                // Your generated strategy code will appear here...
            </div>
        </div>
      </div>

      {/* Configuration Sidebar */}
      <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-xl font-bold text-white">Configuration</h2>
        
        <configitem title="Parameters" >
          {/* Placeholder for parameters */}
          <p className="text-sm text-gray-500">Parameters will be extracted here.</p>
        </ConfigItem>

        <div className="border-t border-white/10"></div>
        
        <configitem title="Next Steps" >
            <div className="flex flex-col gap-3">
                <link to="/planner" >
                    <button variant="outline" style={{ width: "100%" }}>Create Trading Plan</Button>
                </Link>
                <link to="/vault" >
                    <button variant="outline" style={{ width: "100%" }}>Save to Vault</Button>
                </Link>
            </div>
        </ConfigItem>
      </div>
    </div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
