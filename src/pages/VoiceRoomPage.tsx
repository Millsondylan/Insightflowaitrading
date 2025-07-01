import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, PhoneOff, Users, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceRoom {
  id: string;
  name: string;
  description: string;
  active_members: number;
  max_members: number;
}

interface RoomMember {
  id: string;
  user_id: string;
  role: 'speaker' | 'listener';
  joined_at: string;
  profile?: {
    full_name: string;
    avatar_url: string;
  };
}

export default function VoiceRoomPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<VoiceRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (currentRoom) {
      joinRoom(currentRoom);
      const subscription = subscribeToRoomChanges(currentRoom);
      return () => {
        leaveRoom();
        subscription?.unsubscribe();
      };
    }
  }, [currentRoom]);

  const fetchRooms = async () => {
    try {
      // Mock data for now
      setRooms([
        {
          id: '1',
          name: 'Forex Trading Lounge',
          description: 'Discuss forex strategies and market analysis',
          active_members: 12,
          max_members: 50
        },
        {
          id: '2',
          name: 'Crypto Analysis Room',
          description: 'Real-time crypto market discussions',
          active_members: 8,
          max_members: 30
        },
        {
          id: '3',
          name: 'Beginners Help',
          description: 'Get help with trading basics',
          active_members: 5,
          max_members: 20
        }
      ]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('voice_room_members')
        .insert({
          room_id: roomId,
          user_id: user.id,
          role: 'listener'
        });

      if (error) throw error;

      setIsConnected(true);
      toast({
        title: "Joined room",
        description: "You're now connected to the voice room",
      });

      // Initialize WebRTC connection here
      // For now, we'll mock it
    } catch (error: any) {
      console.error('Error joining room:', error);
      toast({
        title: "Failed to join",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const leaveRoom = async () => {
    try {
      if (!user || !currentRoom) return;

      const { error } = await supabase
        .from('voice_room_members')
        .delete()
        .eq('room_id', currentRoom)
        .eq('user_id', user.id);

      if (error) throw error;

      setIsConnected(false);
      setCurrentRoom(null);
      setMembers([]);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const subscribeToRoomChanges = (roomId: string) => {
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'voice_room_members',
        filter: `room_id=eq.${roomId}`
      }, payload => {
        fetchRoomMembers(roomId);
      })
      .subscribe();
  };

  const fetchRoomMembers = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('voice_room_members')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .eq('room_id', roomId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Toggle actual microphone here
  };

  const requestSpeaker = async () => {
    toast({
      title: "Request sent",
      description: "Your request to speak has been sent to moderators",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading voice rooms...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Voice Rooms</h1>
        {currentRoom && (
          <Button
            variant="destructive"
            onClick={leaveRoom}
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            Leave Room
          </Button>
        )}
      </div>

      {!currentRoom ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {room.active_members}/{room.max_members}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setCurrentRoom(room.id)}
                  disabled={room.active_members >= room.max_members}
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Speakers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {members.filter(m => m.role === 'speaker').map((member) => (
                    <div key={member.id} className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-2">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-sm font-medium">
                        {member.profile?.full_name || 'Anonymous'}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        Speaking
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Room Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={isMuted ? "destructive" : "default"}
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4" />
                        Unmute
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Mute
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={requestSpeaker}
                  >
                    Request to Speak
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Listeners ({members.filter(m => m.role === 'listener').length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {members.filter(m => m.role === 'listener').map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                      <span className="text-sm">
                        {member.profile?.full_name || 'Anonymous'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 