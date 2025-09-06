import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Edit3, Calendar, X, Save, RotateCcw } from 'lucide-react';
import { chatService } from '../services/chatService';
import type { ChatConversation, SavedChat } from '../types/chat';
import type { UserProfile } from '../types/auth';

interface ChatSidebarProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLoadConversation: (savedChat: SavedChat) => void;
  onNewChat: () => void;
  currentConversationId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onLoadConversation, 
  onNewChat,
  currentConversationId 
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    }
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      await chatService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If we deleted the current conversation, start a new chat
      if (conversationId === currentConversationId) {
        onNewChat();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
    }
  };

  const handleStartEdit = (conversation: ChatConversation, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay to prevent flickering
    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  return (
    <div 
      className={`h-full bg-white/10 backdrop-blur-2xl border-r border-white/20 shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0 relative ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed State - Always visible */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="h-full w-16 flex flex-col items-center py-4">
          <div className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 cursor-pointer mb-4">
            <MessageSquare className="w-6 h-6 text-teal-400" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-2 bg-white/20 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded State */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white">Chat History</h2>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-white/20">
            <button
              onClick={() => {
                onNewChat();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white rounded-xl hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-teal-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">Loading conversations...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-red-400 text-sm mb-2">{error}</p>
                  <button
                    onClick={loadConversations}
                    className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-1">No saved conversations</p>
                  <p className="text-gray-500 text-xs">Start chatting and save your conversations</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      handleLoadConversation(conversation.id);
                    }}
                    className={`group cursor-pointer rounded-xl p-3 transition-all duration-200 hover:bg-white/10 border ${
                      currentConversationId === conversation.id
                        ? 'bg-white/15 border-teal-400/50 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {editingId === conversation.id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(conversation.id)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(conversation.id);
                              }}
                              className="p-1 text-teal-400 hover:text-teal-300 transition-colors"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <h3 className="font-medium text-white text-sm mb-2 truncate group-hover:text-teal-400 transition-colors">
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
                          onClick={(e) => handleStartEdit(conversation, e)}
                          className="p-1 text-gray-400 hover:text-teal-400 hover:bg-white/10 rounded transition-all duration-200"
                          title="Edit title"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-all duration-200"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <p className="text-center text-xs text-gray-400">
              {conversations.length} saved conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;