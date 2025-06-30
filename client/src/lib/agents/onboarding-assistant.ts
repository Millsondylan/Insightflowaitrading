import { OpenAI } from 'openai';
import type { User } from '@/lib/db/types';

interface OnboardingState {
  step: 'welcome' | 'profile' | 'goals' | 'experience' | 'strategies' | 'preferences' | 'complete';
  progress: number;
  userData: Partial<OnboardingUserData>;
}

export interface OnboardingUserData {
  tradingExperience: string;
  tradingGoals: string[];
  preferredMarkets: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  availableTime: string;
  preferredStrategies: string[];
}

export class OnboardingAssistant {
  private state: OnboardingState;
  private user: User | null;
  private openai: OpenAI;
  
  constructor(user: User | null, initialState?: Partial<OnboardingState>) {
    this.user = user;
    this.state = {
      step: 'welcome',
      progress: 0,
      userData: {},
      ...initialState
    };
    
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
  }
  
  async getNextPrompt(): Promise<string> {
    const messages = [
      { 
        role: "system", 
        content: "You are an onboarding assistant for InsightFlow AI Trading platform. Help the user set up their profile with a conversational approach. Ask one question at a time based on the current onboarding step." 
      },
      { 
        role: "user", 
        content: `Current onboarding step: ${this.state.step}. User data so far: ${JSON.stringify(this.state.userData)}. What should I ask the user next?` 
      }
    ];
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 150
      });
      
      return response.choices[0]?.message?.content || "Welcome to InsightFlow! Let's get you started.";
    } catch (error) {
      console.error('Error generating onboarding prompt:', error);
      return "Welcome to InsightFlow! Let's get you started with your profile setup.";
    }
  }
  
  async processUserResponse(userMessage: string): Promise<{response: string, nextState: OnboardingState}> {
    const contextMessage = `Current step: ${this.state.step}. User data so far: ${JSON.stringify(this.state.userData)}`;
    
    const messages = [
      { 
        role: "system", 
        content: "You are an onboarding assistant for InsightFlow AI Trading. Extract relevant information from user responses and decide the next onboarding step." 
      },
      { 
        role: "user", 
        content: `${contextMessage}\n\nUser message: ${userMessage}\n\nExtract information and determine the next step. Include a JSON response structure at the end of your message with "EXTRACTED_DATA" containing extracted user information and "NEXT_STEP" containing the next step name.` 
      }
    ];
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        temperature: 0.2,
        max_tokens: 500
      });
      
      // Process the response to update state
      const assistantMessage = response.choices[0]?.message?.content || "";
      
      // Extract JSON data from response
      const nextState = this.parseAssistantResponse(assistantMessage);
      
      // Return the human-readable part of the response
      const humanResponse = assistantMessage.split("```")[0].trim();
      
      return {
        response: humanResponse,
        nextState
      };
    } catch (error) {
      console.error('Error processing user response:', error);
      
      // Fallback state transition
      const nextState = this.moveToNextStep();
      
      return {
        response: "I understood your response. Let's move on to the next step.",
        nextState
      };
    }
  }
  
  private parseAssistantResponse(message: string): OnboardingState {
    // Try to extract JSON data from the response
    try {
      const jsonMatch = message.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const extractedData = JSON.parse(jsonMatch[1]);
        
        // Update user data with extracted information
        const updatedUserData = {
          ...this.state.userData,
          ...(extractedData.EXTRACTED_DATA || {})
        };
        
        // Determine next step
        const nextStep = extractedData.NEXT_STEP || this.getNextStepName();
        const nextProgress = this.getProgressForStep(nextStep);
        
        return {
          ...this.state,
          step: nextStep,
          progress: nextProgress,
          userData: updatedUserData
        };
      }
    } catch (error) {
      console.error('Error parsing assistant response:', error);
    }
    
    // Fallback to simple step progression
    return this.moveToNextStep();
  }
  
  private moveToNextStep(): OnboardingState {
    const stepOrder: OnboardingState['step'][] = [
      'welcome',
      'profile',
      'goals',
      'experience',
      'strategies',
      'preferences',
      'complete'
    ];
    
    const currentIndex = stepOrder.indexOf(this.state.step);
    const nextStep = currentIndex < stepOrder.length - 1 
      ? stepOrder[currentIndex + 1]
      : 'complete';
    
    return {
      ...this.state,
      step: nextStep,
      progress: this.getProgressForStep(nextStep)
    };
  }
  
  private getNextStepName(): OnboardingState['step'] {
    const stepOrder: OnboardingState['step'][] = [
      'welcome',
      'profile',
      'goals',
      'experience',
      'strategies',
      'preferences',
      'complete'
    ];
    
    const currentIndex = stepOrder.indexOf(this.state.step);
    return currentIndex < stepOrder.length - 1 
      ? stepOrder[currentIndex + 1]
      : 'complete';
  }
  
  private getProgressForStep(step: OnboardingState['step']): number {
    const progressMap: Record<OnboardingState['step'], number> = {
      'welcome': 0,
      'profile': 20,
      'goals': 40,
      'experience': 60,
      'strategies': 80,
      'preferences': 90,
      'complete': 100
    };
    
    return progressMap[step] || 0;
  }
} 