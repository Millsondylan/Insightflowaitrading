'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  MessageSquare, 
  Send,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Settings,
  Mic,
  MicOff,
  FileText,
  BarChart3,
  Target,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: CopilotAction[];
}

interface CopilotAction {
  id: string;
  type: 'strategy' | 'analysis' | 'alert' | 'education';
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

interface MarketInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'info';
  title: string;
  description: string;
  symbol?: string;
  confidence: number;
  timestamp: Date;
}

export default function CopilotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI trading copilot. I can help you analyze markets, suggest strategies, and provide real-time insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze current market conditions",
        "Review my recent trades",
        "Suggest trading opportunities",
        "Explain a technical indicator"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const marketInsights: MarketInsight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Breakout Opportunity Detected',
      description: 'AAPL showing strong volume breakout above resistance at $150. RSI indicates momentum building.',
      symbol: 'AAPL',
      confidence: 85,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      type: 'warning',
      title: 'Market Volatility Alert',
      description: 'VIX spiking above 25. Consider reducing position sizes and tightening stops.',
      confidence: 92,
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '3',
      type: 'info',
      title: 'Sector Rotation Detected',
      description: 'Technology sector showing relative strength while energy lags. Consider rebalancing portfolio.',
      confidence: 78,
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  ];

  const quickActions: CopilotAction[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'Market Analysis',
      description: 'Get comprehensive market overview',
      icon: 'BarChart3',
      action: () => handleQuickAction('Analyze current market conditions and identify key opportunities')
    },
    {
      id: '2',
      type: 'strategy',
      title: 'Strategy Review',
      description: 'Review and optimize your strategies',
      icon: 'Target',
      action: () => handleQuickAction('Review my current trading strategies and suggest improvements')
    },
    {
      id: '3',
      type: 'alert',
      title: 'Set Alerts',
      description: 'Configure price and pattern alerts',
      icon: 'AlertTriangle',
      action: () => handleQuickAction('Help me set up trading alerts for my watchlist')
    },
    {
      id: '4',
      type: 'education',
      title: 'Learn',
      description: 'Get educational content',
      icon: 'Lightbulb',
      action: () => handleQuickAction('Explain the current market setup and what I should focus on learning')
    }
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: [
          "Show me similar setups",
          "Explain the reasoning",
          "Set up alerts for this",
          "Review my portfolio"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('market') || input.includes('analysis')) {
      return "Based on current market conditions, I'm seeing a mixed picture. The S&P 500 is testing key support levels while tech stocks show relative strength. Key levels to watch: SPY $450 support, QQQ $380 resistance. Volume patterns suggest institutional accumulation in large-cap tech. Would you like me to analyze specific sectors or set up alerts for these levels?";
    }
    
    if (input.includes('strategy') || input.includes('review')) {
      return "Looking at your recent trades, I notice you're performing well in trending markets but struggling with choppy conditions. Your win rate is 68% with an average R:R of 1.8. Consider implementing tighter stops during low volatility periods and expanding targets during strong trends. Should I help optimize your entry/exit rules?";
    }
    
    if (input.includes('opportunity') || input.includes('setup')) {
      return "I've identified several high-probability setups: 1) AAPL breaking above $150 with volume confirmation, 2) TSLA testing key support at $240 with bullish divergence, 3) NVDA showing cup and handle pattern near $500. Which would you like me to analyze in detail?";
    }
    
    return "I understand you're asking about trading. Let me help you with that. Could you provide more specific details about what you'd like to know? I can help with market analysis, strategy development, risk management, or educational content.";
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // In real app, this would integrate with speech recognition
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Bot className="h-8 w-8 text-purple-400 mr-3" />
              AI Copilot
            </h1>
            <p className="text-slate-300">Your intelligent trading assistant powered by AI</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/copilot/settings')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button
              onClick={() => router.push('/modules/copilot/history')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map(action => {
                  const IconComponent = getIconComponent(action.icon);
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
                    >
                      <IconComponent className="h-6 w-6 text-blue-400 mb-2" />
                      <div className="text-white font-medium text-sm">{action.title}</div>
                      <div className="text-slate-400 text-xs">{action.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(message => (
                  <MessageBubble key={message.id} message={message} onSuggestionClick={handleSendMessage} />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                      placeholder="Ask me anything about trading..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={toggleVoiceInput}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                        isListening ? 'text-red-400 bg-red-400/20' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Market Insights & Stats */}
          <div className="space-y-6">
            {/* AI Status */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 text-purple-400 mr-2" />
                AI Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-green-400 font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Response Time:</span>
                  <span className="text-white font-medium">~2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Accuracy:</span>
                  <span className="text-blue-400 font-medium">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Updated:</span>
                  <span className="text-slate-400 text-sm">2 min ago</span>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
                Live Insights
              </h2>
              <div className="space-y-4">
                {marketInsights.map(insight => (
                  <MarketInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">AI Performance</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Suggestions Made:</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Successful Trades:</span>
                  <span className="text-green-400 font-medium">892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate:</span>
                  <span className="text-blue-400 font-medium">71.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Return:</span>
                  <span className="text-green-400 font-medium">+2.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onSuggestionClick }: { message: CopilotMessage; onSuggestionClick: (suggestion: string) => void }) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'} rounded-lg p-4`}>
        <div className="text-sm">{message.content}</div>
        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
        
        {message.suggestions && !isUser && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-300 mb-2">Quick suggestions:</div>
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="block w-full text-left text-xs bg-slate-600 hover:bg-slate-500 rounded px-2 py-1 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MarketInsightCard({ insight }: { insight: MarketInsight }) {
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'info': return <BarChart3 className="h-4 w-4 text-blue-400" />;
      default: return <BarChart3 className="h-4 w-4 text-slate-400" />;
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'opportunity': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-red-500/30 bg-red-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-slate-500/30 bg-slate-500/10';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getInsightColor()}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getInsightIcon()}
          <h3 className="text-white font-medium text-sm">{insight.title}</h3>
        </div>
        <div className="text-xs text-slate-400">
          {insight.confidence}%
        </div>
      </div>
      <p className="text-slate-300 text-xs mb-2">{insight.description}</p>
      {insight.symbol && (
        <div className="text-xs text-blue-400 font-medium">{insight.symbol}</div>
      )}
      <div className="text-xs text-slate-500 mt-2">
        {insight.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
}

function getIconComponent(iconName: string) {
  const iconMap: { [key: string]: any } = {
    BarChart3,
    Target,
    AlertTriangle,
    Lightbulb
  };
  return iconMap[iconName] || BarChart3;
} 