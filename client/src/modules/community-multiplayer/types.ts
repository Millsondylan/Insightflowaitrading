// Community Multiplayer module types
export interface Participant {
  id: string;
  name: string;
  role: 'host' | 'moderator' | 'participant';
  joinedAt: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  participants: Participant[];
  status: 'waiting' | 'active' | 'ended';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'trade';
} 