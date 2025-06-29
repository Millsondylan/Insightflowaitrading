// TODO: implement daily trading plan generator
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DailyPlan, MarketTicker, BroadcastEvent } from './types'
import { generateDailyMarketInsight } from './utils'

export const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>({
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
      }

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};,
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
    <Card className="w-full bg-black/80 border-zinc-800 text-white" />
      <CardHeader className="flex flex-row items-center justify-between" />
        <CardTitle>Daily Market Planner</Date>
        <Badge variant={
            dailyPlan.marketOutlook === 'Bullish' ? 'default' : 
            dailyPlan.marketOutlook === 'Bearish' ? 'destructive' : 'secondary'
          }
    >
          {dailyPlan.marketOutlook} Outlook
        </Badge>
      </CardHeader>
      <CardContent>
        <Div className="grid grid-cols-3 gap-4">
          <Div>
            <H3 className="text-lg font-bold mb-2">Calendar</CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-zinc-700"
            />
          </Calendar>
          
          <Div className="col-span-2">
            <Div className="space-y-4">
              <Div>
                <H3 className="text-lg font-bold mb-2">Potential Trades</Div>
                <Div className="space-y-2">
                  {dailyPlan.potentialTrades.map((trade) => (
                    <Div key={trade.symbol}
                      className="bg-zinc-900 p-3 rounded-lg border border-zinc-700 flex justify-between items-center"
                   />
                      <Div>
                        <Div className="flex items-center space-x-2">
                          <H4 className="font-bold">{trade.symbol}</Div>
                          <Badge variant="outline">{trade.type}</Badge>
                        </Div>
                        <P className="text-sm text-gray-300">{trade.name}</P>
                      </Div>
                      <Div className="text-right">
                        <Div className="text-lg font-bold">
                          ${trade.price.toLocaleString()}
                        </Div>
                        <Div className={`text-sm ${trade.changePercent />= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.changePercent >= 0 ? '+' : ''}{trade.changePercent.toFixed(2)}%
                        </Div>
                      </Div>
                    </Div>
                  ))}
                </Div>
              </Div>

              <Div>
                <H3 className="text-lg font-bold mb-2">Key Events</Div>
                <Div className="space-y-2">
                  {dailyPlan.keyEvents.map((event) => (
                    <Div key={event.id}
                      className="bg-zinc-900 p-3 rounded-lg border border-zinc-700"
                  >
                      <Div className="flex justify-between items-center mb-2">
                        <H4 className="font-bold">{event.title}</Div>
                        <Badge variant={
                            event.impact === 'High' ? 'destructive' : 
                            event.impact === 'Medium' ? 'default' : 'secondary'
                          }
                      >
                          {event.impact} Impact
                        </Badge>
                      </Div>
                      <P className="text-sm text-gray-300 mb-2">{event.description}</P>
                      <Div className="flex space-x-2">
                        {event.relatedAssets?.map((asset) => (
                          <Badge key={asset} variant="outline">{asset}</Div>
                        ))}
                      </Div>
                    </Div>
                  ))}
                </Div>
              </Div>

              <Div>
                <H3 className="text-lg font-bold mb-2">Risk Management</Div>
                <Div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
                  <Div className="grid grid-cols-2 gap-2">
                    <Div>
                      <P className="text-sm text-gray-400">Total Risk</Div>
                      <P className="font-bold">{(dailyPlan.riskManagement.totalRisk * 100).toFixed(1)}%</P>
                    </Div>
                    <Div>
                      <P className="text-sm text-gray-400">Max Drawdown</Div>
                      <P className="font-bold">{(dailyPlan.riskManagement.maxDrawdown * 100).toFixed(1)}%</P>
                    </Div>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>

        <Div className="mt-4 flex justify-center space-x-4">
          <Button variant="outline" className="text-white" onClick={generateInsight} />
            Generate Market Insight
          </Div>
          <Button variant="default" />
            Start Trading Session
          </Button>
        </Div>
      </CardContent>
    </Card>
  )
} 