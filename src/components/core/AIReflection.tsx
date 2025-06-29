import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BehaviorTagGroup } from '@/components/ui/BehaviorTag';
import { useToast } from '@/components/ui/use-toast';
import { JournalEntry } from '@/lib/journal/schema';
import { AIReflection as AIReflectionType } from '@/lib/journal/promptBuilder';
import { requestReflection } from '@/api/journal/reflect';
import { cn } from '@/lib/utils';
import { Brain, Lightbulb, Target, Sparkles } from 'lucide-react';

interface AIReflectionProps {
  entry: JournalEntry;
  className?: string;
  autoGenerate?: boolean;
}

const AIReflection: React.FC<aIReflectionProps> = ({ 
  entry, 
  className, 
  autoGenerate = false 
}) => {
  const { toast } = useToast();
  const [reflection, setReflection] = useState<aIReflectionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (autoGenerate && !hasGenerated) {
      generateReflection();
    }
  }, [autoGenerate, hasGenerated]);

  const generateReflection = async () => {
    if (loading) return;
    
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
      <Card className={cn('ai-reflection-card border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10', className)} />
        <CardHeader className="pb-3" />
          <Div className="flex items-center space-x-2">
            <brain className="h-5 w-5 text-blue-400 animate-pulse" />
            <CardTitle className="text-lg" />AI Analysis</Card>
            <Div className="flex space-x-1">
              <Div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <Div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <Div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </Div>
          </Div>
        </CardHeader>
        <CardContent className="space-y-4" />
          <Div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700/50" />
            <Skeleton className="h-4 w-4/5 bg-gray-700/50" />
            <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
          </CardContent>
          <Div className="space-y-2">
            <Skeleton className="h-6 w-20 bg-gray-700/50" />
            <Div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-gray-700/50" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-700/50" />
            </Div>
          </Div>
          <Div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700/50" />
            <Skeleton className="h-4 w-5/6 bg-gray-700/50" />
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !reflection) {
    return (
      <Card className={cn('ai-reflection-card border-red-500/30 bg-gradient-to-br from-red-900/10 to-orange-900/10', className)} />
        <CardHeader className="pb-3" />
          <Div className="flex items-center space-x-2">
            <brain className="h-5 w-5 text-red-400" />
            <CardTitle className="text-lg" />AI Analysis</Card>
          </Div>
        </CardHeader>
        <CardContent className="space-y-4" />
          <Div className="text-red-400 text-sm">
            {error}
          </CardContent>
          <Button onClick={generateReflection}
            variant="outline"
            size="sm"
            className="border-red-500/30 hover:bg-red-500/10"
      >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not generated state
  if (!reflection && !hasGenerated) {
    return (
      <Card className={cn('ai-reflection-card border-gray-500/30 bg-gradient-to-br from-gray-900/10 to-slate-900/10', className)} />
        <CardHeader className="pb-3" />
          <Div className="flex items-center justify-between">
            <Div className="flex items-center space-x-2">
              <brain className="h-5 w-5 text-gray-400" />
              <CardTitle className="text-lg" />AI Analysis</Card>
            </Div>
            <Sparkles className="h-4 w-4 text-gray-400" />
          </Sparkles>
        </CardHeader>
        <CardContent className="space-y-4" />
          <P className="text-gray-400 text-sm">
            Get AI-powered insights on your trading psychology and decision-making patterns.
          </CardContent>
          <Button onClick={generateReflection}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          />
            <brain className="h-4 w-4 mr-2" />
            Analyze Trade
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Generated state
  return (
    <Card className={cn('ai-reflection-card border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10 animate-fade-in-up', className)} />
      <CardHeader className="pb-3" />
        <Div className="flex items-center justify-between">
          <Div className="flex items-center space-x-2">
            <brain className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg" />AI Analysis</Card>
          </Div>
          <Div className="flex items-center space-x-2">
            <Span className={cn('text-xs font-medium', getConfidenceColor(reflection!.confidence))}>
              {getConfidenceText(reflection!.confidence)}
            </Div>
            <Div className={cn('w-2 h-2 rounded-full', getConfidenceColor(reflection!.confidence).replace('text-', 'bg-'))} />
          </Div>
        </Div>
      </CardHeader>
      
      <CardContent className="space-y-6" />
        {/* Summary Section */}
        <Div className="space-y-2">
          <Div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-blue-400" />
            <H4 className="text-sm font-medium text-blue-400">Summary</CardContent>
          </Div>
          <P className="text-gray-300 leading-relaxed">
            {reflection!.summary}
          </P>
        </Div>

        {/* Behavior Tags Section */}
        {reflection!.tags && reflection!.tags.length > 0 && (
          <Div className="space-y-3">
            <Div className="flex items-center space-x-2">
              <Div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              <H4 className="text-sm font-medium text-purple-400">Behavioral Patterns</Div>
            </Div>
            <behaviorTagGroup 
              tags={reflection!.tags} 
              animated={true}
              className="ai-reflection-tags"
            />
          </Div>
        )}

        {/* Suggestion Section */}
        <Div className="space-y-2">
          <Div className="flex items-center space-x-2 mb-2">
            <lightbulb className="h-4 w-4 text-yellow-400" />
            <H4 className="text-sm font-medium text-yellow-400">Improvement Suggestion</Div>
          </Div>
          <P className="text-gray-300 leading-relaxed bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            {reflection!.suggestion}
          </P>
        </Div>

        {/* Regenerate Button */}
        <Div className="pt-2 border-t border-gray-700/50">
          <Button onClick={generateReflection}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            disabled={loading}
       >
            <brain className="h-3 w-3 mr-2" />
            Regenerate Analysis
          </Div>
        </Div>
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