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

export const LiveEventRoom: React.FC<LiveEventRoomProps> = ({
  eventId,
  userId,
  username,
  isHost = false,
  onLeave
}) => {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
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
      <div >
        <div >Joining event...</div>
        <div >Please wait while we connect you to the live event</div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div style={{ padding: "24px" }}>
        {error || 'Failed to join the event. Please try again.'}
      </div>
    );
  }
  
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Event Header */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex" }}>
          <div>
            <h2 style={{ fontWeight: "700" }}>{event.title}</h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ alignItems: "center" }}>
                <span ></span>
                Live
              </span>
              <span >
                {participants.length} participants
              </span>
              <span >
                Host: {event.hostName}
              </span>
            </div>
          </div>
          
          <button
            
            onClick={handleLeaveEvent}
          >
            Leave Event
          </button>
        </div>
        
        {event.description && (
          <p >{event.description}</p>
        )}
      </div>
      
      {/* Main Content Area */}
      <div style={{ display: "flex" }}>
        {/* Chat Area */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Messages */}
          <div style={{ padding: "16px" }}>
            <div >
              {messages.map(message => (
                <div key={message.id} className={`max-w-3xl ${message.userId === userId ? 'ml-auto' : ''}`}>
                  {message.type === 'system' ? (
                    <div >
                      {message.content}
                    </div>
                  ) : (
                    <div className={`p-3 rounded-lg ${
                      message.userId === userId
                        ? 'bg-brand-primary/20 text-text-primary'
                        : message.userId === 'host-123'
                          ? 'bg-brand-secondary/20 text-text-primary'
                          : 'bg-background-secondary text-text-primary'
                    }`}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className={`text-sm font-medium ${
                          message.userId === 'host-123' ? 'text-brand-secondary' : ''
                        }`}>
                          {message.username}
                          {message.userId === 'host-123' && ' (Host)'}
                        </span>
                        <span >
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message Input */}
          <div >
            <div style={{ display: "flex" }}>
              <input
                type="text"
                style={{ border: "1px solid #374151" }}
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!isConnected}
              />
              <button
                style={{ paddingLeft: "16px", paddingRight: "16px", color: "white" }}
                onClick={handleSendMessage}
                disabled={!isConnected || !messageInput.trim()}
              >
                Send
              </button>
            </div>
            {!isConnected && (
              <div >
                Connecting to chat... Please wait.
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div >
          {/* Resources */}
          <div >
            <h3 >Resources</h3>
            {event.resources && event.resources.length > 0 ? (
              <ul >
                {event.resources.map((resource, i) => (
                  <li key={i}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {resource.type === 'document' && (
                        <span >📄</span>
                      )}
                      {resource.type === 'video' && (
                        <span >🎥</span>
                      )}
                      {resource.type === 'chart' && (
                        <span >📊</span>
                      )}
                      {resource.type === 'link' && (
                        <span >🔗</span>
                      )}
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p >No resources available</p>
            )}
          </div>
          
          {/* Participants */}
          <div >
            <h3 >Participants ({participants.length})</h3>
            <div >
              {participants.map(participant => (
                <div
                  key={participant.userId}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {participant.avatarUrl ? (
                      <img
                        src={participant.avatarUrl}
                        alt={participant.username}
                        
                      />
                    ) : (
                      <span >{participant.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    participant.isHost ? 'font-medium text-brand-secondary' : ''
                  } ${!participant.isActive ? 'text-text-muted' : ''}`}>
                    {participant.username}
                    {participant.isHost && ' (Host)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['events', 'eventParticipants', 'eventMessages'],
  aiBlocks: ['eventAnalysis', 'chatModeration'],
  functions: ['joinEvent', 'leaveEvent', 'sendMessage', 'getEventDetails']
}; 