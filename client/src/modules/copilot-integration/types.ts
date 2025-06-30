// Copilot Integration module types
export interface CopilotContext {
  userId: string;
  currentStrategy?: string;
  recentTrades: string[];
  preferences: Record<string, any>;
}

export interface CopilotSuggestion {
  id: string;
  type: 'strategy' | 'risk' | 'entry' | 'exit';
  content: string;
  confidence: number;
  reasoning: string;
}

export interface CopilotResponse {
  suggestions: CopilotSuggestion[];
  context: CopilotContext;
  timestamp: string;
} 