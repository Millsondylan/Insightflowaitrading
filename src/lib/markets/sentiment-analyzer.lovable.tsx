import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { MarketSentimentAnalyzer } from './sentiment-analyzer';
import { SentimentAnalysis } from './types';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@/components/charts/LineChart').then(mod => mod.LineChart), {
  ssr: false
});

interface SentimentDisplayProps {
  symbol: string;
  apiKey: string;
}

interface SentimentData {
  score: number;
  volume: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  sources: {
    twitter: number;
    reddit: number;
    news: number;
  };
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
  symbol,
  apiKey
}) => {
  const { toast } = useToast();
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call for demo
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSentiment({
          score: 0.75,
          volume: 15000,
          trend: 'bullish',
          sources: {
            twitter: 0.8,
            reddit: 0.7,
            news: 0.75
          }
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch sentiment data');
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, [symbol, apiKey]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Loading sentiment data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '8px'
      }}>
        {error}
      </div>
    );
  }

  if (!sentiment) {
    return null;
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return '#22c55e';
      case 'bearish':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter':
        return '🐦';
      case 'reddit':
        return '🤖';
      case 'news':
        return '📰';
      default:
        return '📊';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          {symbol} Market Sentiment
        </h2>
        <div style={{
          padding: '8px 16px',
          backgroundColor: getTrendColor(sentiment.trend),
          color: 'white',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {sentiment.trend.toUpperCase()}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Sentiment Score
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {(sentiment.score * 100).toFixed(1)}%
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            24h Volume
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {sentiment.volume.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          Source Analysis
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(sentiment.sources).map(([source, score]) => (
            <div key={source} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '24px' }}>{getSourceIcon(source)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {source}
                </div>
                <div style={{ 
                  width: `${score * 100}%`,
                  height: '4px',
                  backgroundColor: getTrendColor(sentiment.trend),
                  borderRadius: '2px',
                  marginTop: '8px'
                }}/>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {(score * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default sentiment-analyzer;
