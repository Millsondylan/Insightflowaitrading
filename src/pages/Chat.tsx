import React from 'react';
import { Button } from '@/components/ui/button';

const ChatPage: React.FC = () => {
  return (
    <Section className="theme-chat min-h-screen px-6 py-16">
      {/* Hero Section */}
      <Div className="text-center space-y-4 mb-12 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-magenta mb-8">
          AI Trading Chat
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Your intelligent trading companion
        </P>
      </Div>

      {/* Chat Container */}
      <Div className="max-w-4xl mx-auto animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow min-h-[60vh] flex flex-col">
          {/* Chat Messages */}
          <Div className="flex-1 space-y-4 mb-6">
            <Div className="flex justify-start">
              <Div className="max-w-xs lg:max-w-md">
                <Div className="bg-pink-500/20 border border-pink-400/30 rounded-2xl rounded-bl-sm px-4 py-3">
                  <P className="text-white">Hello! I'm your AI trading assistant. How can I help you analyze the markets today?</Div>
                </Div>
                <Div className="text-xs text-gray-400 mt-1 ml-2">AI Assistant</Div>
              </Div>
            </Div>

            <Div className="flex justify-end">
              <Div className="max-w-xs lg:max-w-md">
                <Div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl rounded-br-sm px-4 py-3">
                  <P className="text-white">What's your take on TSLA's recent price action?</Div>
                </Div>
                <Div className="text-xs text-gray-400 mt-1 mr-2 text-right">You</Div>
              </Div>
            </Div>

            <Div className="flex justify-start">
              <Div className="max-w-xs lg:max-w-md">
                <Div className="bg-pink-500/20 border border-pink-400/30 rounded-2xl rounded-bl-sm px-4 py-3">
                  <P className="text-white">TSLA is showing strong momentum with a breakout above the 200-day moving average. Volume is supporting the move, but watch for resistance around $250.</Div>
                </Div>
                <Div className="text-xs text-gray-400 mt-1 ml-2">AI Assistant</Div>
              </Div>
            </Div>
          </Div>

          {/* Chat Input */}
          <Div className="border-t border-white/10 pt-6">
            <Div className="flex space-x-4">
              <Div className="flex-1">
                <Div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Div className="text-gray-400">Type your message...</Div>
                </Div>
              </Div>
              <Button className="glow-button glow-violet px-6 py-3" />
                Send
              </Button>
            </Div>
          </Div>
        </Div>

        {/* Quick Actions */}
        <Div className="mt-8 animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
          <Div className="glass-section motion-shadow">
            <H3 className="text-lg font-semibold text-white mb-4">💡 Quick Questions</Div>
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button className="glass-card hover-glow text-left p-3" />
                <Div className="text-sm text-gray-300">Analyze my portfolio risk</Div>
              </Button>
              <Button className="glass-card hover-glow text-left p-3" />
                <Div className="text-sm text-gray-300">Market sentiment today</Button>
              </Button>
              <Button className="glass-card hover-glow text-left p-3" />
                <Div className="text-sm text-gray-300">Best sectors to watch</Button>
              </Button>
              <Button className="glass-card hover-glow text-left p-3" />
                <Div className="text-sm text-gray-300">Options flow analysis</Button>
              </Button>
            </Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default ChatPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
