// TODO: implement daily trading plan generator
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DailyPlan, MarketTicker, BroadcastEvent } from './types'
import { generateDailyMarketInsight } from './utils'

export const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<date  >(new Date())
  const [dailyPlan, setDailyPlan] = useState<dailyplan  >({
    id: '1',
    date: new Date(),
    marketOutlook: 'Neutral',
    potentialTrades: [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'Stocks',
        price: 185.50,
        changePercent: 2.3,
        volume: 45_000_000
      },
      {
        symbol: 'BTC/USDT',
        name: 'Bitcoin',
        type: 'Crypto',
        price: 52_000,
        changePercent: 3.5,
        volume: 25_000_000_000
      }
    ],
    keyEvents: [
      {
        id: '1',
        title: 'Federal Reserve Interest Rate Decision',
        description: 'FOMC announces potential interest rate changes',
        impact: 'High',
        timestamp: new Date(),
        relatedAssets: ['S&P 500', 'USD', 'Bonds']
      }
    ],
    riskManagement: {
      totalRisk: 0.05,
      maxDrawdown: 0.1
    }
  })

  const generateInsight = () => {
    const insight = generateDailyMarketInsight(
      dailyPlan.potentialTrades, 
      dailyPlan.keyEvents
    )
    console.log(insight)
  }

  return (
    <card  style={{ width: "100%", color: "white" }}>
      <cardheader  style={{ display: "flex", alignItems: "center" }}>
        <cardtitle  >Daily Market Planner</CardTitle>
        <badge  >
          {dailyPlan.marketOutlook} Outlook
        </Badge>
      </CardHeader>
      <cardcontent  >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Calendar</h3>
            <calendar mode="single" style={{ borderRadius: "0.375rem", border: "1px solid #E5E7EB" }}>
          </div>
          
          <div className="col-span-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Potential Trades</h3>
                <div className="space-y-2">
                  {dailyPlan.potentialTrades.map((trade) => (
                    <div 
                      key={trade.symbol}
                      className="bg-zinc-900 p-3 rounded-lg border border-zinc-700 flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold">{trade.symbol}</h4>
                          <badge variant="outline" >{trade.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-300">{trade.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${trade.price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${trade.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.changePercent >= 0 ? '+' : ''}{trade.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Key Events</h3>
                <div className="space-y-2">
                  {dailyPlan.keyEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="bg-zinc-900 p-3 rounded-lg border border-zinc-700"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">{event.title}</h4>
                        <badge  >
                          {event.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                      <div className="flex space-x-2">
                        {event.relatedAssets?.map((asset) => (
                          <badge variant="outline" >{asset}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Risk Management</h3>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-400">Total Risk</p>
                      <p className="font-bold">{(dailyPlan.riskManagement.totalRisk * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Max Drawdown</p>
                      <p className="font-bold">{(dailyPlan.riskManagement.maxDrawdown * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <button variant="outline" style={{ color: "white" }}>
            Generate Market Insight
          </Button>
          <button variant="default" >
            Start Trading Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
export const lovable = { component: true };
