// TODO: implement live market broadcast with AI narrator
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BroadcastEvent } from './types'
import { sortBroadcastEventsByImpact } from './utils'

export const BroadcastMode: React.FC = () => {
  const [events, setEvents] = useState<broadcastEvent[]>([
    {
      id: '1',
      title: 'Federal Reserve Interest Rate Decision',
      description: 'FOMC announces potential interest rate changes',
      impact: 'High',
      timestamp: new Date(),
      relatedAssets: ['S&P 500', 'USD', 'Bonds'],
      source: 'Federal Reserve'
    }

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};,
    {
      id: '2',
      title: 'Ethereum Network Upgrade',
      description: 'Major protocol update expected to reduce gas fees',
      impact: 'Medium',
      timestamp: new Date(),
      relatedAssets: ['ETH', 'Crypto Tokens'],
      source: 'Ethereum Foundation'
    }
  ])

  const sortedEvents = sortBroadcastEventsByImpact(events)

  return (
    <Card className="w-full bg-black/80 border-zinc-800 text-white"/>
      <CardHeader className="flex flex-row items-center justify-between"/>
        <CardTitle>Market Broadcast Mode</Card>
        <Badge variant="default">
          {sortedEvents.length} Active Events
        </Badge>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <div key={event.id} 
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{event.title}</Badge>
                <Badge variant={
                    event.impact === 'High' ? 'destructive' : 
                    event.impact === 'Medium' ? 'default' : 'secondary'
                  }
   />
                  {event.impact} Impact
                </Badge>
              </div>
              <p className="text-sm text-gray-300 mb-2">{event.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {event.relatedAssets?.map((asset) => (
                    <Badge key={asset} variant="outline">
                      {asset}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 flex items-center space-x-2">
                  <span>{event.source}</div>
                  <span>•</span>
                  <span>{event.timestamp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="text-white"/></div>
            Subscribe to Updates
          </div>
        </div>
    </Card>
  )
} 