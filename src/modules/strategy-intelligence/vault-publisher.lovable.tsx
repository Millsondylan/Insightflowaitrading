// TODO: implement strategy publishing with Pro gate
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Strategy } from './types'

export const VaultPublisher: React.FC = () => {
  const [strategy, setStrategy] = useState<strategy  >({
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
    <card  style={{ width: "100%", color: "white" }}>
      <cardheader  >
        <cardtitle  >Strategy Publisher</CardTitle>
      </CardHeader>
      <cardcontent  >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Strategy Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input  > setStrategy(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Strategy Name"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <input  > setStrategy(prev => ({ ...prev, version: e.target.value }))}
                placeholder="Version"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <textarea  > setStrategy(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Strategy Description"
              className="mt-2 bg-zinc-900 border-zinc-700 text-white"
              rows={3}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Publish Settings</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Visibility</label>
                <div className="flex space-x-2">
                  <button  > setPublishDetails(prev => ({ ...prev, visibility: 'private' }))}
                    className="text-white"
                  >
                    Private
                  </Button>
                  <button  > setPublishDetails(prev => ({ ...prev, visibility: 'community' }))}
                    className="text-white"
                  >
                    Community
                  </Button>
                </div>
              </div>

              <input  > setPublishDetails(prev => ({ ...prev, communityTags: e.target.value }))}
                placeholder="Community Tags (comma-separated)"
                className="bg-zinc-900 border-zinc-700 text-white"
              />

              <input  > setPublishDetails(prev => ({ ...prev, marketConditions: e.target.value }))}
                placeholder="Market Conditions"
                className="bg-zinc-900 border-zinc-700 text-white"
              />

              <textarea  > setPublishDetails(prev => ({ ...prev, disclaimer: e.target.value }))}
                placeholder="Disclaimer (optional)"
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={3}
              />
            </div>
          </div>

          <button  style={{ width: "100%" }}>
            Publish Strategy
          </Button>
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
