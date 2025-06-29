// TODO: implement AI coaching with behavior analysis
import React from 'react';

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
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <span style={{fontSize: '16px'}}>🧠</span>
        <h2 style={{ fontWeight: "700" }}>AI Coach</h2>
      </div>

      {!analysis ? (
        <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
          <p style={{ marginBottom: "16px" }}>
            Get personalized coaching based on your trading behavior
          </p>
          <Button onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze My Trading'}
          </Button>
        </div>
      ) : (
        <div >
          <div>
            <h3 style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>📈</span>
              Strengths
            </h3>
            <div >
              {analysis.strengths.map((strength: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <Badge variant="default" >
                    ✓
                  </Badge>
                  <span >{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>⚠️</span>
              Areas to Improve
            </h3>
            <div >
              {analysis.weaknesses.map((weakness: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <Badge variant="default" >
                    !
                  </Badge>
                  <span >{weakness}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>🎯</span>
              Action Items
            </h3>
            <div >
              {analysis.suggestions.map((suggestion: string, i: number) => (
                <div key={i} >
                  <p >{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" style={{ width: "100%" }}>
            Schedule Coaching Session
          </Button>
        </div>
      )}
    </Card>
  );
}; 