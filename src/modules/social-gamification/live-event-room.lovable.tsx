// Live Event Room Component
// Chart-watch party shell with real-time collaboration

import React, { useState, useEffect, useRef } from 'react';
import { 
  LiveEventRoom, 
  EventParticipant, 
  RoomMessage, 
  ChartAnnotation,
  SocialEvent 
} from './types';

interface LiveEventRoomProps {
  roomId: string;
  userId: string;
  onRoomEvent?: (event: SocialEvent) => void;
  className?: string;
}

export const LiveEventRoomComponent: React.FC<LiveEventRoomProps> = ({
  roomId,
  userId,
  onRoomEvent,
  className = '',
}) => {
  const [room, setRoom] = useState<LiveEventRoom | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: implement real-time WebSocket connection
  useEffect(() => {
    const connectToRoom = async () => {
      setLoading(true);
      try {
        const roomData = await fetchRoomData(roomId);
        setRoom(roomData);
        setMessages(roomData.messages);
        
        // TODO: establish WebSocket connection
        await connectWebSocket(roomId, userId);
        setIsConnected(true);
        
        // Emit room joined event
        if (onRoomEvent) {
          onRoomEvent({
            type: 'ROOM_JOINED',
            payload: { roomId, userId },
          });
        }
      } catch (error) {
        console.error('Failed to connect to room:', error);
      } finally {
        setLoading(false);
      }
    };

    connectToRoom();

    return () => {
      // TODO: cleanup WebSocket connection
      disconnectWebSocket();
    };
  }, [roomId, userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Send message to room
   * TODO: implement real message sending via WebSocket
   */
  const sendMessage = async () => {
    if (!newMessage.trim() || !room) return;

    const message: RoomMessage = {
      id: `msg_${Date.now()}`,
      userId,
      username: getCurrentUser().username,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date(),
      reactions: [],
      isModerated: false,
    };

    // Add message optimistically
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: send via WebSocket
    await sendMessageToServer(roomId, message);
  };

  /**
   * Add emoji reaction to message
   * TODO: implement reaction system
   */
  const addReaction = async (messageId: string, emoji: string) => {
    // TODO: implement reaction logic
    console.log(`Adding reaction ${emoji} to message ${messageId}`);
  };

  /**
   * Create chart annotation
   * TODO: implement chart annotation system
   */
  const createAnnotation = async (annotation: Omit<span style={{fontSize: '16px'}}>📊</span>) => {
    const fullAnnotation: ChartAnnotation = {
      ...annotation,
      id: `annotation_${Date.now()}`,
      timestamp: new Date(),
    };

    // TODO: send annotation to other participants
    console.log('Creating annotation:', fullAnnotation);
  };

  /**
   * Get participant role color
   */
  const getRoleColor = (role: string): string => {
    const colors = {
      host: 'text-red-400',
      moderator: 'text-blue-400',
      participant: 'text-white/80',
    };
    return colors[role as keyof typeof colors] || colors.participant;
  };

  /**
   * Get participant count by role
   */
  const getParticipantStats = () => {
    if (!room) return { total: 0, hosts: 0, moderators: 0, participants: 0 };
    
    const stats = room.participants.reduce((acc, p) => {
      acc.total++;
      acc[p.role + 's']++;
      return acc;
    }, { total: 0, hosts: 0, moderators: 0, participants: 0 });

    return stats;
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div ></div>
          <span >Connecting to room...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <p >Room not found or access denied</p>
      </div>
    );
  }

  const stats = getParticipantStats();

  return (
    <div className={`rounded-xl bg-black/30 border border-white/10 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Room header */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <h2 style={{ fontWeight: "700", color: "white" }}>{room.name}</h2>
            <p >{room.description}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Host: {room.hostName}</span>
            <span>Symbol: {room.symbol}</span>
            <span>Type: {room.type.replace('_', ' ')}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{stats.total}/{room.maxParticipants} participants</span>
            <span className={`w-2 h-2 rounded-full ${room.status === 'live' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
            <span>{room.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Chart area (placeholder) */}
        <div style={{ padding: "16px" }}>
          <div style={{ width: "100%", border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* TODO: integrate with chart component */}
            <div >
              <div >📈</div>
              <p >Chart for {room.symbol}</p>
              <p >Chart integration pending</p>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Participants header */}
          <div >
            <h3 style={{ color: "white" }}>
              Participants ({stats.total})
            </h3>
            <div >
              {room.participants.slice(0, 8).map((participant) => (
                <div key={participant.userId} style={{ display: "flex", alignItems: "center" }}>
                  <img 
                    src={participant.avatar} 
                    alt={participant.username}
                    
                  />
                  <span className={getRoleColor(participant.role)}>
                    {participant.username}
                  </span>
                  {participant.role !== 'participant' && (
                    <span >({participant.role})</span>
                  )}
                  <div className={`w-1 h-1 rounded-full ${participant.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>
              ))}
              {room.participants.length > 8 && (
                <div >
                  +{room.participants.length - 8} more...
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div >
            {messages.map((message) => (
              <div key={message.id} >
                <div style={{ display: "flex" }}>
                  <span >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span >
                        {message.username}
                      </span>
                      {message.type === 'system' && (
                        <span >(system)</span>
                      )}
                    </div>
                    <p >
                      {message.content}
                    </p>
                    
                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div style={{ display: "flex" }}>
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span>{reaction.emoji}</span>
                            <span >{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          {room.settings.allowChat && (
            <div >
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  style={{ border: "1px solid #374151", color: "white" }}
                  disabled={!isConnected}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  style={{ color: "white" }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room controls */}
      <div >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>🔴 LIVE</span>
            <span>•</span>
            <span>Started: {room.startTime.toLocaleTimeString()}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* TODO: Add room control buttons */}
            <button >
              📋 Annotations
            </button>
            <button >
              📊 Share Chart
            </button>
            <button >
              🚪 Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock functions (TODO: replace with real implementations)
const fetchRoomData = async (roomId: string): Promise<LiveEventRoom> => {
  // TODO: implement real API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: roomId,
    name: 'EUR/USD Analysis Session',
    description: 'Live technical analysis and trading discussion',
    hostId: 'host_123',
    hostName: 'TradingMaster',
    type: 'chart_watch',
    symbol: 'EURUSD',
    participants: [
      {
        userId: 'host_123',
        username: 'TradingMaster',
        avatar: '/api/placeholder/32/32',
        role: 'host',
        joinedAt: new Date(),
        isActive: true,
        permissions: {
          canChat: true,
          canAnnotate: true,
          canShareScreen: true,
          canSpeak: true,
        },
      },
      {
        userId: 'user_456',
        username: 'TraderBob',
        avatar: '/api/placeholder/32/32',
        role: 'participant',
        joinedAt: new Date(),
        isActive: true,
        permissions: {
          canChat: true,
          canAnnotate: false,
          canShareScreen: false,
          canSpeak: false,
        },
      },
    ],
    maxParticipants: 50,
    status: 'live',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    settings: {
      isPublic: true,
      requiresApproval: false,
      allowChat: true,
      allowAnnotations: true,
      allowVoice: false,
      recordSession: true,
      chatModerationLevel: 'basic',
    },
    messages: [
      {
        id: 'msg_1',
        userId: 'host_123',
        username: 'TradingMaster',
        content: 'Welcome everyone! We\'ll be analyzing EUR/USD patterns today.',
        type: 'text',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        reactions: [{ emoji: '👍', count: 3, users: ['user_456', 'user_789', 'user_101'] }],
        isModerated: false,
      },
      {
        id: 'msg_2',
        userId: 'user_456',
        username: 'TraderBob',
        content: 'Looking forward to it! The recent support level looks interesting.',
        type: 'text',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        reactions: [],
        isModerated: false,
      },
    ],
    annotations: [],
  };
};

const connectWebSocket = async (roomId: string, userId: string): Promise<void> => {
  // TODO: implement real WebSocket connection
  console.log(`Connecting to WebSocket for room ${roomId} as user ${userId}`);
};

const disconnectWebSocket = (): void => {
  // TODO: implement WebSocket disconnection
  console.log('Disconnecting from WebSocket');
};

const sendMessageToServer = async (roomId: string, message: RoomMessage): Promise<void> => {
  // TODO: implement real message sending
  console.log(`Sending message to room ${roomId}:`, message);
};

const getCurrentUser = () => {
  // TODO: get from auth context
  return {
    id: 'current_user',
    username: 'CurrentUser',
    avatar: '/api/placeholder/32/32',
  };
};

export default LiveEventRoomComponent; 