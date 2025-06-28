import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { generateReflection } from './generateReflection';
import { Trade, TradeReflection } from './types';

interface ReflectionGeneratorProps {
  trade: Trade;
  onReflectionGenerated: (reflection: TradeReflection) => void;
}

export const ReflectionGenerator: React.FC<ReflectionGeneratorProps> = ({
  trade,
  onReflectionGenerated
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [reflection, setReflection] = useState<TradeReflection | null>(null);

  const handleGenerateReflection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateReflection(trade, notes);
      setReflection(result);
      onReflectionGenerated(result);
      toast({
        title: 'Reflection Generated',
        description: 'Your trade reflection has been generated successfully.',
        variant: 'default'
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Generation Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Trade Reflection</h2>
        <p className="text-sm text-muted-foreground">
          Analyze your trade and generate insights to improve your trading strategy.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional context or thoughts about this trade..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleGenerateReflection}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Generating Reflection...</span>
            </div>
          ) : (
            'Generate Reflection'
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {reflection && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Trade Summary</h3>
              <p className="text-sm">{reflection.analysis.summary}</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Execution Score</h3>
                <p className="text-2xl font-bold mt-1">{reflection.analysis.metrics.executionScore}/10</p>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Risk Management</h3>
                <p className="text-2xl font-bold mt-1">{reflection.analysis.metrics.riskManagementScore}/10</p>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Strategy Adherence</h3>
                <p className="text-2xl font-bold mt-1">{reflection.analysis.metrics.strategyAdherenceScore}/10</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="psychology" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Psychological Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Emotional State</h4>
                  <p className="text-sm mt-1">{reflection.analysis.psychology.emotionalState}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Behavioral Patterns</h4>
                  <p className="text-sm mt-1">{reflection.analysis.psychology.behavioralPatterns}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Decision Making</h4>
                  <p className="text-sm mt-1">{reflection.analysis.psychology.decisionMaking}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="improvements" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Areas for Improvement</h3>
              <ul className="space-y-2">
                {reflection.analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Action Items</h3>
              <ul className="space-y-2">
                {reflection.analysis.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
}; 