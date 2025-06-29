import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipBack, SkipForward, Settings } from 'lucide-react';

export default function ReplayPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Strategy Replay</h1>
          <p className="text-gray-400">Analyze historical trades and performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Chart View</CardTitle>
                  <p className="text-sm text-gray-400">BTC/USD • 4H Timeframe</p>
                </div>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart placeholder</p>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button variant="outline" size="icon">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Entry Price</p>
                  <p className="text-lg font-semibold">$42,150.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Exit Price</p>
                  <p className="text-lg font-semibold">$43,250.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Position Size</p>
                  <p className="text-lg font-semibold">0.5 BTC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">P&L</p>
                  <p className="text-lg font-semibold text-green-400">+$550.00 (2.61%)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-lg font-semibold">12h 30m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                    Completed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
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