// TODO: implement real-time market insights feed
import React, { useState } from 'react'
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
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader style={{ display: "flex", alignItems: "center" }}>
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
        <div >
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              style={{ padding: "16px", border: "1px solid #374151" }}
            >
              <div style={{ display: "flex" }}>
                <h3 style={{ fontWeight: "700" }}>{insight.title}</h3>
                <Badge 
                  variant={
                    insight.sentiment === 'Bullish' ? 'default' : 
                    insight.sentiment === 'Bearish' ? 'destructive' : 'secondary'
                  }
                >
                  {insight.sentiment}
                </Badge>
              </div>
              <p >{insight.content}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                  {insight.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div style={{ color: "#9CA3AF" }}>
                  {insight.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outline" style={{ color: "white" }}>
            Load More Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 