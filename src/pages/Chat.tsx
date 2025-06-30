import React from 'react';
import { Button } from '@/components/ui/button';

const ChatPage: React.FC = () => {
  return (
    <section className="theme-chat min-h-screen px-6 py-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-magenta mb-8">
          AI Trading Chat
        </section>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Your intelligent trading companion
        </p>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow min-h-[60vh] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 space-y-4 mb-6">
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md">
                <div className="bg-pink-500/20 border border-pink-400/30 rounded-2xl rounded-bl-sm px-4 py-3">
                  <p className="text-white">Hello! I'm your AI trading assistant. How can I help you analyze the markets today?</div>
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-2">AI Assistant</div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-xs lg:max-w-md">
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl rounded-br-sm px-4 py-3">
                  <p className="text-white">What's your take on TSLA's recent price action?</div>
                </div>
                <div className="text-xs text-gray-400 mt-1 mr-2 text-right">You</div>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md">
                <div className="bg-pink-500/20 border border-pink-400/30 rounded-2xl rounded-bl-sm px-4 py-3">
                  <p className="text-white">TSLA is showing strong momentum with a breakout above the 200-day moving average. Volume is supporting the move, but watch for resistance around $250.</div>
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-2">AI Assistant</div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="text-gray-400">Type your message...</div>
                </div>
              </div>
              <Button className="glow-button glow-violet px-6 py-3"/>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
          <div className="glass-section motion-shadow">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Quick Questions</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button className="glass-card hover-glow text-left p-3"/>
                <div className="text-sm text-gray-300">Analyze my portfolio risk</div>
              </button>
              <Button className="glass-card hover-glow text-left p-3"/>
                <div className="text-sm text-gray-300">Market sentiment today</button>
              </button>
              <Button className="glass-card hover-glow text-left p-3"/>
                <div className="text-sm text-gray-300">Best sectors to watch</button>
              </button>
              <Button className="glass-card hover-glow text-left p-3"/>
                <div className="text-sm text-gray-300">Options flow analysis</button>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ChatPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
