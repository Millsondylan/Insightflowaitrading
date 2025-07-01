import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Play, CheckCircle, Lock } from 'lucide-react';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  estimatedTime: string;
  progress?: number;
}

interface LearningPathWidgetProps {
  steps?: LearningStep[];
}

const LearningPathWidget: React.FC<LearningPathWidgetProps> = ({ 
  steps = [
    {
      id: '1',
      title: 'Risk Management Basics',
      description: 'Learn position sizing and stop losses',
      status: 'completed',
      estimatedTime: '30 min',
      progress: 100
    },
    {
      id: '2',
      title: 'Technical Analysis Fundamentals',
      description: 'Master support, resistance, and trends',
      status: 'current',
      estimatedTime: '45 min',
      progress: 60
    },
    {
      id: '3',
      title: 'Advanced Chart Patterns',
      description: 'Identify complex market patterns',
      status: 'locked',
      estimatedTime: '1 hour'
    }
  ]
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'current': return <Play className="h-4 w-4 text-cyan-400" />;
      case 'locked': return <Lock className="h-4 w-4 text-white/40" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'current': return 'text-cyan-400';
      case 'locked': return 'text-white/40';
      default: return 'text-white/60';
    }
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-cyan-400" />
          Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium text-sm ${getStatusColor(step.status)}`}>
                    {step.title}
                  </h4>
                  <span className="text-white/40 text-xs">{step.estimatedTime}</span>
                </div>
                <p className="text-white/60 text-xs mb-2">{step.description}</p>
                
                {step.status === 'current' && step.progress !== undefined && (
                  <div className="w-full bg-white/10 rounded-full h-1 mb-2">
                    <div 
                      className="h-1 rounded-full bg-cyan-400"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                )}
                
                {step.status === 'current' && (
                  <Button size="sm" variant="outline" className="text-xs">
                    Continue Learning
                  </Button>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="h-4 w-px bg-white/10 ml-2" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LearningPathWidget;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 