// TODO: implement live market broadcast with AI narrator
import React, { useState } from 'react'
import { BroadcastEvent } from './types'
import { sortBroadcastEventsByImpact } from './utils'

export const BroadcastMode: React.FC = () => {
  const [events, setEvents] = useState<BroadcastEvent[]>([
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
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader style={{ display: "flex", alignItems: "center" }}>
        <CardTitle>Market Broadcast Mode</CardTitle>
        <Badge variant="default">
          {sortedEvents.length} Active Events
        </Badge>
      </CardHeader>
      <CardContent>
        <div >
          {sortedEvents.map((event) => (
            <div 
              key={event.id} 
              style={{ padding: "16px", border: "1px solid #374151" }}
            >
              <div style={{ display: "flex" }}>
                <h3 style={{ fontWeight: "700" }}>{event.title}</h3>
                <Badge 
                  variant={
                    event.impact === 'High' ? 'destructive' : 
                    event.impact === 'Medium' ? 'default' : 'secondary'
                  }
                >
                  {event.impact} Impact
                </Badge>
              </div>
              <p >{event.description}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                  {event.relatedAssets?.map((asset) => (
                    <Badge key={asset} variant="outline">
                      {asset}
                    </Badge>
                  ))}
                </div>
                <div style={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}>
                  <span>{event.source}</span>
                  <span>•</span>
                  <span>{event.timestamp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outline" style={{ color: "white" }}>
            Subscribe to Updates
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 