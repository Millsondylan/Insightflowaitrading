import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipBack, SkipForward, Settings } from 'lucide-react';

export default function ReplayPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Div className="container mx-auto p-6">
      <Div className="flex items-center justify-between mb-8">
        <Div>
          <H1 className="text-3xl font-bold text-white">Strategy Replay</Div>
          <P className="text-gray-400">Analyze historical trades and performance</P>
        </Div>
      </Div>

      <Div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Div className="flex justify-between items-start">
                <Div>
                  <CardTitle>Chart View</Div>
                  <P className="text-sm text-gray-400">BTC/USD • 4H Timeframe</P>
                </Div>
                <Button variant="outline" size="icon" />
                  <Settings className="h-4 w-4" />
                </Button>
              </div />
            <CardContent>
              <Div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center">
                <P className="text-gray-400">Chart placeholder</CardContent>
              </Div>
              <Div className="flex items-center justify-center gap-4 mt-4">
                <Button variant="outline" size="icon" />
                  <SkipBack className="h-4 w-4" />
                </Div>
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700" />
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" />
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div />
          </Card>
        </Div>

        <Div>
          <Card>
            <CardHeader>
              <CardTitle>Trade Details</div />
            <CardContent>
              <Div className="space-y-4">
                <Div>
                  <P className="text-sm text-gray-400">Entry Price</Div>
                  <P className="text-lg font-semibold">$42,150.00</P>
                </Div>
                <Div>
                  <P className="text-sm text-gray-400">Exit Price</Div>
                  <P className="text-lg font-semibold">$43,250.00</P>
                </Div>
                <Div>
                  <P className="text-sm text-gray-400">Position Size</Div>
                  <P className="text-lg font-semibold">0.5 BTC</P>
                </Div>
                <Div>
                  <P className="text-sm text-gray-400">P&L</Div>
                  <P className="text-lg font-semibold text-green-400">+$550.00 (2.61%)</P>
                </Div>
                <Div>
                  <P className="text-sm text-gray-400">Duration</Div>
                  <P className="text-lg font-semibold">12h 30m</P>
                </Div>
                <Div>
                  <P className="text-sm text-gray-400">Status</Div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400" />
                    Completed
                  </Badge>
                </Div>
              </div />
          </Card>
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