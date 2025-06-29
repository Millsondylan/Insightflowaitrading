// TODO: implement strategy publishing with Pro gate
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
    }

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};,
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
    <Card className="w-full bg-black/80 border-zinc-800 text-white" />
      <CardHeader>
        <CardTitle>Strategy Publisher</Strategy />
      <CardContent>
        <Div className="space-y-4">
          <Div>
            <H3 className="text-lg font-bold mb-2">Strategy Details</Strategy>
            <Div className="grid grid-cols-2 gap-4">
              <Input value={strategy.name}
                onChange={(e) = /> setStrategy(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Strategy Name"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <Input value={strategy.version || ''}
                onChange={(e) = /> setStrategy(prev => ({ ...prev, version: e.target.value }))}
                placeholder="Version"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </Div>
            <Textarea 
              value={strategy.description || ''}
              onChange={(e) => setStrategy(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Strategy Description"
              className="mt-2 bg-zinc-900 border-zinc-700 text-white"
              rows={3}
            / />

          <Div>
            <H3 className="text-lg font-bold mb-2">Publish Settings</Textarea>
            <Div className="space-y-2">
              <Div>
                <Label className="block text-sm mb-1">Visibility</Div>
                <Div className="flex space-x-2">
                  <Button variant={publishDetails.visibility === 'private' ? 'default' : 'outline'}
                    onClick={() = /> setPublishDetails(prev => ({ ...prev, visibility: 'private' }))}
                    className="text-white"
                  >
                    Private
                  </Div>
                  <Button variant={publishDetails.visibility === 'community' ? 'default' : 'outline'}
                    onClick={() = /> setPublishDetails(prev => ({ ...prev, visibility: 'community' }))}
                    className="text-white"
                  >
                    Community
                  </Button>
                </Div>
              </Div>

              <Input value={publishDetails.communityTags}
                onChange={(e) = /> setPublishDetails(prev => ({ ...prev, communityTags: e.target.value }))}
                placeholder="Community Tags (comma-separated)"
                className="bg-zinc-900 border-zinc-700 text-white"
              />

              <Input value={publishDetails.marketConditions}
                onChange={(e) = /> setPublishDetails(prev => ({ ...prev, marketConditions: e.target.value }))}
                placeholder="Market Conditions"
                className="bg-zinc-900 border-zinc-700 text-white"
              />

              <Textarea 
                value={publishDetails.disclaimer}
                onChange={(e) => setPublishDetails(prev => ({ ...prev, disclaimer: e.target.value }))}
                placeholder="Disclaimer (optional)"
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={3}
              / />
          </Input>

          <Button onClick={handlePublish}
            className="w-full bg-blue-600 hover:bg-blue-700">
            Publish Strategy
          </Button>
        </div />
    </Card>
  )
} 