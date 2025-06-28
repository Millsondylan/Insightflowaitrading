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

export interface SentimentAnalysis {
  overall: number;  // -1 to 1 indicating negative to positive sentiment
  components: {
    news: number;
    socialMedia: number;
    technical: number;
  };
  timestamp: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  indicators: TechnicalIndicator[];
} 