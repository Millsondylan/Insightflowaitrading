// TODO: implement ticker scanning for breakouts and setups
import React, { useState } from 'react'
import { MarketTicker, MarketType, MarketScannerFilter } from './types'
import { filterMarketTickers } from './utils'

export const TickerScanningEngine: React.FC = () => {
  const [tickers, setTickers] = useState<MarketTicker[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'Stocks',
      price: 185.50,
      changePercent: 2.3,
      volume: 45_000_000,
      marketCap: 2_900_000_000_000
    },
    {
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      type: 'Crypto',
      price: 52_000,
      changePercent: 3.5,
      volume: 25_000_000_000,
      marketCap: 1_000_000_000_000
    }
  ])

  const [filter, setFilter] = useState<MarketScannerFilter>({
    marketType: 'Stocks',
    minPrice: 50,
    minVolume: 1_000_000
  })

  const filteredTickers = filterMarketTickers(tickers, filter)

  const handleFilterChange = (key: keyof MarketScannerFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader style={{ display: "flex", alignItems: "center" }}>
        <CardTitle>Ticker Scanning Engine</CardTitle>
        <Badge variant="default">
          {filteredTickers.length} Matching Tickers
        </Badge>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: "16px" }}>
          <div >
            <div>
              <label >Market Type</label>
              <Select 
                value={filter.marketType} 
                onValueChange={(value: MarketType) => handleFilterChange('marketType', value)}
              >
                <SelectTrigger style={{ color: "white" }}>
                  <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                  {['Stocks', 'Crypto', 'Forex', 'Commodities'].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label >Min Price</label>
              <Input 
                type="number"
                value={filter.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                placeholder="Minimum Price"
                style={{ color: "white" }}
              />
            </div>
            <div>
              <label >Min Volume</label>
              <Input 
                type="number"
                value={filter.minVolume || ''}
                onChange={(e) => handleFilterChange('minVolume', Number(e.target.value))}
                placeholder="Minimum Volume"
                style={{ color: "white" }}
              />
            </div>
          </div>
        </div>
        <div >
          {filteredTickers.map((ticker) => (
            <div 
              key={ticker.symbol} 
              style={{ padding: "16px", border: "1px solid #374151", display: "flex", alignItems: "center" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3 style={{ fontWeight: "700" }}>{ticker.symbol}</h3>
                  <Badge variant="outline">{ticker.type}</Badge>
                </div>
                <p >{ticker.name}</p>
              </div>
              <div >
                <div style={{ fontWeight: "700" }}>
                  ${ticker.price.toLocaleString()}
                </div>
                <div className={`text-sm ${ticker.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                </div>
                <div style={{ color: "#9CA3AF" }}>
                  Volume: {(ticker.volume / 1_000_000).toFixed(2)}M
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outline" style={{ color: "white" }}>
            Refresh Tickers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 