import React, { useState, useEffect, useRef } from 'react';

interface LiveEventRoomProps {
  eventId: string;
  userId: string;
  username: string;
  isHost?: boolean;
  onLeave?: () => void;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  type: 'chat' | 'system' | 'alert';
}

interface Participant {
  userId: string;
  username: string;
  isHost: boolean;
  joinedAt: string;
  isActive: boolean;
  avatarUrl?: string;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  hostId: string;
  hostName: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  participantCount: number;
  maxParticipants?: number;
  type: 'webinar' | 'discussion' | 'trading-session' | 'q&a';
  tags: string[];
  resources?: {
    title: string;
    url: string;
    type: 'document' | 'video' | 'chart' | 'link';
  }[];
}

export const LiveEventRoom: React.FC<liveEventRoomProps> = ({
  eventId,
  userId,
  username,
  isHost = false,
  onLeave
}) => {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<participant[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    fetchEventDetails();
    connectToEventSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchEventDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/events/${eventId}`);
      // const data = await response.json();
      
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockEvent: EventDetails = {
        id: eventId,
        title: 'Live Market Analysis: Bitcoin Breakout Strategy',
        description: 'Join us for a live analysis of the current Bitcoin market and learn how to identify and trade breakout patterns effectively.',
        startTime: new Date().toISOString(),
        hostId: 'host-123',
        hostName: 'Trading Expert',
        status: 'live',
        participantCount: 24,
        maxParticipants: 50,
        type: 'trading-session',
        tags: ['bitcoin', 'breakout', 'technical-analysis'],
        resources: [
          {
            title: 'Breakout Strategy PDF',
            url: 'https://example.com/breakout-strategy.pdf',
            type: 'document'
          },
          {
            title: 'BTC/USD Chart',
            url: 'https://example.com/btc-usd-chart',
            type: 'chart'
          }
        ]
      };
      
      const mockParticipants: Participant[] = [
        {
          userId: 'host-123',
          username: 'Trading Expert',
          isHost: true,
          joinedAt: new Date(Date.now() - 900000).toISOString(),
          isActive: true,
          avatarUrl: 'https://example.com/avatar1.jpg'
        },
        {
          userId,
          username,
          isHost,
          joinedAt: new Date().toISOString(),
          isActive: true
        }
      ];
      
      // Add some mock participants
      for (let i = 0; i < 10; i++) {
        mockParticipants.push({
          userId: `user-${i}`,
          username: `Trader${i}`,
          isHost: false,
          joinedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          isActive: Math.random() > 0.2
        });
      }
      
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          userId: 'host-123',
          username: 'Trading Expert',
          content: 'Welcome everyone to our live Bitcoin breakout strategy session!',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: 'chat'
        },
        {
          id: 'msg-2',
          userId: 'system',
          username: 'System',
          content: 'The event has started. Please be respectful in the chat.',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: 'system'
        },
        {
          id: 'msg-3',
          userId: 'user-2',
          username: 'Trader2',
          content: 'Looking forward to learning about breakout strategies!',
          timestamp: new Date(Date.now() - 540000).toISOString(),
          type: 'chat'
        },
        {
          id: 'msg-4',
          userId: 'host-123',
          username: 'Trading Expert',
          content: "Let's start by looking at the current BTC/USD chart. Notice the consolidation pattern that's been forming over the past week.",
          timestamp: new Date(Date.now() - 480000).toISOString(),
          type: 'chat'
        },
        {
          id: 'msg-5',
          userId: 'system',
          username: 'System',
          content: `${username} has joined the event.`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ];
      
      setEvent(mockEvent);
      setParticipants(mockParticipants);
      setMessages(mockMessages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again.');
      setLoading(false);
    }
  };
  
  const connectToEventSocket = () => {
    // Mock WebSocket connection for development
    console.log('Connecting to event socket...');
    
    // In a real implementation, we would connect to a WebSocket server
    // socketRef.current = new WebSocket(`wss://api.example.com/events/${eventId}/socket`);
    
    // Simulate connection established
    setTimeout(() => {
      setIsConnected(true);
      addSystemMessage('Connected to the live event.');
    }, 1000);
    
    // Simulate receiving messages periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomUser = Math.floor(Math.random() * 10);
        addMessage({
          id: `msg-${Date.now()}`,
          userId: `user-${randomUser}`,
          username: `Trader${randomUser}`,
          content: getRandomMessage(),
          timestamp: new Date().toISOString(),
          type: 'chat'
        });
      }
    }, 10000);
    
    return () => clearInterval(interval);
  };
  
  const getRandomMessage = () => {
    const messages = [
      'What timeframe do you recommend for this strategy?',
      'Has anyone tried this on ETH as well?',
      'I see the resistance level forming at the 50k mark.',
      'How do you handle false breakouts?',
      'What indicators work best with this strategy?',
      'Thanks for sharing this analysis!',
      'The volume is increasing, could be a good sign.',
      'What risk management rules do you follow?',
      'Is this applicable to lower timeframes as well?',
      'I have been using a similar approach with good results.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  
  const addSystemMessage = (content: string) => {
    addMessage({
      id: `system-${Date.now()}`,
      userId: 'system',
      username: 'System',
      content,
      timestamp: new Date().toISOString(),
      type: 'system'
    });
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId,
      username,
      content: messageInput,
      timestamp: new Date().toISOString(),
      type: 'chat'
    };
    
    // In a real implementation, we would send the message through the WebSocket
    // if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
    //   socketRef.current.send(JSON.stringify(newMessage));
    // }
    
    addMessage(newMessage);
    setMessageInput('');
  };
  
  const handleLeaveEvent = () => {
    // In a real implementation, we would send a leave event through the WebSocket
    addSystemMessage(`${username} has left the event.`);
    
    if (onLeave) {
      onLeave();
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (loading) {
    return (
      <Div className="p-12 text-center">
        <Div className="text-xl font-semibold mb-2">Joining event...</EventDetails>
        <Div className="text-text-muted">Please wait while we connect you to the live event</Div>
      </Div>
    );
  }
  
  if (error || !event) {
    return (
      <Div className="p-6 bg-status-error/20 text-status-error rounded-lg">
        {error || 'Failed to join the event. Please try again.'}
      </Div>
    );
  }
  
  return (
    <Div className="live-event-room h-full flex flex-col">
      {/* Event Header */}
      <Div className="p-4 bg-background-secondary border-b border-border-primary">
        <Div className="flex justify-between items-start">
          <Div>
            <H2 className="text-xl font-bold">{event.title}</Div>
            <Div className="flex items-center mt-1">
              <Span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-status-success/20 text-status-success">
                <Span className="w-2 h-2 rounded-full bg-status-success mr-1"></Div>
                Live
              </Span>
              <Span className="ml-2 text-sm text-text-muted">
                {participants.length} participants
              </Span>
              <Span className="ml-2 text-sm text-text-muted">
                Host: {event.hostName}
              </Span>
            </Div>
          </Div>
          
          <Button className="px-3 py-1 bg-status-error/20 text-status-error rounded hover:bg-status-error/30"
            onClick={handleLeaveEvent}
     >
            Leave Event
          </Button>
        </Div>
        
        {event.description && (
          <P className="mt-2 text-sm text-text-muted">{event.description}</P>
        )}
      </Div>
      
      {/* Main Content Area */}
      <Div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <Div className="flex-1 flex flex-col bg-background-primary">
          {/* Messages */}
          <Div className="flex-1 overflow-y-auto p-4">
            <Div className="space-y-3">
              {messages.map(message => (
                <Div key={message.id} className={`max-w-3xl ${message.userId === userId ? 'ml-auto' : ''}`}>
                  {message.type === 'system' ? (
                    <Div className="py-1 px-3 text-xs text-text-muted bg-background-tertiary rounded-md inline-block">
                      {message.content}
                    </Div>
                  ) : (
                    <Div className={`p-3 rounded-lg ${
                      message.userId === userId
                        ? 'bg-brand-primary/20 text-text-primary'
                        : message.userId === 'host-123'
                          ? 'bg-brand-secondary/20 text-text-primary'
                          : 'bg-background-secondary text-text-primary'
                    }`}>
                      <Div className="flex justify-between items-center mb-1">
                        <Span className={`text-sm font-medium ${
                          message.userId === 'host-123' ? 'text-brand-secondary' : ''
                        }`}>
                          {message.username}
                          {message.userId === 'host-123' && ' (Host)'}
                        </Div>
                        <Span className="text-xs text-text-muted">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Span>
                      </Div>
                      <P>{message.content}</P>
                    </Div>
                  )}
                </Div>
              ))}
              <Div ref={messagesEndRef} />
            </Div>
          </Div>
          
          {/* Message Input */}
          <Div className="p-3 border-t border-border-primary bg-background-secondary">
            <Div className="flex">
              <Input type="text"
                className="flex-1 p-2 bg-background-primary border border-border-primary rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) = /> setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!isConnected}
              />
              <Button className="px-4 py-2 bg-brand-primary text-white rounded-r-md hover:bg-brand-primary/80 disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={!isConnected || !messageInput.trim()}
              />
                Send
              </Div>
            </Div>
            {!isConnected && (
              <Div className="mt-2 text-sm text-status-error">
                Connecting to chat... Please wait.
              </Div>
            )}
          </Div>
        </Div>
        
        {/* Sidebar */}
        <Div className="w-64 border-l border-border-primary bg-background-secondary overflow-y-auto hidden md:block">
          {/* Resources */}
          <Div className="p-3 border-b border-border-primary">
            <H3 className="font-medium mb-2">Resources</Div>
            {event.resources && event.resources.length > 0 ? (
              <Ul className="space-y-2">
                {event.resources.map((resource, i) => (
                  <Li key={i}>
                    <A href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-primary hover:text-brand-primary/80 flex items-center"
                  >
                      {resource.type === 'document' && (
                        <Span className="mr-1">📄</Ul>
                      )}
                      {resource.type === 'video' && (
                        <Span className="mr-1">🎥</Span>
                      )}
                      {resource.type === 'chart' && (
                        <Span className="mr-1">📊</Span>
                      )}
                      {resource.type === 'link' && (
                        <Span className="mr-1">🔗</Span>
                      )}
                      {resource.title}
                    </A>
                  </Li>
                ))}
              </Ul>
            ) : (
              <P className="text-sm text-text-muted">No resources available</P>
            )}
          </Div>
          
          {/* Participants */}
          <Div className="p-3">
            <H3 className="font-medium mb-2">Participants ({participants.length})</Div>
            <Div className="space-y-1 max-h-60 overflow-y-auto">
              {participants.map(participant => (
                <Div key={participant.userId}
                  className="flex items-center p-1 rounded hover:bg-background-interactive"
                />
                  <Div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center mr-2">
                    {participant.avatarUrl ? (
                      <Img
                        src={participant.avatarUrl}
                        alt={participant.username}
                        className="w-6 h-6 rounded-full"
                      /></Div>
                    ) : (
                      <Span className="text-xs">{participant.username.charAt(0).toUpperCase()}</Span>
                    )}
                  </Div>
                  <Span className={`text-sm ${
                    participant.isHost ? 'font-medium text-brand-secondary' : ''
                  } ${!participant.isActive ? 'text-text-muted' : ''}`}>
                    {participant.username}
                    {participant.isHost && ' (Host)'}
                  </Span>
                </Div>
              ))}
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['events', 'eventParticipants', 'eventMessages'],
  aiBlocks: ['eventAnalysis', 'chatModeration'],
  functions: ['joinEvent', 'leaveEvent', 'sendMessage', 'getEventDetails']
}; 