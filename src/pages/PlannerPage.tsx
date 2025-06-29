import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckSquare } from 'lucide-react';

export default function PlannerPage() {
  return (
    <div>
      <Link to="/strategy-builder" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Strategy Builder
      </Link>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg"><Calendar className="text-blue-400" /></span>
                    Trading Planner
                </h1>
                <p className="text-gray-400 mt-1">Outline your trading plan for the generated strategy.</p>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Plan
            </Button>
        </header>

        <div className="space-y-6">
            <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Checklist and planning components will be here.</p>
            </div>
        </div>
      </div>
    </div>
  );

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
} 