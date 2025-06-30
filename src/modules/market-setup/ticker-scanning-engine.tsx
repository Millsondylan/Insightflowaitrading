// TODO: implement ticker scanning for breakouts and setups
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    <Card className="w-full bg-black/80 border-zinc-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ticker Scanning Engine</CardTitle>
        <Badge variant="default">
          {filteredTickers.length} Matching Tickers
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Market Type</label>
              <Select 
                value={filter.marketType} 
                onValueChange={(value: MarketType) => handleFilterChange('marketType', value)}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
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
              <label className="block text-sm mb-1">Min Price</label>
              <Input 
                type="number"
                value={filter.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                placeholder="Minimum Price"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Min Volume</label>
              <Input 
                type="number"
                value={filter.minVolume || ''}
                onChange={(e) => handleFilterChange('minVolume', Number(e.target.value))}
                placeholder="Minimum Volume"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {filteredTickers.map((ticker) => (
            <Div key={ticker.symbol} 
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-700 flex justify-between items-center"
           >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold">{ticker.symbol}</h3>
                  <Badge variant="outline">{ticker.type}</Badge>
                </div>
                <p className="text-sm text-gray-300">{ticker.name}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  ${ticker.price.toLocaleString()}
                </div>
                <Div className={`text-sm ${ticker.changePercent />= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400">
                  Volume: {(ticker.volume / 1_000_000).toFixed(2)}M
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="text-white">
            Refresh Tickers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 