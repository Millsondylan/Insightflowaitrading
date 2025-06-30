
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Copy, Download, Star } from 'lucide-react';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeframe: string;
  indicators: string[];
  entryConditions: string[];
  exitConditions: string[];
  riskManagement: string;
  expectedReturns: string;
  marketConditions: string[];
}

interface StrategyRevealProps {
  result: StrategyResponse;
}

const StrategyReveal: React.FC<StrategyRevealProps> = ({ result }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{result.strategyName}</CardTitle>
              <CardDescription className="mt-2">{result.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getRiskColor(result.riskLevel)}>
                {result.riskLevel} Risk
              </Badge>
              <Badge variant="outline">{result.timeframe}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Technical Indicators</h3>
              <div className="space-y-2">
                {result.indicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Market Conditions</h3>
              <div className="space-y-2">
                {result.marketConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Entry Conditions</h3>
              <div className="space-y-2">
                {result.entryConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm">{condition}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Exit Conditions</h3>
              <div className="space-y-2">
                {result.exitConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm">{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Risk Management</h3>
              <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                {result.riskManagement}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Expected Returns</h3>
              <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                {result.expectedReturns}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Strategy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Save Strategy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyReveal;
