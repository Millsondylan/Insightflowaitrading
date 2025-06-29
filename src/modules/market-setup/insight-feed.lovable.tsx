// TODO: implement real-time market insights feed
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Define the interface for feed items
interface InsightFeedItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  source: string;
  tags: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const InsightFeed: React.FC = () => {
  const [insights, setInsights] = useState<InsightFeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulated API fetch - replace with actual API call
    setTimeout(() => {
      setInsights([
        {
          id: '1',
          title: 'Bitcoin breaks $50,000 resistance level',
          content: 'BTC has successfully broken through the key $50,000 resistance level, suggesting potential for further upward movement.',
          timestamp: '10 minutes ago',
          source: 'Market Analysis',
          tags: ['BTC', 'Crypto'],
          sentiment: 'bullish'
        },
        {
          id: '2',
          title: 'NASDAQ futures down after tech earnings',
          content: 'Futures indicate a lower open after mixed earnings results from major technology companies.',
          timestamp: '35 minutes ago',
          source: 'Pre-market Update',
          tags: ['NASDAQ', 'Earnings'],
          sentiment: 'bearish'
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader style={{ display: "flex", alignItems: "center" }}>
        <CardTitle>Market Insights Feed</CardTitle>
        <Badge variant="outline">LIVE</Badge>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {insights.map(insight => (
            <div
              key={insight.id}
              className={`p-4 border rounded-lg ${insight.sentiment === 'bullish' ? 'border-green-500/30 bg-green-500/5' : insight.sentiment === 'bearish' ? 'border-red-500/30 bg-red-500/5' : 'border-gray-500/30 bg-gray-500/5'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{insight.title}</h3>
                <Badge variant={insight.sentiment === 'bullish' ? 'default' : insight.sentiment === 'bearish' ? 'destructive' : 'secondary'}>
                  {insight.sentiment.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-300 mb-2">{insight.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {insight.tags.map(tag => (
                    <Badge variant="outline" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  {insight.timestamp} • {insight.source}
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" style={{ color: "white" }}>
              Load More Insights
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
