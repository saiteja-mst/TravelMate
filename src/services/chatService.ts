import { supabase } from '../lib/supabase';
import type { Message, ChatConversation, ChatMessage, SavedChat } from '../types/chat';

class ChatService {
  // Save a conversation with its messages
  async saveConversation(userId: string, messages: Message[], title?: string): Promise<ChatConversation | null> {
    try {
      // Generate title from first user message if not provided
      const conversationTitle = title || this.generateTitle(messages);
      
      // Create conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: conversationTitle,
          is_saved: true
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw new Error(conversationError.message);
      }

      // Save all messages
      const messagesToInsert = messages.map(msg => ({
        conversation_id: conversation.id,
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      const { error: messagesError } = await supabase
        .from('chat_messages')
        .insert(messagesToInsert);

      if (messagesError) {
        console.error('Error saving messages:', messagesError);
        // Try to clean up the conversation if messages failed
        await supabase
          .from('chat_conversations')
          .delete()
          .eq('id', conversation.id);
        throw new Error(messagesError.message);
      }

      return conversation;
    } catch (error) {
      console.error('Save conversation error:', error);
      throw error;
    }
  }

  // Get all saved conversations for a user
  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_saved', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  // Load a specific conversation with all its messages
  async loadConversation(conversationId: string): Promise<SavedChat | null> {
    try {
      // Get conversation details
      const { data: conversation, error: conversationError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (conversationError) {
        console.error('Error fetching conversation:', conversationError);
        throw new Error(conversationError.message);
      }

      // Get all messages for this conversation
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw new Error(messagesError.message);
      }

      // Convert to Message format
      const messages: Message[] = (chatMessages || []).map(msg => ({
        id: msg.id,
        type: msg.type as 'user' | 'bot',
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));

      return {
        conversation,
        messages
      };
    } catch (error) {
      console.error('Load conversation error:', error);
      throw error;
    }
  }

  // Delete a conversation and all its messages
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Error deleting conversation:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete conversation error:', error);
      throw error;
    }
  }

  // Update conversation title
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ title })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation title:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Update conversation title error:', error);
      throw error;
    }
  }

  // Save messages to an existing conversation
  async saveMessagesToConversation(conversationId: string, messages: any[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert(messages);

      if (error) {
        console.error('Error saving messages to conversation:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Save messages to conversation error:', error);
      throw error;
    }
  }

  // Delete all messages for a conversation
  async deleteConversationMessages(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (error) {
        console.error('Error deleting conversation messages:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete conversation messages error:', error);
      throw error;
    }
  }

  // Update conversation timestamp
  async updateConversationTimestamp(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation timestamp:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Update conversation timestamp error:', error);
      throw error;
    }
  }

  // Generate a title from the first user message
  private generateTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      // Take first 50 characters and add ellipsis if longer
      const title = firstUserMessage.content.trim();
      return title.length > 50 ? title.substring(0, 50) + '...' : title;
    }
    return `Chat ${new Date().toLocaleDateString()}`;
  }
}

export const chatService = new ChatService();