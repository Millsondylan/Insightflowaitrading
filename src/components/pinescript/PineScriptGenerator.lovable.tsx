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

// Define the form validation schema
const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  scriptType: z.enum(['strategy', 'indicator', 'library']),
  timeframe: z.string().optional(),
  additionalContext: z.string().optional()
});

export default function PineScriptGenerator() {
  // LOVABLE:AI_BLOCK id="pinescript_generator" type="react_component"
  // description: "Pine Script generator that creates TradingView-compatible code from natural language prompts, with quota management and subscription features"
  // requires: ["user authentication", "Pine Script generation", "quota management"]
  // provides: ["TradingView-compatible code", "syntax validation", "sharable scripts"]
  // related_components: ["ProUnlocker", "StrategyVault"]
  // prompt: "Generate a professional Pine Script code generator that accepts natural language prompts and produces high-quality, validated TradingView Pine Script code. Include quota management for free users (1 script/month) with upgrade path to unlimited usage. Add features like script type selection (strategy/indicator/library), timeframe selection, copy to clipboard, and basic syntax validation."
  
  const { user } = useAuth();
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
  
  // Fetch quota info when component mounts
  useEffect(() => {
    if (user?.id) {
      loadQuotaInfo();
    }
  }, [user]);

  const loadQuotaInfo = async () => {
    try {
      // LOVABLE:FUNCTION id="checkUserQuota" endpoint="/api/pinescript/quota"
      // description: "Checks user's remaining quota for Pine Script generation"
      // input: "{ userId: string }"
      // output: "{ used: number, limit: number, remaining: number, isLimited: boolean, resetDate?: string }"
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
      // LOVABLE:FUNCTION id="generatePineScript" endpoint="/api/pinescript/generate"
      // description: "Generates Pine Script code from a natural language prompt"
      // input: "{ prompt: string, userId: string, scriptType: string, timeframe?: string, additionalContext?: string }"
      // output: "{ id: string, code: string, requestId: string, syntaxValid: boolean, hasErrors: boolean, errorDetails?: object }"
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
    // LOVABLE:FUNCTION id="upgradeUser" endpoint="/api/subscription/upgrade"
    // description: "Initiates the user upgrade flow to Pro subscription"
    // input: "{ userId: string, source: string }"
    // output: "{ success: boolean, redirectUrl?: string }"
    window.location.href = '/subscription';
  };

  const handleShare = () => {
    // LOVABLE:FUNCTION id="sharePineScript" endpoint="/api/pinescript/share"
    // description: "Creates a shareable link for a Pine Script"
    // input: "{ pineScriptId: string, userId: string, isPublic?: boolean, expiresInDays?: number }"
    // output: "{ success: boolean, shareUrl: string, shareToken: string }"
    alert('Share functionality will be implemented soon!');
  };

  return (
    <Div className="w-full max-w-5xl mx-auto">
      <Card className="shadow-md border-border" />
        <CardHeader>
          <CardTitle className="text-2xl" />Pine Script AI Generator</Div>
          <CardDescription>
            Generate TradingView Pine Script code from natural language prompts
          </CardDescription>
          
          {/* Quota display */}
          {quota && (
            <Div className="flex items-center justify-between mt-2">
              <Div className="flex flex-col space-y-1">
                <Span className="text-sm text-muted-foreground">
                  {quota.isLimited ? (
                    <>
                      {quota.remaining}/{quota.limit} generations remaining this month
                      <Badge variant={quota.remaining /> 0 ? "outline" : "destructive"} className="ml-2">
                        {quota.remaining > 0 ? "Free Tier" : "Limit Reached"}
                      </Div>
                    </>
                  ) : (
                    <>
                      Unlimited generations
                      <Badge variant="secondary" className="ml-2">Pro</Badge>
                    </>
                  )}
                </Span>
                {quota.isLimited && quota.resetDate && (
                  <Span className="text-xs text-muted-foreground">
                    Resets on {quota.resetDate.toLocaleDateString()}
                  </Span>
                )}
              </Div>
              
              {quota.isLimited && (
                <Button variant="outline" 
                  size="sm"
                  onClick={handleUpgradeClick}
                />
                  Upgrade to Pro
                </Button>
              )}
            </Div>
          )}
        </CardHeader>
        
        <CardContent>
          {error && (
            <alert variant="destructive" className="mb-4">
              <alertCircle className="h-4 w-4" />
              <alertTitle>Error</CardContent>
              <alertDescription>{error}</AlertDescription />
          )}
          
          {showUpgradePrompt && (
            <alert className="mb-4 bg-muted">
              <info className="h-4 w-4" />
              <alertTitle>Upgrade to Pro</AlertTitle>
              <alertDescription>
                You've reached your monthly Pine Script generation limit. 
                Upgrade to Pro for unlimited generations.
              </AlertDescription>
              <Button className="mt-2" 
                variant="default" 
                size="sm"
                onClick={handleUpgradeClick}
  >
                Upgrade Now
              </button />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" />
            <TabsList className="grid w-full grid-cols-2" />
              <TabsTrigger value="prompt" />Prompt</Button>
              <TabsTrigger value="code" disabled={!generatedCode} />Generated Code</TabsTrigger />
            
            <TabsContent value="prompt" />
              <Form {...form}>
                <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <formField
                      control={form.control}
                      name="scriptType"
                      render={({ field }) => (
                        <formItem>
                          <formLabel>Script Type</TabsTrigger>
                          <Select onValueChange={field.onChange} 
                            defaultValue={field.value}
               >
                            <formControl>
                              <selectTrigger>
                                <selectValue placeholder="Select script type" / />
                            </Select>
                            <selectContent>
                              <selectItem value="indicator">Indicator</SelectItem>
                              <selectItem value="strategy">Trading Strategy</SelectItem>
                              <selectItem value="library">Library</SelectItem />
                          </Select>
                          <formMessage / />
                      )}
                    />
                    
                    <formField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <formItem>
                          <formLabel>Default Timeframe</FormLabel>
                          <Select onValueChange={field.onChange} 
                            defaultValue={field.value}
               >
                            <formControl>
                              <selectTrigger>
                                <selectValue placeholder="Select timeframe" / />
                            </Select>
                            <selectContent>
                              <selectItem value="1m">1 Minute</SelectItem>
                              <selectItem value="5m">5 Minutes</SelectItem>
                              <selectItem value="15m">15 Minutes</SelectItem>
                              <selectItem value="30m">30 Minutes</SelectItem>
                              <selectItem value="1h">1 Hour</SelectItem>
                              <selectItem value="4h">4 Hours</SelectItem>
                              <selectItem value="1D">1 Day</SelectItem>
                              <selectItem value="1W">1 Week</SelectItem>
                              <selectItem value="1M">1 Month</SelectItem />
                          </Select>
                          <formMessage / />
                      )}
                    />
                  </Div>

                  <formField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <formItem>
                        <formLabel>Describe what you want to create</FormLabel>
                        <formControl>
                          <Textarea 
                            placeholder="E.g., Create an RSI indicator with overbought/oversold levels at 70/30 and signal line crossovers" 
                            className="h-32"
                            {...field} 
                          / />
                        <formMessage / />
                    )}
                  />
                  
                  <formField
                    control={form.control}
                    name="additionalContext"
                    render={({ field }) => (
                      <formItem>
                        <formLabel>Additional Context (Optional)</Textarea>
                        <formControl>
                          <Textarea 
                            placeholder="Any additional details or specific requirements" 
                            className="h-24"
                            {...field} 
                          / />
                        <formMessage / />
                    )}
                  />

                  <Button type="submit" 
                    className="w-full"
                    disabled={isGenerating || (quota?.isLimited && quota.remaining <= 0)}
      >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : "Generate Pine Script"}
                  </button />
              </Form />
            
            <TabsContent value="code" />
              {generatedCode && (
                <>
                  <Div className="flex justify-between items-center mb-2">
                    <Div className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      <H3 className="font-medium">Generated Pine Script</Textarea>
                    </Div>
                    <Div className="flex space-x-2">
                      <Button variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={handleCopy}
          >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <Span>{copied ? "Copied!" : "Copy"}</Div>
                      </Button>
                      <Button variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={handleShare}
          >
                        <Share2 className="h-4 w-4" />
                        <Span>Share</Button>
                      </Button>
                    </Div>
                  </Div>
                  
                  {syntaxValid === false && (
                    <alert className="mb-3">
                      <alertCircle className="h-4 w-4" />
                      <alertTitle>Syntax Warning</AlertTitle>
                      <alertDescription>
                        The generated code might have syntax issues. {errorDetails && (
                          <Span>
                            Line {errorDetails.line}: {errorDetails.message}
                            {errorDetails.suggestion && (
                              <Div className="mt-1 text-xs">
                                Suggestion: {errorDetails.suggestion}
                              </Span>
                            )}
                          </Span>
                        )}
                      </AlertDescription />
                  )}
                  
                  <Div className="relative">
                    <Pre className="bg-muted p-4 rounded-md overflow-x-auto max-h-96 text-sm whitespace-pre">
                      <Code>{generatedCode}</div />
                    
                    <Div className="absolute top-4 right-4">
                      {syntaxValid === true && (
                        <Badge className="mb-1 bg-green-500 text-white">Syntax Valid</Div>
                      )}
                    </Div>
                  </Div>
                  
                  <Div className="mt-4">
                    <H4 className="text-sm font-medium mb-2">How to use in TradingView:</Div>
                    <Ol className="list-decimal list-inside text-sm text-muted-foreground ml-2 space-y-1">
                      <Li>Copy the code above</Ol>
                      <Li>Open TradingView and go to Pine Editor</Li>
                      <Li>Paste the code into the editor</Li>
                      <Li>Click "Add to Chart" to use your script</Li />
                  </Li>
                </>
              )}
            </TabsContent />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 items-start border-t pt-4" />
          <P className="text-xs text-muted-foreground">
            Note: Generated code is provided as-is. Always review and test before using in live trading.
          </CardFooter>
          {quota?.isLimited && (
            <Div className="w-full">
              <Div className="flex justify-between text-xs mb-1">
                <Span>Monthly quota</Div>
                <Span>{quota.used}/{quota.limit} used</Span>
              </Div>
              <progress value={(quota.used / quota.limit) * 100} 
                className={quota.remaining> 0 ? "bg-primary h-2" : "bg-destructive h-2"}
              />
            </Div>
          )}
        </CardFooter />
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true,
  functions: [
    'checkPineScriptQuota', 
    'generatePineScript', 
    'sharePineScript'
  ]
}; 