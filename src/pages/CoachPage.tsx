import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function CoachPage() {
  return (
    <Div>
      <Link to="/journal" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors" />
        <ArrowLeft size={16} />
        Back to Journal
      </Div>
      
      <Div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <Header className="flex justify-between items-start mb-8">
            <Div>
                <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Span className="bg-white/10 p-2 rounded-lg"><Bot className="text-blue-400" /></Div>
                    AI Coach
                </H1>
                <P className="text-gray-400 mt-1">Get feedback on your trading mindset and decisions.</P>
            </Div>
        </Header>

        <Div className="space-y-6">
            <Div className="bg-black/20 rounded-lg p-6 min-h-[200px] flex flex-col gap-4">
                {/* Mock chat messages */}
                <Div className="flex justify-end">
                    <Div className="bg-blue-600 text-white p-3 rounded-lg max-w-lg">
                        I took a loss on NVDA and I'm feeling anxious about my strategy.
                    </Div>
                </Div>
                <Div className="flex justify-start">
                    <Div className="bg-gray-700 text-white p-3 rounded-lg max-w-lg">
                        <Sparkles className="w-5 h-5 inline-block mr-2 text-blue-400" />
                        It's understandable to feel that way. Let's break down the trade. What were the entry conditions?
                    </Div>
                </Div>
            </Div>
            <Div className="flex gap-4">
                <Textarea placeholder="Ask your coach anything..." className="bg-black/20 border-white/10"/>
                <Button className="bg-blue-600 hover:bg-blue-700" />Send</Div>
            </Div>
        </Div>
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