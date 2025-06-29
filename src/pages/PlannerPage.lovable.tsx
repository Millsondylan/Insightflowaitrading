import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckSquare } from 'lucide-react';

export default function PlannerPage() {
  return (
    <Div>
      <Link to="/strategy-builder" style={{ display: "flex", alignItems: "center" }}>
        <Arrowleft>
        Back to Strategy Builder
      </Div>
      
      <Div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <Header className="flex justify-between items-start mb-8">
            <Div>
                <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Span className="bg-white/10 p-2 rounded-lg"><Calendar  /></Div></Div></Div></Span>
                    Trading Planner
                </H1>
                <P className="text-gray-400 mt-1">Outline your trading plan for the generated strategy.</P>
            </Div>
            <Button size="lg" style={{ color: "white" }}>
                Save Plan
            </Button>
        </Header>

        <Div className="space-y-6">
            <Div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
                <P className="text-gray-500"></Div></Div>Checklist and planning components will be here.</Div>
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
