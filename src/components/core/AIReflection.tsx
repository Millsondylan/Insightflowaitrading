import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { requestReflection } from '@/api/journal/reflect';
import { JournalEntry } from '@/lib/journal/types';
import { BehaviorTagGroup } from '@/components/ui/BehaviorTag';

interface AIReflectionProps {
  entry: JournalEntry;
  className?: string;
  autoGenerate?: boolean;
}

export default function AIReflection({ entry, className, autoGenerate = false }: AIReflectionProps) {
  const [reflection, setReflection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (autoGenerate && !reflection && !hasGenerated) {
      generateReflection();
    }
  }, [autoGenerate, reflection, hasGenerated]);

  const generateReflection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestReflection(entry);
      setReflection(result);
      setHasGenerated(true);
      
      toast({
        title: "AI Analysis Complete",
        description: "Your trade has been analyzed by our AI coach.",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI reflection';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn('ai-reflection-card border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-400 animate-pulse"/>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}/>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}/>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700/50"/>
            <Skeleton className="h-4 w-4/5 bg-gray-700/50"/>
            <Skeleton className="h-4 w-3/4 bg-gray-700/50"/>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-20 bg-gray-700/50"/>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-gray-700/50"/>
              <Skeleton className="h-6 w-20 rounded-full bg-gray-700/50"/>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700/50"/>
            <Skeleton className="h-4 w-5/6 bg-gray-700/50"/>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !reflection) {
    return (
      <Card className={cn('ai-reflection-card border-red-500/30 bg-gradient-to-br from-red-900/10 to-orange-900/10', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-red-400"/>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-red-400 text-sm">
            {error}
          </div>
          <Button 
            onClick={generateReflection}
            variant="outline"
            size="sm"
            className="border-red-500/30 hover:bg-red-500/10">
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  // Not generated state
  if (!reflection && !hasGenerated) {
    return (
      <Card className={cn('ai-reflection-card border-gray-500/30 bg-gradient-to-br from-gray-900/10 to-slate-900/10', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-gray-400"/>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </div>
            <Sparkles className="h-4 w-4 text-gray-400"/>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-sm">
            Get AI-powered insights on your trading psychology and decision-making patterns.
          </p>
          <Button 
            onClick={generateReflection}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}>
            <Brain className="h-4 w-4 mr-2"/>
            Analyze Trade
          </button>
        </CardContent>
      </Card>
    );
  }

  // Generated state
  return (
    <Card className={cn('ai-reflection-card border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10 animate-fade-in-up', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-400"/>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn('text-xs font-medium', getConfidenceColor(reflection!.confidence))}>
              {getConfidenceText(reflection!.confidence)}
            </span>
            <div className={cn('w-2 h-2 rounded-full', getConfidenceColor(reflection!.confidence).replace('text-', 'bg-'))}/>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-blue-400"/>
            <h4 className="text-sm font-medium text-blue-400">Summary</h4>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {reflection!.summary}
          </p>
        </div>

        {/* Behavior Tags Section */}
        {reflection!.tags && reflection!.tags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"/>
              <h4 className="text-sm font-medium text-purple-400">Behavioral Patterns</h4>
            </div>
            <BehaviorTagGroup 
              tags={reflection!.tags} 
              animated={true}
              className="ai-reflection-tags"
           />
          </div>
        )}

        {/* Suggestion Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-400"/>
            <h4 className="text-sm font-medium text-yellow-400">Improvement Suggestion</h4>
          </div>
          <p className="text-gray-300 leading-relaxed bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            {reflection!.suggestion}
          </p>
        </div>

        {/* Regenerate Button */}
        <div className="pt-2 border-t border-gray-700/50">
          <Button 
            onClick={generateReflection}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            disabled={loading}>
            <Brain className="h-3 w-3 mr-2"/>
            Regenerate Analysis
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 