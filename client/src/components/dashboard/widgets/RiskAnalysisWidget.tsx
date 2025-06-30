import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskMetric {
  name: string;
  value: number;
  maxValue: number;
  status: 'good' | 'warning' | 'danger';
  description: string;
}

interface RiskAnalysisWidgetProps {
  metrics?: RiskMetric[];
}

const RiskAnalysisWidget: React.FC<RiskAnalysisWidgetProps> = ({ 
  metrics = [
    {
      name: 'Position Size',
      value: 2.5,
      maxValue: 5,
      status: 'good',
      description: 'Within safe limits'
    },
    {
      name: 'Drawdown',
      value: 8.2,
      maxValue: 10,
      status: 'warning',
      description: 'Approaching limit'
    },
    {
      name: 'Correlation',
      value: 0.75,
      maxValue: 0.8,
      status: 'warning',
      description: 'High correlation risk'
    }
  ]
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'danger': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'danger': return 'bg-red-400';
      default: return 'bg-white/20';
    }
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">{metric.name}</span>
              <div className={`flex items-center gap-1 ${getStatusColor(metric.status)}`}>
                {getStatusIcon(metric.status)}
                <span className="text-xs font-medium">
                  {metric.value.toFixed(1)}/{metric.maxValue}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metric.status)}`}
                style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
              />
            </div>
            
            <p className="text-white/50 text-xs">{metric.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RiskAnalysisWidget; 