import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function CoachPage() {
  return (
    <div>
      <link to="/journal" style={{ display: "flex", alignItems: "center" }}>
        <arrowleft  >
        Back to Journal
      </Link>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg"><bot  ></span>
                    AI Coach
                </h1>
                <p className="text-gray-400 mt-1">Get feedback on your trading mindset and decisions.</p>
            </div>
        </header>

        <div className="space-y-6">
            <div className="bg-black/20 rounded-lg p-6 min-h-[200px] flex flex-col gap-4">
                {/* Mock chat messages */}
                <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3 rounded-lg max-w-lg">
                        I took a loss on NVDA and I'm feeling anxious about my strategy.
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-gray-700 text-white p-3 rounded-lg max-w-lg">
                        <sparkles  style={{ display: "inline-block" }}>
                        It's understandable to feel that way. Let's break down the trade. What were the entry conditions?
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <textarea placeholder="Ask your coach anything..." >
                <button  >Send</Button>
            </div>
        </div>
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
