
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Code2, Copy, Share2, Download, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PineScriptFormData {
  scriptType: 'strategy' | 'indicator' | 'library';
  timeframe: string;
  prompt: string;
  additionalContext: string;
}

export default function PineScriptGenerator() {
  const { user } = useAuth();
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState({ used: 0, limit: 10, remaining: 10 });

  const form = useForm<PineScriptFormData>({
    defaultValues: {
      scriptType: 'strategy',
      timeframe: '1D',
      prompt: '',
      additionalContext: ''
    }
  });

  const handleGenerate = async (data: PineScriptFormData) => {
    if (!data.prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedCode(`//@version=5
strategy("${data.scriptType.charAt(0).toUpperCase() + data.scriptType.slice(1)} - ${data.timeframe}", overlay=true)

// Input parameters
fastLength = input.int(9, "Fast MA Length", minval=1)
slowLength = input.int(21, "Slow MA Length", minval=1)
rsiLength = input.int(14, "RSI Length", minval=1)

// Calculate indicators
fastMA = ta.ema(close, fastLength)
slowMA = ta.ema(close, slowLength)
rsi = ta.rsi(close, rsiLength)

// Generate signals based on: ${data.prompt}
longCondition = ta.crossover(fastMA, slowMA) and rsi < 70
shortCondition = ta.crossunder(fastMA, slowMA) and rsi > 30

// Execute trades
if longCondition
    strategy.entry("Long", strategy.long)
if shortCondition
    strategy.entry("Short", strategy.short)

// Plot indicators
plot(fastMA, "Fast MA", color=color.blue)
plot(slowMA, "Slow MA", color=color.red)

// Plot signals
plotshape(longCondition, "Buy Signal", shape.triangleup, location.belowbar, color=color.green, size=size.small)
plotshape(shortCondition, "Sell Signal", shape.triangledown, location.abovebar, color=color.red, size=size.small)`);

      setQuota(prev => ({ ...prev, used: prev.used + 1, remaining: prev.remaining - 1 }));
    } catch (err) {
      setError('Failed to generate PineScript. Please try again.');
      console.error('PineScript generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share functionality not implemented yet');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategy.pine';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">PineScript Generator</h1>
          <p className="text-gray-400">Generate TradingView indicators and strategies with AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            {quota.remaining}/{quota.limit} remaining
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-400"/>
              <CardTitle className="text-white">Strategy Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {quota.remaining <= 0 ? (
              <Alert className="mb-4 border-yellow-500/20 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-500"/>
                <AlertTitle className="text-yellow-500">Quota Exceeded</AlertTitle>
                <AlertDescription className="text-yellow-400">
                  You've reached your monthly PineScript generation limit. Upgrade to Pro for unlimited access.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mb-4 border-blue-500/20 bg-blue-500/10">
                <AlertCircle className="h-4 w-4 text-blue-500"/>
                <AlertTitle className="text-blue-500">Ready to Generate</AlertTitle>
                <AlertDescription className="text-blue-400">
                  Describe your trading strategy in natural language and we'll convert it to PineScript.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scriptType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Script Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10 text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="strategy">Strategy</SelectItem>
                            <SelectItem value="indicator">Indicator</SelectItem>
                            <SelectItem value="library">Library</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Default Timeframe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10 text-white">
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1m">1 Minute</SelectItem>
                            <SelectItem value="5m">5 Minutes</SelectItem>
                            <SelectItem value="15m">15 Minutes</SelectItem>
                            <SelectItem value="1H">1 Hour</SelectItem>
                            <SelectItem value="4H">4 Hours</SelectItem>
                            <SelectItem value="1D">1 Day</SelectItem>
                            <SelectItem value="1W">1 Week</SelectItem>
                            <SelectItem value="1M">1 Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Strategy Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your trading strategy in natural language..."
                          className="min-h-[120px] bg-black/20 border-white/10 text-white resize-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional requirements or preferences..."
                          className="min-h-[80px] bg-black/20 border-white/10 text-white resize-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={isGenerating || !form.watch('prompt').trim() || quota.remaining <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate PineScript'
                  )}
                </Button>

                {error && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500"/>
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Generated Code */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-purple-400"/>
                <CardTitle className="text-white">Generated Code</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopy}
                  disabled={!generatedCode}
                  className="border-white/10 hover:bg-white/10"
                >
                  <Copy className="h-4 w-4"/>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleShare}
                  disabled={!generatedCode}
                  className="border-white/10 hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4"/>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleDownload}
                  disabled={!generatedCode}
                  className="border-white/10 hover:bg-white/10"
                >
                  <Download className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="space-y-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Generated Successfully
                </Badge>
                <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto border border-white/10">
                  <code className="text-sm text-gray-300">{generatedCode}</code>
                </pre>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                <p>Generated PineScript code will appear here</p>
                <p className="text-sm mt-2">Fill out the form and click generate to start</p>
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
