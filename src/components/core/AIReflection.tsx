import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { requestReflection, type ReflectionData } from '@/api/journal/reflect';
import { BehaviorTagGroup } from '@/components/ui/BehaviorTag';

interface AIReflectionProps {
  entry: {
    id: string;
    title: string;
    pair: string;
    timeframe: string;
    entryPrice: number;
    exitPrice: number;
    reason: string;
    sentiment: "Bullish" | "Bearish";
    tags: string[];
    createdAt: string;
    userId: string;
    timestamp: number;
    content: string;
    mood: string;
  };
  autoGenerate?: boolean;
  className?: string;
}

const AIReflection: React.FC<AIReflectionProps> = ({ 
  entry, 
  autoGenerate = true, 
  className 
}) => {
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReflection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const reflectionData = await requestReflection(entry);
      setReflection(reflectionData);
    } catch (err) {
      console.error('Error generating reflection:', err);
      setError('Failed to generate AI reflection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoGenerate) {
      generateReflection();
    }
  }, [autoGenerate, entry.id]);

  if (isLoading) {
    return (
      <Card className={cn("border-purple-500/20 bg-purple-500/5", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="text-purple-300">AI is analyzing your trade...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-red-500/20 bg-red-500/5", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateReflection}
              className="border-red-500/30 hover:bg-red-500/10"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reflection && !autoGenerate) {
    return (
      <Card className={cn("border-purple-500/20 bg-purple-500/5", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-purple-300">Generate AI insights for this trade</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateReflection}
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              <Brain className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reflection) return null;

  const confidenceColor = reflection.confidence >= 0.8 ? 'text-green-400' : 
                         reflection.confidence >= 0.6 ? 'text-yellow-400' : 'text-orange-400';
  
  const confidenceLabel = reflection.confidence >= 0.8 ? 'High Confidence' :
                         reflection.confidence >= 0.6 ? 'Medium Confidence' : 'Review Needed';

  return (
    <Card className={cn("border-purple-500/20 bg-purple-500/5", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300">AI Trade Analysis</span>
          </CardTitle>
          <Badge variant="outline" className={cn("border-purple-500/30", confidenceColor)}>
            {confidenceLabel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <h4 className="font-medium text-blue-300">Analysis Summary</h4>
          </div>
          <p className="text-gray-300 leading-relaxed pl-6">
            {reflection.summary}
          </p>
        </div>

        {/* Behavioral Tags */}
        {reflection.tags && reflection.tags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <h4 className="font-medium text-green-300">Behavioral Patterns</h4>
            </div>
            <div className="pl-6">
              <BehaviorTagGroup tags={reflection.tags} />
            </div>
          </div>
        )}

        {/* Suggestion */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h4 className="font-medium text-cyan-300">Improvement Suggestion</h4>
          </div>
          <div className="pl-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-cyan-100 leading-relaxed">
              {reflection.suggestion}
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Analysis Confidence</span>
            <span className={confidenceColor}>
              {Math.round(reflection.confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                reflection.confidence >= 0.8 ? "bg-green-400" :
                reflection.confidence >= 0.6 ? "bg-yellow-400" : "bg-orange-400"
              )}
              style={{ width: `${reflection.confidence * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIReflection;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
