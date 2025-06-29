import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Share2, ArrowLeft } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const mockStrategy: Strategy = {
  id: '1',
  name: 'Golden Cross Strategy',
  description: 'A trend-following strategy that uses moving average crossovers to identify potential entry and exit points.',
  author: 'TradingPro',
  rating: 4.5,
  tags: ['Trend Following', 'Moving Averages', 'Technical'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
};

export default function VaultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const strategy = mockStrategy; // In a real app, fetch based on id

  return (
    <Div className="container mx-auto p-6">
      <Div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" className="text-gray-400 hover:text-white" />
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vault
        </Div>
      </Div>

      <Card>
        <CardHeader>
          <Div className="flex justify-between items-start">
            <Div>
              <CardTitle className="text-2xl" />{strategy.name}</Card>
              <P className="text-sm text-gray-400">
                By {strategy.author} • Last updated {new Date(strategy.updatedAt).toLocaleDateString()}
              </P>
            </Div>
            <Div className="flex gap-2">
              <Button variant="ghost" className="text-yellow-400 hover:text-yellow-500" />
                <Star className="h-4 w-4 mr-2" />
                {strategy.rating}
              </Div>
              <Button variant="ghost" className="text-gray-400 hover:text-white" />
                <Share2 className="h-4 w-4" />
              </Button>
            </Div>
          </div />
        <CardContent>
          <Div className="space-y-6">
            <Div>
              <H3 className="text-lg font-semibold mb-2">Description</CardContent>
              <P className="text-gray-300">{strategy.description}</P>
            </Div>

            <Div>
              <H3 className="text-lg font-semibold mb-2">Tags</Div>
              <Div className="flex flex-wrap gap-2">
                {strategy.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" />
                    {tag}
                  </Div>
                ))}
              </Div>
            </Div>

            <Div>
              <H3 className="text-lg font-semibold mb-2">Performance</Div>
              <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6" />
                    <Div className="text-center">
                      <P className="text-2xl font-bold text-green-400">+24.5%</Div>
                      <P className="text-sm text-gray-400">Annual Return</P>
                    </div />
                </Card>
                <Card>
                  <CardContent className="pt-6" />
                    <Div className="text-center">
                      <P className="text-2xl font-bold text-blue-400">1.8</Card>
                      <P className="text-sm text-gray-400">Sharpe Ratio</P>
                    </div />
                </Card>
                <Card>
                  <CardContent className="pt-6" />
                    <Div className="text-center">
                      <P className="text-2xl font-bold text-purple-400">15.2%</Card>
                      <P className="text-sm text-gray-400">Max Drawdown</P>
                    </div />
                </Card>
              </Div>
            </Div>
          </div />
      </Card>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 