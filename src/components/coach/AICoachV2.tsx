import { Trade, reviewTrade } from "@/lib/coach/reviewTrade";
import { useProfilePersonalization } from '@/hooks/use-profile-personalization';
import { useCallback } from 'react';

type Props = {
  trades: Trade[];
};

export default function AICoachV2({ trades }: Props) {
  const reviews = trades.map(reviewTrade);

  // Get personalized settings from user profile
  const { profile, aiPromptContext } = useProfilePersonalization();
  
  // Enhance AI prompt with user profile context
  const enhancePromptWithContext = useCallback((prompt: string) => {
    if (!profile) return prompt;
    
    return `
      ${aiPromptContext}
      
      Based on the user's profile and preferences, please provide trading advice:
      
      ${prompt}
    `;
  }, [profile, aiPromptContext]);
  
  // Handle sending message to AI
  const handleSendMessage = async (message: string) => {
    // ... existing code ...
    
    // Enhance the prompt with user context
    const enhancedPrompt = enhancePromptWithContext(message);
    
    try {
      // Use enhanced prompt for AI request
      const response = await fetch('/api/coach/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          userId: userId,
        }),
      });
      
      // ... rest of existing code ...
    } catch (error) {
      // ... existing error handling ...
    }
  };
  
  // Personalize coach UI based on user preferences
  const renderCoachUI = () => {
    if (!profile) {
      return (
        <Div className="flex flex-col h-full">
          {/* Default coach UI */}
          {/* ... existing UI ... */}
        </Div>
      );
    }
    
    // Customize coach UI based on experience level
    switch (profile.experience) {
      case 'beginner':
        return (
          <Div className="flex flex-col h-full">
            <Div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <H3 className="font-medium text-blue-700 dark:text-blue-300"></Div></Div>Trading Tips for Beginners</Div>
              <Ul className="mt-2 text-sm text-blue-600 dark:text-blue-300 space-y-1">
                <Li>• Start with small position sizes to manage risk</Ul>
                <Li>• Focus on learning chart patterns before trading</Li>
                <Li>• Always use stop losses to protect your capital</Li>
              </Ul>
            </Div>
            {/* Rest of coach UI */}
            {/* ... existing UI ... */}
          </Div>
        );
      
      case 'intermediate':
        return (
          <Div className="flex flex-col h-full">
            <Div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
              <H3 className="font-medium text-purple-700 dark:text-purple-300"></Div></Div>Trading Strategy Refinement</Div>
              <Ul className="mt-2 text-sm text-purple-600 dark:text-purple-300 space-y-1">
                <Li>• Analyze your win rate and optimize entry points</Ul>
                <Li>• Consider multiple timeframe analysis for confirmation</Li>
                <Li>• Track your emotional state during trades</Li>
              </Ul>
            </Div>
            {/* Rest of coach UI */}
            {/* ... existing UI ... */}
          </Div>
        );
      
      case 'pro':
        return (
          <Div className="flex flex-col h-full">
            <Div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
              <H3 className="font-medium text-green-700 dark:text-green-300"></Div></Div>Advanced Trading Analysis</Div>
              <Ul className="mt-2 text-sm text-green-600 dark:text-green-300 space-y-1">
                <Li>• Optimize your strategy with machine learning insights</Ul>
                <Li>• Analyze market correlation effects on your portfolio</Li>
                <Li>• Review your risk-adjusted returns and sharpe ratio</Li>
              </Ul>
            </Div>
            {/* Rest of coach UI */}
            {/* ... existing UI ... */}
          </Div>
        );
      
      default:
        return (
          <Div className="flex flex-col h-full">
            {/* Default coach UI */}
            {/* ... existing UI ... */}
          </Div>
        );
    }
  };
  
  return (
    <Div className="h-full flex flex-col">
      {renderCoachUI()}
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

