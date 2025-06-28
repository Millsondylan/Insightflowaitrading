import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketSentimentAnalyzer } from './sentiment-analyzer';
import { SentimentAnalysis } from './types';
import { LineChart } from '@/components/ui/charts';

interface SentimentDisplayProps {
  symbol: string;
  apiKey: string;
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
  symbol,
  apiKey
}) => {
  const [analyzer] = useState(() => new MarketSentimentAnalyzer(apiKey));
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<SentimentAnalysis[]>([]);

  useEffect(() => {
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [symbol]);

  const fetchSentiment = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzer.analyzeSentiment(symbol);
      setAnalysis(result);
      setHistoricalData(prev => [...prev, result].slice(-48)); // Keep last 48 data points
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return 'bg-green-500';
    if (score > 0) return 'bg-green-300';
    if (score < -0.5) return 'bg-red-500';
    if (score < 0) return 'bg-red-300';
    return 'bg-yellow-300';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return 'Very Bullish';
    if (score > 0) return 'Bullish';
    if (score < -0.5) return 'Very Bearish';
    if (score < 0) return 'Bearish';
    return 'Neutral';
  };

  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          {loading ? (
            <div className="space-y-2 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Analyzing market sentiment...</p>
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              <p>{error}</p>
            </div>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{symbol} Sentiment Analysis</h2>
        <Badge variant="outline" className={getSentimentColor(analysis.overall)}>
          {getSentimentLabel(analysis.overall)}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Overall Sentiment</h3>
              <Progress 
                value={(analysis.overall + 1) * 50} 
                className="mt-2"
              />
              <p className="mt-1 text-2xl font-bold">
                {(analysis.overall * 100).toFixed(1)}%
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Confidence</h3>
              <div className="mt-2 text-2xl font-bold">
                High
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
              <div className="mt-2 text-2xl font-bold">
                {new Date(analysis.timestamp).toLocaleTimeString()}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">News Sentiment</h3>
              <Progress 
                value={(analysis.components.news + 1) * 50} 
                className="mt-2"
              />
              <p className="mt-1 text-2xl font-bold">
                {(analysis.components.news * 100).toFixed(1)}%
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Social Media Sentiment</h3>
              <Progress 
                value={(analysis.components.socialMedia + 1) * 50} 
                className="mt-2"
              />
              <p className="mt-1 text-2xl font-bold">
                {(analysis.components.socialMedia * 100).toFixed(1)}%
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Technical Sentiment</h3>
              <Progress 
                value={(analysis.components.technical + 1) * 50} 
                className="mt-2"
              />
              <p className="mt-1 text-2xl font-bold">
                {(analysis.components.technical * 100).toFixed(1)}%
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Sentiment Trend</h3>
            <LineChart
              data={historicalData.map(d => ({
                timestamp: new Date(d.timestamp).toLocaleTimeString(),
                value: d.overall
              }))}
              xField="timestamp"
              yField="value"
              height={300}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}; 