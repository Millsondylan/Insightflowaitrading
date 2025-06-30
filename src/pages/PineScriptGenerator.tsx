
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code2, Copy, Share2, Download } from 'lucide-react';

export default function PineScriptGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // In a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedCode(`//@version=5
study("Custom Strategy", overlay=true)

// Input parameters
fastLength = input(9, "Fast Length")
slowLength = input(21, "Slow Length")
rsiLength = input(14, "RSI Length")

// Calculate indicators
fastMA = ta.ema(close, fastLength)
slowMA = ta.ema(close, slowLength)
rsi = ta.rsi(close, rsiLength)

// Generate signals
longCondition = ta.crossover(fastMA, slowMA) and rsi < 70
shortCondition = ta.crossunder(fastMA, slowMA) and rsi > 30

// Plot signals
plotshape(longCondition, "Buy Signal", shape.triangleup, location.belowbar, color.green)
plotshape(shortCondition, "Sell Signal", shape.triangledown, location.abovebar, color.red)

// Plot moving averages
plot(fastMA, "Fast MA", color.blue)
plot(slowMA, "Slow MA", color.red)`);
    } catch (error) {
      console.error('Error generating PineScript:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">PineScript Generator</h1>
          <p className="text-gray-400">Generate TradingView indicators and strategies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-400"/>
              <CardTitle>Strategy Description</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your trading strategy in natural language..."
              className="min-h-[200px] mb-4"
            />
            <Button onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? 'Generating...' : 'Generate PineScript'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-purple-400"/>
                <CardTitle>Generated Code</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!generatedCode}
                >
                  <Copy className="h-4 w-4"/>
                </Button>
                <Button variant="outline"
                  size="icon"
                  disabled={!generatedCode}
                >
                  <Share2 className="h-4 w-4"/>
                </Button>
                <Button variant="outline"
                  size="icon"
                  disabled={!generatedCode}
                >
                  <Download className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-300">{generatedCode}</code>
              </pre>
            ) : (
              <div className="text-center py-16 text-gray-400">
                Generated code will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
