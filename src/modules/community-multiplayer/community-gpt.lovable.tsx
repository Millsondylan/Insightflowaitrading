// TODO: implement community AI assistant
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';

interface CommunityGPTProps {
  channelId?: string;
}

export const CommunityGPT: React.FC<Communitygptprops > = ({ channelId }) => {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m the InsightFlow Community Assistant. Ask me about trading strategies, market analysis, or connect with other traders!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // TODO: Connect to community-gpt AI block
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I understand you\'re asking about trading strategies. Based on community insights, trend-following strategies have shown 68% win rate this month. Would you like to see specific examples?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card  style={{ display: "flex" }}>
      <Div className="flex items-center gap-2 mb-4">
        <bot  />
        <H2 className="text-2xl font-bold">Community GPT</Communitygptprops>
      </Div>

      <Scrollarea >
        <Div className="space-y-4">
          {messages.map((message) => (
            <Div key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            />
              <Div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {message.role === 'user' ? (
                    <Div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <user  />
                  ) : (
                    <Div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <bot >
                    </Scrollarea>
                  )}
                </Div>
                <Div className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
     >
                  <P className="text-sm">{message.content}</Div>
                  <P className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </P>
                </Div>
              </Div>
            </Div>
          ))}
          {isTyping && (
            <Div className="flex gap-3">
              <Div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <bot >
              </Div>
              <Div className="bg-secondary p-3 rounded-lg">
                <Div className="flex gap-1">
                  <Div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                  <Div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-100" />
                  <Div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-200" />
                </Div>
              </Div>
            </Div>
          )}
        </div />

      <Div className="flex gap-2">
        <Input placeholder="Ask about strategies, analysis, or community insights..."  /> setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button size="icon">
          <Send /></Div></Div>
        </Button>
      </div />
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
