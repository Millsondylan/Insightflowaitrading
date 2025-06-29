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

export const LiveEventRoomComponent: React.FC<liveeventroomprops  > = ({
  roomId,
  userId,
  onRoomEvent,
  className = '',
}) => {
  const [room, setRoom] = useState<liveeventroom  >(null);
  const [messages, setMessages] = useState<roommessage  >([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<htmldivelement  >(null);

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
  const createAnnotation = async (annotation: Omit<chartannotation  >) => {
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
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-white/60">Connecting to room...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <p className="text-center text-white/60">Room not found or access denied</p>
      </div>
    );
  }

  const stats = getParticipantStats();

  return (
    <div className={`rounded-xl bg-black/30 border border-white/10 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Room header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-white">{room.name}</h2>
            <p className="text-sm text-white/60">{room.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs text-white/60">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-4">
            <span>Host: {room.hostName}</span>
            <span>Symbol: {room.symbol}</span>
            <span>Type: {room.type.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{stats.total}/{room.maxParticipants} participants</span>
            <span className={`w-2 h-2 rounded-full ${room.status === 'live' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
            <span>{room.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Chart area (placeholder) */}
        <div className="flex-1 p-4 bg-black/20">
          <div className="w-full h-full border border-white/10 rounded-lg flex items-center justify-center">
            {/* TODO: integrate with chart component */}
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-white/60">Chart for {room.symbol}</p>
              <p className="text-xs text-white/40 mt-2">Chart integration pending</p>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-80 border-l border-white/10 bg-white/5 flex flex-col">
          {/* Participants header */}
          <div className="p-3 border-b border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">
              Participants ({stats.total})
            </h3>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {room.participants.slice(0, 8).map((participant) => (
                <div key={participant.userId} className="flex items-center space-x-2 text-xs">
                  <img 
                    src={participant.avatar} 
                    alt={participant.username}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className={getRoleColor(participant.role)}>
                    {participant.username}
                  </span>
                  {participant.role !== 'participant' && (
                    <span className="text-white/40">({participant.role})</span>
                  )}
                  <div className={`w-1 h-1 rounded-full ${participant.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>
              ))}
              {room.participants.length > 8 && (
                <div className="text-xs text-white/40">
                  +{room.participants.length - 8} more...
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start space-x-2">
                  <span className="text-xs text-white/60 mt-0.5">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium text-blue-400">
                        {message.username}
                      </span>
                      {message.type === 'system' && (
                        <span className="text-xs text-white/40">(system)</span>
                      )}
                    </div>
                    <p className="text-sm text-white/80 mt-0.5 break-words">
                      {message.content}
                    </p>
                    
                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded px-1 py-0.5 text-xs transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-white/60">{reaction.count}</span>
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
            <div className="p-3 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                  disabled={!isConnected}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 rounded text-sm font-medium text-white transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room controls */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-white/60">
            <span>🔴 LIVE</span>
            <span>•</span>
            <span>Started: {room.startTime.toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* TODO: Add room control buttons */}
            <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white/80 transition-colors">
              📋 Annotations
            </button>
            <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white/80 transition-colors">
              📊 Share Chart
            </button>
            <button className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors">
              🚪 Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock functions (TODO: replace with real implementations)
const fetchRoomData = async (roomId: string): Promise<liveeventroom  > => {
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
export const lovable = { component: true };
