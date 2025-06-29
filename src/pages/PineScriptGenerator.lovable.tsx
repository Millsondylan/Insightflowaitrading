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
      <Div className="flex items-center justify-center min-h-[60vh]">
        <Div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></Div>
      </Div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <Div className="container mx-auto p-4 py-8">
      <H1 className="text-3xl font-bold mb-8 text-center">Pine Script Generator</Div>
      <pineScriptGenerator />
      
      <Div className="mt-12">
        <H2 className="text-2xl font-semibold mb-4"></Div>About Pine Script Generator</Div>
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Div className="bg-card rounded-lg p-6 shadow-sm">
            <H3 className="text-xl font-medium mb-3"></Div>What is Pine Script?</Div>
            <P className="text-muted-foreground">
              Pine Script is TradingView's proprietary programming language that allows you to create 
              custom indicators and trading strategies. It's designed specifically for chart analysis 
              and trading automation.
            </P>
          </Div>
          
          <Div className="bg-card rounded-lg p-6 shadow-sm">
            <H3 className="text-xl font-medium mb-3"></Div>How to Use It</Div>
            <Ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-2">
              <Li>Describe what you want to create in natural language</Ol>
              <Li>Choose the script type (indicator or strategy)</Li>
              <Li>Specify additional parameters if needed</Li>
              <Li>Click "Generate" and let AI do the work</Li>
              <Li>Copy the code and paste it into TradingView's Pine Editor</Li>
            </Ol>
          </Div>
          
          <Div className="bg-card rounded-lg p-6 shadow-sm">
            <H3 className="text-xl font-medium mb-3"></Div>Example Prompts</Div>
            <Ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <Li>"Create an RSI indicator with overbought and oversold levels at 70 and 30"</Ul>
              <Li>"Generate a MACD indicator with custom color coding for bullish/bearish divergence"</Li>
              <Li>"Build a mean reversion strategy that enters when price deviates more than 2 standard deviations from the 20-period mean"</Li>
              <Li>"Create a volume-weighted moving average indicator with adjustable length"</Li>
            </Ul>
          </Div>
          
          <Div className="bg-card rounded-lg p-6 shadow-sm">
            <H3 className="text-xl font-medium mb-3"></Div>Pro Benefits</Div>
            <Ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <Li>Unlimited Pine Script generation (Free tier: 1/month)</Ul>
              <Li>Access to GPT-4 for more complex script generation</Li>
              <Li>Priority processing for faster results</Li>
              <Li>Save and manage your script collection</Li>
              <Li>Share your scripts with the community</Li>
            </Ul>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
