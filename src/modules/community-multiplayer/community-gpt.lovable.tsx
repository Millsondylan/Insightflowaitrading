// TODO: implement community AI assistant
import React from 'react';

interface CommunityGPTProps {
  channelId?: string;
}

export const CommunityGPT: React.FC<CommunityGPTProps> = ({ channelId }) => {
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
    <Card style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <Bot  />
        <h2 style={{ fontWeight: "700" }}>Community GPT</h2>
      </div>

      <ScrollArea style={{ marginBottom: "16px" }}>
        <div >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {message.role === 'user' ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{fontSize: '16px'}}>👤</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bot  />
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p >{message.content}</p>
                  <p >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot  />
              </div>
              <div >
                <div style={{ display: "flex" }}>
                  <div  />
                  <div  />
                  <div  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div style={{ display: "flex" }}>
        <Input
          placeholder="Ask about strategies, analysis, or community insights..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} size="icon">
          <Send  />
        </Button>
      </div>
    </Card>
  );
}; 