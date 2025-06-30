import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageCircle, Mic, MicOff, Users, Crown, Pin, Send, Phone, PhoneOff, Hash, TrendingUp, Volume2, VolumeX, Bell
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
  room_id: string;
  reactions?: { [emoji: string]: string[] };
  is_pinned?: boolean;
  message_type: 'text' | 'trade_idea' | 'system';
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  topic: string;
  member_count: number;
  is_voice_enabled: boolean;
  is_private: boolean;
}

const ChatPage = () => {
  const { user } = useAuth();
  
  const [chatRooms] = useState<ChatRoom[]>([
    { id: '1', name: 'BTC Traders', description: 'Bitcoin trading discussions', topic: 'BTC/USD', member_count: 1247, is_voice_enabled: true, is_private: false },
    { id: '2', name: 'Forex Central', description: 'Major currency pairs', topic: 'EUR/USD', member_count: 856, is_voice_enabled: true, is_private: false },
    { id: '3', name: 'AI Signals Pro', description: 'Premium AI signals', topic: 'ALL', member_count: 89, is_voice_enabled: true, is_private: true }
  ]);
  
  const [currentRoom, setCurrentRoom] = useState<ChatRoom>(chatRooms[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1', user_id: 'user1', username: 'CryptoTrader_Pro', 
      message: 'BTC looking bullish on the 4H chart. RSI reset and ready for another leg up! 🚀',
      timestamp: new Date(Date.now() - 300000).toISOString(), room_id: '1',
      reactions: { '🚀': ['user2', 'user3'], '💯': ['user4'] }, message_type: 'text'
    },
    {
      id: '2', user_id: 'user2', username: 'ForexMaster',
      message: 'Just entered long BTC at 43,250. Target 44,500.',
      timestamp: new Date(Date.now() - 240000).toISOString(), room_id: '1', message_type: 'trade_idea'
    },
    {
      id: '3', user_id: 'system', username: 'System',
      message: 'Market Alert: BTC broke above 43,500 resistance!',
      timestamp: new Date(Date.now() - 60000).toISOString(), room_id: '1', message_type: 'system'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isInVoiceRoom, setIsInVoiceRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      username: user.email?.split('@')[0] || 'Anonymous',
      message: newMessage,
      timestamp: new Date().toISOString(),
      room_id: currentRoom.id,
      message_type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const joinVoiceRoom = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsInVoiceRoom(true);
      toast({ title: "Joined Voice Room! 🎤", description: "You're now connected." });
    } catch (error) {
      toast({ title: "Microphone Access Denied", variant: "destructive" });
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        const users = reactions[emoji] || [];
        const userId = user?.id || '';
        
        if (users.includes(userId)) {
          reactions[emoji] = users.filter(id => id !== userId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...users, userId];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead title="Community Chat - InsightFlow AI" description="Real-time trading community" />

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Community Chat</h1>
            <p className="text-gray-400">Connect with traders worldwide</p>
          </div>
          <Button variant="outline" size="sm" className="text-gray-300 border-gray-600">
            <Bell className="w-4 h-4 mr-2" />
            Notifications <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 h-[700px]">
        {/* Room List */}
        <div className="lg:col-span-1">
          <Card className="bg-black/20 border-gray-700 text-white h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />Chat Rooms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setCurrentRoom(room)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/10 ${
                    currentRoom?.id === room.id ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{room.name}</h4>
                    {room.is_voice_enabled && <Mic className="w-3 h-3 text-green-400" />}
                    {room.is_private && <Crown className="w-3 h-3 text-yellow-400" />}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{room.topic}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />{room.member_count}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="bg-black/20 border-gray-700 text-white h-full flex flex-col">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />{currentRoom?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{currentRoom?.description}</p>
                </div>
                {currentRoom?.is_voice_enabled && (
                  <div className="flex gap-2">
                    {!isInVoiceRoom ? (
                      <Button size="sm" onClick={joinVoiceRoom} className="bg-green-600 hover:bg-green-700">
                        <Phone className="w-4 h-4 mr-2" />Join Voice
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setIsMuted(!isMuted)}
                          className={isMuted ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}>
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsInVoiceRoom(false)}
                          className="border-red-500 text-red-400">
                          <PhoneOff className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="group flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{message.username}</span>
                      <span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</span>
                      {message.message_type === 'trade_idea' && (
                        <Badge className="bg-green-500/20 text-green-300 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />Trade Idea
                        </Badge>
                      )}
                      {message.message_type === 'system' && (
                        <Badge className="bg-blue-500/20 text-blue-300 text-xs">System</Badge>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{message.message}</p>
                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {Object.entries(message.reactions).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(message.id, emoji)}
                            className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20"
                          >
                            <span>{emoji}</span><span>{users.length}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button onClick={() => addReaction(message.id, '👍')} className="text-xs text-gray-400 hover:text-white">👍</button>
                      <button onClick={() => addReaction(message.id, '🚀')} className="text-xs text-gray-400 hover:text-white">🚀</button>
                      <button onClick={() => addReaction(message.id, '💯')} className="text-xs text-gray-400 hover:text-white">💯</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder={`Message #${currentRoom?.name}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-black/20 border-gray-600 text-white"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Voice Participants */}
        <div className="lg:col-span-1">
          <Card className="bg-black/20 border-gray-700 text-white h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />Voice Room
                {isInVoiceRoom && <Badge className="bg-green-500/20 text-green-300">Connected</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentRoom?.is_voice_enabled ? (
                <>
                  {['CryptoTrader_Pro', 'ForexMaster', 'You'].map((username, index) => (
                    <div key={username} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-white">{username}</span>
                        {index === 0 && <Crown className="w-3 h-3 text-yellow-400" />}
                      </div>
                      {username === 'You' && isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                    </div>
                  ))}
                  {!isInVoiceRoom && (
                    <Button onClick={joinVoiceRoom} className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="w-4 h-4 mr-2" />Join Voice Room
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <VolumeX className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Voice not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 