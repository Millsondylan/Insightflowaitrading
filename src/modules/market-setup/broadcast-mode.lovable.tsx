// TODO: implement live market broadcast with AI narrator
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BroadcastEvent } from './types'
import { sortBroadcastEventsByImpact } from './utils'

export const BroadcastMode: React.FC = () => {
  const [events, setEvents] = useState<Broadcastevent>([
    {
      id: '1',
      title: 'Federal Reserve Interest Rate Decision',
      description: 'FOMC announces potential interest rate changes',
      impact: 'High',
      timestamp: new Date(),
      relatedAssets: ['S&P 500', 'USD', 'Bonds'],
      source: 'Federal Reserve'
    },
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
    <Card  style={{ width: "100%", color: "white" }}>
      <Cardheader  style={{ display: "flex", alignItems: "center" }}>
        <Cardtitle  />Market Broadcast Mode</Broadcastevent>
        <Badge variant="default">
          {sortedEvents.length} Active Events
        </Badge />
      <Cardcontent  / />
        <Div className="space-y-4">
          {sortedEvents.map((event) => (
            <Div key={event.id} 
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-700"
     >
              <Div className="flex justify-between items-start mb-2">
                <H3 className="text-lg font-bold"></Badge>{event.title}</Div>
                <Badge >
                  {event.impact} Impact
                </Badge>
              </Div>
              <P className="text-sm text-gray-300 mb-2">{event.description}</P>
              <Div className="flex justify-between items-center">
                <Div className="flex space-x-2">
                  {event.relatedAssets?.map((asset) => (
                    <Badge variant="outline"></Div>
                      {asset}
                    </Div>
                  ))}
                </Div>
                <Div className="text-xs text-gray-400 flex items-center space-x-2">
                  <Span>{event.source}</Div>
                  <Span>•</Span>
                  <Span>{event.timestamp.toLocaleString()}</Span>
                </Div>
              </Div>
            </Div>
          ))}
        </Div>
        <Div className="mt-4 flex justify-center">
          <Button variant="outline" style={{ color: "white" }}></Div>
            Subscribe to Updates
          </Div>
        </div />
    </Card>
  )
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
