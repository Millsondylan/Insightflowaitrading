// TODO: implement daily trading plan generator
import React, { useState } from 'react'
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
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader style={{ display: "flex", alignItems: "center" }}>
        <CardTitle>Daily Market Planner</CardTitle>
        <Badge 
          variant={
            dailyPlan.marketOutlook === 'Bullish' ? 'default' : 
            dailyPlan.marketOutlook === 'Bearish' ? 'destructive' : 'secondary'
          }
        >
          {dailyPlan.marketOutlook} Outlook
        </Badge>
      </CardHeader>
      <CardContent>
        <div >
          <div>
            <h3 style={{ fontWeight: "700" }}>Calendar</h3>
            <span style={{fontSize: '16px'}}>📅</span>
          </div>
          
          <div >
            <div >
              <div>
                <h3 style={{ fontWeight: "700" }}>Potential Trades</h3>
                <div >
                  {dailyPlan.potentialTrades.map((trade) => (
                    <div 
                      key={trade.symbol}
                      style={{ border: "1px solid #374151", display: "flex", alignItems: "center" }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <h4 style={{ fontWeight: "700" }}>{trade.symbol}</h4>
                          <Badge variant="outline">{trade.type}</Badge>
                        </div>
                        <p >{trade.name}</p>
                      </div>
                      <div >
                        <div style={{ fontWeight: "700" }}>
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
                <h3 style={{ fontWeight: "700" }}>Key Events</h3>
                <div >
                  {dailyPlan.keyEvents.map((event) => (
                    <div 
                      key={event.id}
                      style={{ border: "1px solid #374151" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h4 style={{ fontWeight: "700" }}>{event.title}</h4>
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
                      <div style={{ display: "flex" }}>
                        {event.relatedAssets?.map((asset) => (
                          <Badge key={asset} variant="outline">{asset}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: "700" }}>Risk Management</h3>
                <div style={{ border: "1px solid #374151" }}>
                  <div >
                    <div>
                      <p style={{ color: "#9CA3AF" }}>Total Risk</p>
                      <p style={{ fontWeight: "700" }}>{(dailyPlan.riskManagement.totalRisk * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p style={{ color: "#9CA3AF" }}>Max Drawdown</p>
                      <p style={{ fontWeight: "700" }}>{(dailyPlan.riskManagement.maxDrawdown * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outline" style={{ color: "white" }} onClick={generateInsight}>
            Generate Market Insight
          </Button>
          <Button variant="default">
            Start Trading Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 