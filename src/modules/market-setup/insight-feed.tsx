// TODO: implement real-time market insights feed
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InsightFeedItem } from './types'
import { calculateMarketSentiment } from './utils'

export const InsightFeed: React.FC = () => {
  const [insights, setInsights] = useState<InsightFeedItem[]>([
    {
      id: '1',
      title: 'Bitcoin Breaks Resistance',
      content: 'Bitcoin surpasses $50,000 mark, showing strong bullish momentum',
      timestamp: new Date(),
      tags: ['Crypto', 'Bitcoin', 'Bullish'],
      sentiment: 'Bullish',
      confidence: 0.85,
      relatedAssets: ['BTC/USDT']
    },
    {
      id: '2',
      title: 'Tech Stocks Facing Headwinds',
      content: 'NASDAQ faces potential correction due to rising interest rates',
      timestamp: new Date(),
      tags: ['Stocks', 'Tech', 'Bearish'],
      sentiment: 'Bearish',
      confidence: 0.7,
      relatedAssets: ['NASDAQ', 'AAPL', 'MSFT']
    }
  ])

  const marketSentiment = calculateMarketSentiment(insights)

  return (
    <Card className="w-full bg-black/80 border-zinc-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Market Insights Feed</CardTitle>
        <Badge 
          variant={
            marketSentiment === 'Bullish' ? 'default' : 
            marketSentiment === 'Bearish' ? 'destructive' : 'secondary'
          }
        >
          {marketSentiment} Sentiment
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{insight.title}</h3>
                <Badge 
                  variant={
                    insight.sentiment === 'Bullish' ? 'default' : 
                    insight.sentiment === 'Bearish' ? 'destructive' : 'secondary'
                  }
                >
                  {insight.sentiment}
                </Badge>
              </div>
              <p className="text-sm text-gray-300 mb-2">{insight.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {insight.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  {insight.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="text-white">
            Load More Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 