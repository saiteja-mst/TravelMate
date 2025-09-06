import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Edit3, Calendar, X, Save, RotateCcw } from 'lucide-react';
import { chatService } from '../services/chatService';
import type { ChatConversation, SavedChat } from '../types/chat';
import type { UserProfile } from '../types/auth';

interface ChatHistoryProps {
  user: UserProfile;
  onLoadConversation: (savedChat: SavedChat) => void;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ user, onLoadConversation, onClose }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadConversations();
  }, [user.id]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getUserConversations(user.id);
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadConversation = async (conversationId: string) => {
    try {
      const savedChat = await chatService.loadConversation(conversationId);
      if (savedChat) {
        onLoadConversation(savedChat);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      await chatService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
    }
  };

  const handleStartEdit = (conversation: ChatConversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = async (conversationId: string) => {
    if (!editTitle.trim()) return;

    try {
      await chatService.updateConversationTitle(conversationId, editTitle.trim());
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, title: editTitle.trim() }
            : conv
        )
      );
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Chat History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-300">Loading conversations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={loadConversations}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No saved conversations</p>
                <p className="text-gray-500 text-sm">Start chatting and save your conversations to see them here</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(conversation.id)}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(conversation.id)}
                            className="p-1 text-teal-400 hover:text-teal-300 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 
                          className="font-semibold text-white mb-2 cursor-pointer hover:text-teal-400 transition-colors truncate"
                          onClick={() => handleLoadConversation(conversation.id)}
                        >
                          {conversation.title}
                        </h3>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(conversation.updated_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(conversation)}
                        className="p-2 text-gray-400 hover:text-teal-400 hover:bg-white/10 rounded-lg transition-all duration-200"
                        title="Edit title"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteConversation(conversation.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20">
          <p className="text-center text-sm text-gray-400">
            Click on a conversation title to load it and continue where you left off
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;