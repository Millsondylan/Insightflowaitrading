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
          userId: profile?.id,
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
        <div className="flex flex-col h-full">
          {/* Default coach UI */}
          {/* ... existing UI ... */}
        </div>
      );
    }
    
    // Customize coach UI based on experience level
    switch (profile.experience) {
      case 'beginner':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-blue-700 dark:text-blue-300">Trading Tips for Beginners</h3>
              <ul className="mt-2 text-sm text-blue-600 dark:text-blue-300 space-y-1">
                <li>• Start with small position sizes to manage risk</li>
                <li>• Focus on learning chart patterns before trading</li>
                <li>• Always use stop losses to protect your capital</li>
              </ul>
            </div>
            {/* Rest of coach UI */}
            {/* ... existing UI ... */}
          </div>
        );
      
      case 'intermediate':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-purple-700 dark:text-purple-300">Trading Strategy Refinement</h3>
              <ul className="mt-2 text-sm text-purple-600 dark:text-purple-300 space-y-1">
                <li>• Analyze your win rate and optimize entry points</li>
                <li>• Consider multiple timeframe analysis for confirmation</li>
                <li>• Track your emotional state during trades</li>
              </ul>
            </div>
            {/* Rest of coach UI */}
            {/* ... existing UI ... */}
          </div>
        );
      
      case 'pro':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-green-700 dark:text-green-300">Advanced Trading Analysis</h3>
              <ul className="mt-2 text-sm text-green-600 dark:text-green-300 space-y-1">
                <li>• Optimize your strategy with machine learning insights</li>
                <li>• Analyze market correlation effects on your portfolio</li>
                <li>• Review your risk-adjusted returns and sharpe ratio</li>
              </ul>
            </div>
            {/* Rest of coach UI */}
            {/* ... existing UI ... */}
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col h-full">
            {/* Default coach UI */}
            {/* ... existing UI ... */}
          </div>
        );
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {renderCoachUI()}
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

