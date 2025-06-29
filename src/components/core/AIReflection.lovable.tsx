import React, { useState, useEffect } from 'react';
import { JournalEntry } from '@/lib/journal/schema';
import { AIReflection as AIReflectionType } from '@/lib/journal/promptBuilder';
import { requestReflection } from '@/api/journal/reflect';
import { cn } from '@/lib/utils';

interface AIReflectionProps {
  entry: JournalEntry;
  className?: string;
  autoGenerate?: boolean;
}

const AIReflection: React.FC<AIReflectionProps> = ({ 
  entry, 
  className, 
  autoGenerate = false 
}) => {
  const { toast } = useToast();
  const [reflection, setReflection] = useState<AIReflectionType | null>(null);
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
      <Card className={cn('ai-reflection-card border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10', className)}>
        <CardHeader >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>🧠</span>
            <CardTitle >AI Analysis</CardTitle>
            <div style={{ display: "flex" }}>
              <div  />
              <div  style={{ animationDelay: '0.2s' }} />
              <div  style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </CardHeader>
        <CardContent >
          <div >
            <Skeleton style={{ width: "100%" }} />
            <Skeleton  />
            <Skeleton  />
          </div>
          <div >
            <Skeleton  />
            <div style={{ display: "flex" }}>
              <Skeleton  />
              <Skeleton  />
            </div>
          </div>
          <div >
            <Skeleton style={{ width: "100%" }} />
            <Skeleton  />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !reflection) {
    return (
      <Card className={cn('ai-reflection-card border-red-500/30 bg-gradient-to-br from-red-900/10 to-orange-900/10', className)}>
        <CardHeader >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>🧠</span>
            <CardTitle >AI Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent >
          <div >
            {error}
          </div>
          <Button 
            onClick={generateReflection}
            variant="outline"
            size="sm"
            
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
      <Card className={cn('ai-reflection-card border-gray-500/30 bg-gradient-to-br from-gray-900/10 to-slate-900/10', className)}>
        <CardHeader >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>🧠</span>
              <CardTitle >AI Analysis</CardTitle>
            </div>
            <Sparkles style={{ color: "#9CA3AF" }} />
          </div>
        </CardHeader>
        <CardContent >
          <p style={{ color: "#9CA3AF" }}>
            Get AI-powered insights on your trading psychology and decision-making patterns.
          </p>
          <Button 
            onClick={generateReflection}
            style={{ width: "100%" }}
            disabled={loading}
          >
            <span style={{fontSize: '16px'}}>🧠</span>
            Analyze Trade
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Generated state
  return (
    <Card className={cn('ai-reflection-card border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10 animate-fade-in-up', className)}>
      <CardHeader >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>🧠</span>
            <CardTitle >AI Analysis</CardTitle>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className={cn('text-xs font-medium', getConfidenceColor(reflection!.confidence))}>
              {getConfidenceText(reflection!.confidence)}
            </span>
            <div className={cn('w-2 h-2 rounded-full', getConfidenceColor(reflection!.confidence).replace('text-', 'bg-'))} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent >
        {/* Summary Section */}
        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>🎯</span>
            <h4 >Summary</h4>
          </div>
          <p >
            {reflection!.summary}
          </p>
        </div>

        {/* Behavior Tags Section */}
        {reflection!.tags && reflection!.tags.length > 0 && (
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div  />
              <h4 >Behavioral Patterns</h4>
            </div>
            <BehaviorTagGroup 
              tags={reflection!.tags} 
              animated={true}
              
            />
          </div>
        )}

        {/* Suggestion Section */}
        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>💡</span>
            <h4 >Improvement Suggestion</h4>
          </div>
          <p style={{ border: "1px solid #374151" }}>
            {reflection!.suggestion}
          </p>
        </div>

        {/* Regenerate Button */}
        <div >
          <Button 
            onClick={generateReflection}
            variant="ghost"
            size="sm"
            style={{ color: "#9CA3AF" }}
            disabled={loading}
          >
            <span style={{fontSize: '16px'}}>🧠</span>
            Regenerate Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIReflection; 