// Market Setup Utility Functions
import { MarketTicker, MarketScannerFilter, BroadcastEvent, InsightFeedItem } from './types'

export const filterMarketTickers = (
  tickers: MarketTicker[], 
  filter: MarketScannerFilter
): MarketTicker[] => {
  return tickers.filter(ticker => {
    const matchMarketType = !filter.marketType || ticker.type === filter.marketType
    const matchMinPrice = !filter.minPrice || ticker.price >= filter.minPrice
    const matchMaxPrice = !filter.maxPrice || ticker.price <= filter.maxPrice
    const matchMinVolume = !filter.minVolume || ticker.volume >= filter.minVolume

    return matchMarketType && matchMinPrice && matchMaxPrice && matchMinVolume
  })
}

export const calculateMarketSentiment = (insights: InsightFeedItem[]): string => {
  const sentiments = insights.map(insight => insight.sentiment)
  const bullishCount = sentiments.filter(s => s === 'Bullish').length
  const bearishCount = sentiments.filter(s => s === 'Bearish').length
  const neutralCount = sentiments.filter(s => s === 'Neutral').length

  if (bullishCount > bearishCount && bullishCount > neutralCount) return 'Bullish'
  if (bearishCount > bullishCount && bearishCount > neutralCount) return 'Bearish'
  return 'Neutral'
}

export const sortBroadcastEventsByImpact = (events: BroadcastEvent[]): BroadcastEvent[] => {
  const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
  return [...events].sort((a, b) => 
    impactOrder[b.impact] - impactOrder[a.impact]
  )
}

export const generateDailyMarketInsight = (
  tickers: MarketTicker[], 
  events: BroadcastEvent[]
): string => {
  const topMovers = tickers
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 3)

  const topEvents = sortBroadcastEventsByImpact(events).slice(0, 2)

  return `Market Insight: 
  Top Movers: ${topMovers.map(t => `${t.symbol} (${t.changePercent.toFixed(2)}%)`).join(', ')}
  Key Events: ${topEvents.map(e => `${e.title} (${e.impact} Impact)`).join(', ')}`
} 