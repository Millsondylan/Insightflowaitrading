import React from 'react';
import { Link } from 'react-router-dom';

export default function CoachPage() {
  return (
    <div>
      <Link to="/journal" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Journal
      </Link>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg"><Bot className="text-blue-400" /></span>
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
                        <Sparkles className="w-5 h-5 inline-block mr-2 text-blue-400" />
                        It's understandable to feel that way. Let's break down the trade. What were the entry conditions?
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <Textarea placeholder="Ask your coach anything..." className="bg-black/20 border-white/10"/>
                <Button className="bg-blue-600 hover:bg-blue-700">Send</Button>
            </div>
        </div>
      </div>
    </div>
  );
} 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default $(basename "${FILE%.*}" | sed 's/\.lovable//');
