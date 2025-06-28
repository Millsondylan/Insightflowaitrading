// TODO: implement AI coaching with behavior analysis
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface AICoachV2Props {
  userId?: string;
}

export const AICoachV2: React.FC<AICoachV2Props> = ({ userId }) => {
  const [analysis, setAnalysis] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // TODO: Connect to behavior-tagger-v2 AI block
    setTimeout(() => {
      setAnalysis({
        strengths: ['Good risk management', 'Consistent entry timing'],
        weaknesses: ['Holding losers too long', 'FOMO on breakouts'],
        patterns: ['Overtrading on Mondays', 'Best performance 10-11 AM'],
        suggestions: ['Set max daily trades to 3', 'Use trailing stops']
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <Card className="theme-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6" />
        <h2 className="text-2xl font-bold">AI Coach</h2>
      </div>

      {!analysis ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Get personalized coaching based on your trading behavior
          </p>
          <Button onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze My Trading'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Strengths
            </h3>
            <div className="space-y-2">
              {analysis.strengths.map((strength: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500/20 text-green-500">
                    ✓
                  </Badge>
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Areas to Improve
            </h3>
            <div className="space-y-2">
              {analysis.weaknesses.map((weakness: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge variant="default" className="bg-yellow-500/20 text-yellow-500">
                    !
                  </Badge>
                  <span className="text-sm">{weakness}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Action Items
            </h3>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="p-3 bg-secondary/20 rounded-lg">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Schedule Coaching Session
          </Button>
        </div>
      )}
    </Card>
  );
}; 