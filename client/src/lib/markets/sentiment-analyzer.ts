
export interface SentimentData {
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  sources: string[];
  timestamp: Date;
}

export interface NewsItem {
  title: string;
  content: string;
  source: string;
  publishedAt: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

/**
 * Analyzes sentiment for a given symbol
 * @param symbol The trading symbol to analyze
 * @returns Promise resolving to sentiment data
 */
export async function analyzeSentiment(symbol: string): Promise<SentimentData> {
  try {
    // Fetch news data for the symbol
    const newsData = await fetchNewsForSymbol(symbol);
    
    // Analyze sentiment from news
    const sentimentScores = newsData.map(analyzeNewsSentiment);
    
    // Calculate overall sentiment
    const avgScore = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
    const sentiment = avgScore > 0.1 ? 'bullish' : avgScore < -0.1 ? 'bearish' : 'neutral';
    
    // Calculate confidence based on data volume and consistency
    const confidence = calculateConfidence(sentimentScores);
    
    return {
      symbol,
      sentiment,
      score: avgScore,
      confidence,
      sources: newsData.map(item => item.source),
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    
    // Return neutral sentiment on error
    return {
      symbol,
      sentiment: 'neutral',
      score: 0,
      confidence: 0.1,
      sources: [],
      timestamp: new Date()
    };
  }
}

/**
 * Fetches news data for a symbol
 * @param symbol The trading symbol
 * @returns Promise resolving to news items
 */
async function fetchNewsForSymbol(symbol: string): Promise<NewsItem[]> {
  // Mock implementation - replace with actual news API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      title: `${symbol} shows strong quarterly results`,
      content: `${symbol} reported better than expected earnings...`,
      source: 'Market News',
      publishedAt: new Date(Date.now() - 3600000)
    },
    {
      title: `Analysts upgrade ${symbol} price target`,
      content: `Several analysts have raised their price targets for ${symbol}...`,
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - 7200000)
    }
  ];
}

/**
 * Analyzes sentiment from a single news item
 * @param newsItem The news item to analyze
 * @returns Sentiment score (-1 to 1)
 */
function analyzeNewsSentiment(newsItem: NewsItem): number {
  const text = `${newsItem.title} ${newsItem.content}`.toLowerCase();
  
  // Simple keyword-based sentiment analysis
  const positiveWords = ['strong', 'upgrade', 'growth', 'profit', 'gain', 'rise', 'bull', 'positive'];
  const negativeWords = ['weak', 'downgrade', 'loss', 'decline', 'fall', 'bear', 'negative', 'concern'];
  
  let score = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 1;
  });
  
  // Normalize score
  return Math.max(-1, Math.min(1, score / 10));
}

/**
 * Calculates confidence based on sentiment scores
 * @param scores Array of sentiment scores
 * @returns Confidence value (0 to 1)
 */
function calculateConfidence(scores: number[]): number {
  if (scores.length === 0) return 0;
  
  // Calculate variance to measure consistency
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  
  // Higher consistency and more data points = higher confidence
  const consistencyFactor = 1 - Math.min(variance, 1);
  const volumeFactor = Math.min(scores.length / 10, 1);
  
  return (consistencyFactor + volumeFactor) / 2;
}

/**
 * Gets sentiment for multiple symbols
 * @param symbols Array of trading symbols
 * @returns Promise resolving to sentiment data for all symbols
 */
export async function getMultiSymbolSentiment(symbols: string[]): Promise<SentimentData[]> {
  const sentimentPromises = symbols.map(symbol => analyzeSentiment(symbol));
  
  try {
    return await Promise.all(sentimentPromises);
  } catch (error) {
    console.error('Error getting multi-symbol sentiment:', error);
    return symbols.map(symbol => ({
      symbol,
      sentiment: 'neutral' as const,
      score: 0,
      confidence: 0.1,
      sources: [],
      timestamp: new Date()
    }));
  }
}

/**
 * Gets sentiment trend for a symbol over time
 * @param symbol The trading symbol
 * @param days Number of days to look back
 * @returns Promise resolving to sentiment trend data
 */
export async function getSentimentTrend(symbol: string, days: number = 7): Promise<SentimentData[]> {
  const trendData: SentimentData[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    
    // Mock historical sentiment data
    const mockSentiment: SentimentData = {
      symbol,
      sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
      score: (Math.random() - 0.5) * 2,
      confidence: 0.5 + Math.random() * 0.5,
      sources: ['Historical Data'],
      timestamp: date
    };
    
    trendData.push(mockSentiment);
  }
  
  return trendData.reverse(); // Oldest first
}
