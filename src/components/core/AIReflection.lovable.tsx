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

const AIReflection: React.FC<Aireflectionprops> = ({ 
  entry, 
  className, 
  autoGenerate = false 
}) => {
  const { toast } = useToast();
  const [reflection, setReflection] = useState<aireflectiontype  />(null);
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
      <Card >
        <Cardheader  />
          <div className="flex items-center space-x-2">
            <brain  >
            <cardtitle  style={{ fontSize: "1.125rem" }}>AI Analysis</CardTitle>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </CardHeader>
        <cardcontent  >
          <div className="space-y-2">
            <skeleton  style={{ width: "100%" }}>
            <skeleton  >
            <skeleton  >
          </div>
          <div className="space-y-2">
            <skeleton  >
            <div className="flex gap-2">
              <skeleton  >
              <skeleton  >
            </div>
          </div>
          <div className="space-y-2">
            <skeleton  style={{ width: "100%" }}>
            <skeleton  >
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !reflection) {
    return (
      <card  >
        <cardheader  >
          <div className="flex items-center space-x-2">
            <brain  >
            <cardtitle  style={{ fontSize: "1.125rem" }}>AI Analysis</CardTitle>
          </div>
        </CardHeader>
        <cardcontent  >
          <div className="text-red-400 text-sm">
            {error}
          </div>
          <Button variant="outline" size="sm" >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not generated state
  if (!reflection && !hasGenerated) {
    return (
      <card  >
        <cardheader  >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <brain  >
              <cardtitle  style={{ fontSize: "1.125rem" }}>AI Analysis</CardTitle>
            </div>
            <sparkles  >
          </div>
        </CardHeader>
        <cardcontent  >
          <p className="text-gray-400 text-sm">
            Get AI-powered insights on your trading psychology and decision-making patterns.
          </p>
          <Button  style={{ width: "100%" }}>
            <brain  >
            Analyze Trade
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Generated state
  return (
    <card  >
      <cardheader  >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <brain  >
            <cardtitle  style={{ fontSize: "1.125rem" }}>AI Analysis</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn('text-xs font-medium', getConfidenceColor(reflection!.confidence))}>
              {getConfidenceText(reflection!.confidence)}
            </span>
            <div className={cn('w-2 h-2 rounded-full', getConfidenceColor(reflection!.confidence).replace('text-', 'bg-'))} />
          </div>
        </div>
      </CardHeader>
      
      <cardcontent  >
        {/* Summary Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <target  >
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
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              <h4 className="text-sm font-medium text-purple-400">Behavioral Patterns</h4>
            </div>
            <behaviortaggroup  >
          </div>
        )}

        {/* Suggestion Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <lightbulb  >
            <h4 className="text-sm font-medium text-yellow-400">Improvement Suggestion</h4>
          </div>
          <p className="text-gray-300 leading-relaxed bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            {reflection!.suggestion}
          </p>
        </div>

        {/* Regenerate Button */}
        <div className="pt-2 border-t border-gray-700/50">
          <Button variant="ghost" size="sm" >
            <brain  >
            Regenerate Analysis
          </Button>
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
