import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Code, Share2, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { generatePineScript, checkPineScriptQuota, PineScriptQuotaInfo } from '@/lib/pinescript/generator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { usePromptHints } from '@/hooks/use-prompt-hints';
import { captureAudit } from '@/lib/monitoring/auditWebhook';

// Define the form validation schema
const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  scriptType: z.enum(['strategy', 'indicator', 'library']),
  timeframe: z.string().optional(),
  additionalContext: z.string().optional()
});

export default function PineScriptGenerator() {
  const { user } = useAuth();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('prompt');
  const [quota, setQuota] = useState<pineScriptQuotaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [syntaxValid, setSyntaxValid] = useState<boolean | null>(null);
  const [errorDetails, setErrorDetails] = useState<any | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      scriptType: 'indicator',
      timeframe: '1D',
      additionalContext: ''
    }
  });
  
  // Prompt hints
  const promptValue = form.watch('prompt');
  const hints = usePromptHints(promptValue);

  // Fetch quota info when component mounts
  useEffect(() => {
    if (user?.id) {
      loadQuotaInfo();
    }
  }, [user]);

  const loadQuotaInfo = async () => {
    try {
      const quotaInfo = await checkPineScriptQuota(user!.id);
      setQuota(quotaInfo);
      
      if (quotaInfo.isLimited && quotaInfo.remaining <= 0) {
        setShowUpgradePrompt(true);
      }
    } catch (err) {
      console.error('Error fetching quota:', err);
      setError('Failed to check your Pine Script quota. Please try again.');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      setError('You must be logged in to generate Pine Scripts.');
      return;
    }

    if (quota?.isLimited && quota.remaining <= 0) {
      setShowUpgradePrompt(true);
      setError('You have reached your monthly limit for Pine Script generation.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedCode(null);
    setSyntaxValid(null);
    setErrorDetails(null);
    
    try {
      await captureAudit('pineScriptGenerator', 'info', 'generate_request', { prompt: values.prompt });
      const result = await generatePineScript({
        prompt: values.prompt,
        userId: user.id,
        scriptType: values.scriptType,
        timeframe: values.timeframe,
        additionalContext: values.additionalContext
      });
      
      setGeneratedCode(result.code);
      setSyntaxValid(result.syntaxValid);
      setErrorDetails(result.errorDetails);
      setActiveTab('code');
      
      // Refresh quota info
      await loadQuotaInfo();
      await captureAudit('pineScriptGenerator', 'info', 'generate_response', { code_length: result.code.length });
    } catch (err: any) {
      console.error('Error generating Pine Script:', err);
      setError(err.message || 'Failed to generate Pine Script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpgradeClick = () => {
    // Redirect to subscription page
    window.location.href = '/subscription';
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="shadow-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Pine Script AI Generator</CardTitle>
          <CardDescription>
            Generate TradingView Pine Script code from natural language prompts
          </CardDescription>
          
          {/* Quota display */}
          {quota && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">
                  {quota.isLimited ? (
                    <>
                      {quota.remaining}/{quota.limit} generations remaining this month
                      <Badge variant={quota.remaining> 0 ? "outline" : "destructive"} className="ml-2">
                        {quota.remaining > 0 ? "Free Tier" : "Limit Reached"}
                      </Badge>
                    </>
                  ) : (
                    <>
                      Unlimited generations
                      <badge variant="secondary" className="ml-2">Pro</Badge>
                    </>
                  )}
                </span>
                {quota.isLimited && quota.resetDate && (
                  <span className="text-xs text-muted-foreground">
                    Resets on {quota.resetDate.toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {quota.isLimited && (
                <Button variant="outline" 
                  size="sm"
                  onClick={handleUpgradeClick}
                />
                  Upgrade to Pro
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {error && (
            <alert variant="destructive" className="mb-4">
              <alertCircle className="h-4 w-4" />
              <alertTitle>Error</AlertTitle>
              <alertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {showUpgradePrompt && (
            <alert className="mb-4 bg-muted">
              <info className="h-4 w-4" />
              <alertTitle>Upgrade to Pro</AlertTitle>
              <alertDescription>
                You've reached your monthly Pine Script generation limit. 
                Upgrade to Pro for unlimited generations.
              </AlertDescription>
              <Button  className="mt-2" 
                variant="default" 
                size="sm"
                onClick={handleUpgradeClick}
              >
                Upgrade Now
              </Button>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="code" disabled={!generatedCode}>Generated Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt">
              <form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <formField
                      control={form.control}
                      name="scriptType"
                      render={({ field }) => (
                        <formItem>
                          <formLabel>Script Type</FormLabel>
                          <select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <formControl>
                              <selectTrigger>
                                <selectValue placeholder="Select script type" />
                              </SelectTrigger>
                            </FormControl>
                            <selectContent>
                              <selectItem value="indicator">Indicator</SelectItem>
                              <selectItem value="strategy">Trading Strategy</SelectItem>
                              <selectItem value="library">Library</SelectItem>
                            </SelectContent>
                          </select>
                          <formMessage />
                        </FormItem>
                      )}
                    />
                    
                    <formField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <formItem>
                          <formLabel>Default Timeframe</FormLabel>
                          <select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <formControl>
                              <selectTrigger>
                                <selectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <selectContent>
                              <selectItem value="1m">1 Minute</SelectItem>
                              <selectItem value="5m">5 Minutes</SelectItem>
                              <selectItem value="15m">15 Minutes</SelectItem>
                              <selectItem value="30m">30 Minutes</SelectItem>
                              <selectItem value="1h">1 Hour</SelectItem>
                              <selectItem value="4h">4 Hours</SelectItem>
                              <selectItem value="1D">1 Day</SelectItem>
                              <selectItem value="1W">1 Week</SelectItem>
                              <selectItem value="1M">1 Month</SelectItem>
                            </SelectContent>
                          </select>
                          <formMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <formField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <formItem>
                        <formLabel>Describe what you want to create</FormLabel>
                        <formControl>
                          <textarea 
                            placeholder="E.g., Create an RSI indicator with overbought/oversold levels at 70/30 and signal line crossovers" 
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <formMessage />
                        {hints.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {hints.map((h) => (
                              <Button key={h} variant="secondary" size="sm" type="button" onClick={() => form.setValue('prompt', field.value + ' ' + h)}>
                                {h}
                              </Button>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <formField
                    control={form.control}
                    name="additionalContext"
                    render={({ field }) => (
                      <formItem>
                        <formLabel>Additional Context (Optional)</FormLabel>
                        <formControl>
                          <textarea 
                            placeholder="Any additional details or specific requirements" 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <formMessage />
                      </FormItem>
                    )}
                  />

                  <Button  type="submit" 
                    className="w-full"
                    disabled={isGenerating || (quota?.isLimited && quota.remaining <= 0)}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : "Generate Pine Script"}
                  </Button>
                </form>
              </form>
            </TabsContent>
            
            <TabsContent value="code">
              {generatedCode && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <code className="h-4 w-4 mr-2" />
                      <h3 className="font-medium">Generated Pine Script</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={handleCopy}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </Button>
                      <Button variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={() => {
                          if (!generatedCode) return;
                          const encoded = encodeURIComponent(btoa(generatedCode));
                          window.open(`${process.env.TRADINGVIEW_SCRIPT_DEEPLINK || 'https://www.tradingview.com/chart/'}?script=${encoded}`, '_blank');
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Open in TradingView</span>
                      </Button>
                    </div>
                  </div>
                  
                  {syntaxValid === false && (
                    <alert variant="destructive" className="mb-3">
                      <alertCircle className="h-4 w-4" />
                      <alertTitle>Syntax Warning</AlertTitle>
                      <alertDescription>
                        The generated code might have syntax issues. {errorDetails && (
                          <span>
                            Line {errorDetails.line}: {errorDetails.message}
                            {errorDetails.suggestion && (
                              <div className="mt-1 text-xs">
                                Suggestion: {errorDetails.suggestion}
                              </div>
                            )}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto max-h-96 text-sm whitespace-pre">
                      <code>{generatedCode}</code>
                    </pre>
                    
                    <div className="absolute top-4 right-4">
                      {syntaxValid === true && (
                        <badge variant="secondary" className="mb-1">Syntax Valid</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">How to use in TradingView:</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground ml-2 space-y-1">
                      <li>Copy the code above</li>
                      <li>Open TradingView and go to Pine Editor</li>
                      <li>Paste the code into the editor</li>
                      <li>Click "Add to Chart" to use your script</li>
                    </ol>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 items-start border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Note: Generated code is provided as-is. Always review and test before using in live trading.
          </p>
          {quota?.isLimited && (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Monthly quota</span>
                <span>{quota.used}/{quota.limit} used</span>
              </div>
              <progress value={(quota.used / quota.limit) * 100} className="h-2" />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 