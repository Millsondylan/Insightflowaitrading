import { useEffect } from 'react';
import PineScriptGenerator from '@/components/pinescript/PineScriptGenerator';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

// LOVABLE:AI_BLOCK id="pinescript_generator_page" type="page"
export default function PineScriptGeneratorPage() {
  // LOVABLE:AI_BLOCK id="pinescript_generator_page" type="page"
  // description: "A page that hosts the Pine Script generator component with educational content"
  // requires: ["authentication", "PineScriptGenerator component", "navigation"]
  // provides: ["Pine Script generation interface", "educational materials about Pine Script"]
  // related_pages: ["StrategyBuilder", "ProSubscription"]
  // prompt: "Create a user-friendly page that hosts the Pine Script generator component. Include helpful information about what Pine Script is, how to use the generator, example prompts, and information about the benefits of upgrading to the Pro tier. Ensure the page requires authentication and redirects non-authenticated users to the login page."
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { redirect: '/pine-script-generator' } });
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pine Script Generator</h1>
      <PineScriptGenerator />
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">About Pine Script Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-3">What is Pine Script?</h3>
            <p className="text-muted-foreground">
              Pine Script is TradingView's proprietary programming language that allows you to create 
              custom indicators and trading strategies. It's designed specifically for chart analysis 
              and trading automation.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-3">How to Use It</h3>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-2">
              <li>Describe what you want to create in natural language</li>
              <li>Choose the script type (indicator or strategy)</li>
              <li>Specify additional parameters if needed</li>
              <li>Click "Generate" and let AI do the work</li>
              <li>Copy the code and paste it into TradingView's Pine Editor</li>
            </ol>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-3">Example Prompts</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>"Create an RSI indicator with overbought and oversold levels at 70 and 30"</li>
              <li>"Generate a MACD indicator with custom color coding for bullish/bearish divergence"</li>
              <li>"Build a mean reversion strategy that enters when price deviates more than 2 standard deviations from the 20-period mean"</li>
              <li>"Create a volume-weighted moving average indicator with adjustable length"</li>
            </ul>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-3">Pro Benefits</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Unlimited Pine Script generation (Free tier: 1/month)</li>
              <li>Access to GPT-4 for more complex script generation</li>
              <li>Priority processing for faster results</li>
              <li>Save and manage your script collection</li>
              <li>Share your scripts with the community</li>
            </ul>
          </div>
        </div>
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
