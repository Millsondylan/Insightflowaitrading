import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, FileText, Settings, Book, GitCommit } from 'lucide-react';

const ConfigItem = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <Div>
      <H4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3">
        <Icon size={16} />
        {title}
      </Div>
      {children}
    </Div>
  );
};

export default function StrategyBuilderPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <Div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Builder Section */}
      <Div className="lg:col-span-2 space-y-8">
        <Div className="flex justify-between items-center">
            <Div>
                <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Span className="bg-white/10 p-2 rounded-lg"><Bot className="text-blue-400" /></Div>
                    AI Strategy Builder
                </H1>
                <P className="text-gray-400 mt-1">Craft a new strategy using natural language.</P>
            </Div>
        </Div>

        {/* Prompt Input */}
        <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <H3 className="font-semibold text-white mb-3">Describe your strategy idea</Div>
          <Textarea value={prompt}
            onChange={(e) = /> setPrompt(e.target.value)}
            placeholder="e.g., A mean-reversion strategy for AAPL on the 5-minute chart using Bollinger Bands and RSI..."
            className="bg-black/20 border-white/10 h-36"
          />
          <Div className="flex justify-end mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" />
                <Sparkles size={16} className="mr-2"/>
                Generate Strategy
            </Textarea>
          </Div>
        </Div>

        {/* Generated Output */}
        <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <H3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FileText size={18} />
                Generated Pine Script
            </Div>
            <Div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300 h-64 overflow-auto">
                // Your generated strategy code will appear here...
            </Div>
        </Div>
      </Div>

      {/* Configuration Sidebar */}
      <Div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm space-y-6">
        <H2 className="text-xl font-bold text-white">Configuration</Div>
        
        <ConfigItem icon={Settings} title="Parameters" />
          {/* Placeholder for parameters */}
          <P className="text-sm text-gray-500">Parameters will be extracted here.</ConfigItem>
        </ConfigItem>

        <Div className="border-t border-white/10"></Div>
        
        <ConfigItem icon={Book} title="Next Steps" />
            <Div className="flex flex-col gap-3">
                <Link to="/planner" />
                    <Button variant="outline" className="w-full" />Create Trading Plan</ConfigItem>
                </Link>
                <Link to="/vault" />
                    <Button variant="outline" className="w-full" />Save to Vault</Link>
                </Link>
            </Div>
        </ConfigItem>
      </Div>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
