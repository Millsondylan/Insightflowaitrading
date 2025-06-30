import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Users, TrendingUp } from 'lucide-react';

export default function VaultDetailPage() {
  const { id } = useParams();

  // Mock strategy data - in real app this would come from API
  const strategy = {
    id: id || '1',
    name: 'Advanced Momentum Strategy',
    description: 'A sophisticated momentum-based trading strategy that combines multiple technical indicators for optimal entry and exit points.',
    tags: ['Momentum', 'Technical Analysis', 'Day Trading'],
    performance: {
      totalReturn: 24.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15.2,
      winRate: 68
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-4 h-4"/>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{strategy.name}</h1>
          <p className="text-gray-400 mt-1">{strategy.description}</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{strategy.name}</CardTitle>
              <p className="text-gray-400 mt-2">{strategy.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Star className="w-4 h-4 mr-2"/>
                Favorite
              </Button>
              <Button>
                Copy Strategy
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300">{strategy.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex gap-2">
                {strategy.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">+{strategy.performance.totalReturn}%</p>
                      <p className="text-sm text-gray-400">Annual Return</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{strategy.performance.sharpeRatio}</p>
                      <p className="text-sm text-gray-400">Sharpe Ratio</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{strategy.performance.maxDrawdown}%</p>
                      <p className="text-sm text-gray-400">Max Drawdown</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{strategy.performance.winRate}%</p>
                      <p className="text-sm text-gray-400">Win Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 