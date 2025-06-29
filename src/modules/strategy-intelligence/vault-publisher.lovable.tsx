// TODO: implement strategy publishing with Pro gate
import React, { useState } from 'react'
import { Strategy } from './types'

export const VaultPublisher: React.FC = () => {
  const [strategy, setStrategy] = useState<Strategy>({
    id: '1', 
    name: 'Momentum Trend', 
    description: 'Trend following strategy targeting strong momentum stocks',
    risk: 'Low', 
    performance: {
      winRate: 0.65,
      profitFactor: 2.3,
      totalReturn: '+24.5%',
      maxDrawdown: 0.15,
      sharpeRatio: 1.8,
      totalTrades: 120,
      profitableTrades: 78,
      averageTradeProfit: 0.5,
      averageTradeDuration: 5,
      expectancy: 0.4,
      riskRewardRatio: 2.5
    },
    tags: ['Trend Following', 'Long-Term'],
    author: 'AI Strategist',
    createdAt: new Date('2024-01-15'),
    version: '1.2.0'
  })

  const [publishDetails, setPublishDetails] = useState({
    visibility: 'private',
    communityTags: '',
    marketConditions: '',
    disclaimer: ''
  })

  const handlePublish = () => {
    console.log('Publishing strategy:', { strategy, publishDetails })
    // TODO: Implement actual publishing logic
  }

  return (
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader>
        <CardTitle>Strategy Publisher</CardTitle>
      </CardHeader>
      <CardContent>
        <div >
          <div>
            <h3 style={{ fontWeight: "700" }}>Strategy Details</h3>
            <div >
              <Input 
                value={strategy.name}
                onChange={(e) => setStrategy(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Strategy Name"
                style={{ color: "white" }}
              />
              <Input 
                value={strategy.version || ''}
                onChange={(e) => setStrategy(prev => ({ ...prev, version: e.target.value }))}
                placeholder="Version"
                style={{ color: "white" }}
              />
            </div>
            <Textarea 
              value={strategy.description || ''}
              onChange={(e) => setStrategy(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Strategy Description"
              style={{ color: "white" }}
              rows={3}
            />
          </div>

          <div>
            <h3 style={{ fontWeight: "700" }}>Publish Settings</h3>
            <div >
              <div>
                <label >Visibility</label>
                <div style={{ display: "flex" }}>
                  <Button 
                    variant={publishDetails.visibility === 'private' ? 'default' : 'outline'}
                    onClick={() => setPublishDetails(prev => ({ ...prev, visibility: 'private' }))}
                    style={{ color: "white" }}
                  >
                    Private
                  </Button>
                  <Button 
                    variant={publishDetails.visibility === 'community' ? 'default' : 'outline'}
                    onClick={() => setPublishDetails(prev => ({ ...prev, visibility: 'community' }))}
                    style={{ color: "white" }}
                  >
                    Community
                  </Button>
                </div>
              </div>

              <Input 
                value={publishDetails.communityTags}
                onChange={(e) => setPublishDetails(prev => ({ ...prev, communityTags: e.target.value }))}
                placeholder="Community Tags (comma-separated)"
                style={{ color: "white" }}
              />

              <Input 
                value={publishDetails.marketConditions}
                onChange={(e) => setPublishDetails(prev => ({ ...prev, marketConditions: e.target.value }))}
                placeholder="Market Conditions"
                style={{ color: "white" }}
              />

              <Textarea 
                value={publishDetails.disclaimer}
                onChange={(e) => setPublishDetails(prev => ({ ...prev, disclaimer: e.target.value }))}
                placeholder="Disclaimer (optional)"
                style={{ color: "white" }}
                rows={3}
              />
            </div>
          </div>

          <Button 
            onClick={handlePublish}
            style={{ width: "100%" }}
          >
            Publish Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 