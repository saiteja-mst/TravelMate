export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_saved: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  created_at: string;
}

export interface SavedChat {
  conversation: ChatConversation;
  messages: Message[];
}