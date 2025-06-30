export interface NewsItem {
  title: string;
  content: string;
  source: string;
  timestamp: number;
}

export interface SocialMediaPost {
  content: string;
  platform: string;
  engagement: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
  timestamp: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: number;  // -1 to 1 indicating bearish to bullish
}

export interface SentimentComponents {
  news: number;
  socialMedia: number;
  technical: number;
}

export interface SentimentAnalysis {
  symbol: string;
  overall: number;
  components: SentimentComponents;
  timestamp: string;
  confidence: number;
  sources: {
    news: number;
    twitter: number;
    reddit: number;
    technicalIndicators: number;
  };
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  indicators: TechnicalIndicator[];
} 