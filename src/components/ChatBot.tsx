import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Calendar, Plane, Sparkles, RotateCcw, Globe, Save, Menu, MessageSquare } from 'lucide-react';
import OpenAI from 'openai';
import TravelMateAILogo from './Logo';
import ChatSidebar from './ChatSidebar';
import { chatService } from '../services/chatService';
import type { UserProfile } from '../types/auth';
import type { Message, SavedChat, ChatConversation } from '../types/chat';

interface ChatBotProps {
  user: UserProfile | null;
  onSignOut: () => void;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

const ChatBot: React.FC<ChatBotProps> = ({ user, onSignOut }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hey Hi, ${user?.full_name || 'amazing Human Being'}! Welcome to TravelMate AI. Can we just start our journey with a warm nice greeting?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showChatBot, setShowChatBot] = useState(true);
  const [sidebarKey, setSidebarKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateItinerary = async (userInput: string): Promise<string> => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are TravelMate AI, an empathetic, intelligent travel assistant and itinerary designer specializing in India. You are warm, engaging, culturally aware, adaptive, and use emojis naturally.

Your Goals:
- Plan intelligent, extraordinary, and thoughtful itineraries
- Adapt questions dynamically based on user input
- Summarize clearly before generating final plan
- Balance warmth with efficiency

Conversation Flow (adapt based on user responses):

Stage A - Warm-up:
- Greet warmly and ask about trip type (quick getaway or full vacation)
- Ask preferred language (English / हिन्दी / বাংলা / தமிழ் / తెలుగు / ಕನ್ನಡ / മലയാളം)
- Ask about trip mood: 😌 Relax / 🏞️ Adventure / 💕 Romantic / 👨‍👩‍👧 Family time / 🌿 Detox / 📸 Photo-worthy
- Ask energy level: 😎 laid-back / 🙂 balanced / ⚡ go-go-go

Stage B - Trip Intent:
- Ask if travel is within India or international
- If destination unknown, suggest based on preferences (mountains, beaches, heritage cities, etc.)
- Ask about proximity travel (50-200 km from their city)
- Ask starting city, dates, trip length, group size and type
- Check for kids or elders needing special consideration

Stage C - Budget & Comfort:
- Ask budget range in INR (total or per person)
- Ask comfort level: 🎒 Backpacker / 🛏️ Mid-range / 🏨 Premium
- Ask stay preferences: Homestay / Hotels / Resorts

Stage D - Interests:
- Ask about interests: Beaches, Trekking, Wildlife, Heritage, Spiritual, Food, etc.
- Ask about must-do or must-avoid activities
- Ask food preferences (Veg/Jain/Vegan/Non-veg/Halal, spice level)
- Ask travel mode preference (Train/Flight/Bus/Self-drive)

Stage E - India-specific:
- Ask about festival interests
- Ask about monsoon tolerance
- Mention permit arrangements for Northeast/Border areas
- Ask about workation needs

Stage F - Safety & Accessibility:
- Ask preferred daily pace
- Ask about mobility or health considerations
- For solo women, offer safety-focused suggestions

Stage G - Confirmation:
- Summarize all inputs clearly
- Ask preferred style: Budget-first, Experience-first, or Balanced
- Confirm output format preference

Rules:
- Don't overwhelm with too many questions at once (1-2 max)
- Always adapt next question to user's last response
- Confirm understanding before finalizing itinerary
- Summarize inputs in clear human language

For itineraries, provide day-by-day breakdown with activities, travel times, costs, and alternatives. Highlight authentic cultural experiences and local food recommendations.`
          },
          ...messages.map(msg => ({
            role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
          })),
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response received from OpenAI API');
      }
      return response;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error("Please add your OpenAI API key to the .env file to enable the AI assistant.");
      }
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error("OpenAI API quota exceeded. Please check your billing settings.");
      }
      throw new Error("Failed to connect to OpenAI API. Please try again in a moment.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateItinerary(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: error instanceof Error ? error.message : "I'm having some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setCurrentConversationId(null);
    startNewChat();
  };

  const startNewChat = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: `Hey Hi, ${user?.full_name || 'amazing Human Being'}! Welcome to TravelMate AI. Can we just start our journey with a warm nice greeting?`,
        timestamp: new Date()
      }
    ]);
  };

  const handleSaveChat = async () => {
    if (!user || messages.length <= 1) return;

    setIsSaving(true);
    try {
      const conversation = await chatService.saveConversation(user.id, messages);
      if (conversation) {
        setCurrentConversationId(conversation.id);
        // Force sidebar refresh to show the new conversation
        setSidebarKey(prev => prev + 1);
        setSidebarKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadConversation = (savedChat: SavedChat) => {
    setMessages(savedChat.messages);
    setCurrentConversationId(savedChat.conversation.id);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .split('\n')
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line || '<br>' }} />
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-teal-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 opacity-10 animate-spin" style={{ animationDuration: '30s' }}>
          <Globe className="w-32 h-32 text-teal-400" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10 animate-bounce" style={{ animationDuration: '8s' }}>
          <MapPin className="w-20 h-20 text-orange-400" />
        </div>
        
        {/* Dynamic gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onLogoClick}
              className="hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-2xl cursor-pointer"
              title="About TravelMate AI"
            >
              <TravelMateAILogo className="w-16 h-16" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text text-transparent font-['Inter']">
                <span className="font-light relative text-white bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text">
                  <span className="font-elegant font-semibold tracking-wide">Travel</span><span className="font-modern font-bold tracking-tight">Mate</span>
                  <span className="text-sm ml-1 font-sans font-normal not-italic opacity-80">AI</span>
                </span>
              </h1>
              <p className="text-sm text-gray-300">Your Personal Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="p-2 text-gray-400 hover:text-teal-400 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110"
              title="New chat"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                showChatHistory
                  ? 'text-teal-400 bg-teal-400/20'
                  : 'text-gray-400 hover:text-teal-400 hover:bg-white/10'
              }`}
              title="Toggle chat history"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowChatBot(!showChatBot)}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                showChatBot
                  ? 'text-teal-400 bg-teal-400/20'
                  : 'text-gray-400 hover:text-teal-400 hover:bg-white/10'
              }`}
              title="Toggle chat window"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveChat}
              disabled={messages.length <= 1 || isSaving}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                messages.length <= 1 || isSaving
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-teal-400 hover:bg-gradient-to-r hover:from-orange-500/20 hover:via-teal-500/20 hover:to-blue-500/20'
              }`}
              title="Save chat"
            >
              {isSaving ? (
                <div className="relative">
                  <Sparkles className="w-5 h-5 animate-pulse text-teal-400" />
                  <div className="absolute inset-0 animate-ping">
                    <Sparkles className="w-5 h-5 text-orange-400 opacity-75" />
                  </div>
                  <div className="absolute inset-0 animate-bounce" style={{ animationDuration: '1s' }}>
                    <div className="w-1 h-1 bg-teal-400 rounded-full absolute top-0 right-0 animate-pulse" />
                    <div className="w-1 h-1 bg-orange-400 rounded-full absolute bottom-0 left-0 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              ) : (
                <Save className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm font-medium hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex pt-20">
        {/* Chat History Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${
          showChatHistory ? 'w-80 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden`}>
          <ChatSidebar
            key={sidebarKey}
            user={user}
            isOpen={showChatHistory}
            onClose={() => setShowChatHistory(false)}
            onLoadConversation={handleLoadConversation}
            onNewChat={startNewChat}
            currentConversationId={currentConversationId}
          />
        </div>

        {/* Chat Messages Area */}
        <div className={`transition-all duration-300 ease-in-out ${
          showChatBot ? 'flex-1 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden`}>
          {showChatBot && (
            <div className="flex flex-col h-full relative z-40">
              {/* Messages Container - Takes remaining space above input */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-4xl mx-auto w-full pb-24">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-200">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-3xl rounded-2xl px-6 py-4 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white ml-12 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                            : 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15'
                        } hover:scale-[1.02] transition-transform duration-200`}
                      >
                        <div className={`text-sm leading-relaxed ${
                          message.type === 'user' ? 'text-white' : 'text-gray-100'
                        }`}>
                          {message.type === 'bot' ? formatMessageContent(message.content) : message.content}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-orange-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-200">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl px-6 py-4 animate-pulse">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Sparkles className="w-4 h-4 animate-spin text-teal-400" />
                          <span className="text-sm">Creating your personalized itinerary...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area - Always at Bottom */}
              <div className="fixed bottom-0 left-0 right-0 border-t border-white/20 bg-white/10 backdrop-blur-2xl flex-shrink-0 z-50">
                <div className="max-w-4xl mx-auto p-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Come on, let's deep-dive into your travel plan"
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 text-white placeholder-gray-300 shadow-xl hover:bg-white/15 transition-all duration-200"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-4 bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white rounded-2xl hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 hover:shadow-orange-500/25"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State when both panels are hidden */}
        {!showChatHistory && !showChatBot && (
          <div className="flex-1 flex items-start justify-center pt-8">
            <div className="text-center">
              <TravelMateAILogo className="w-32 h-32 mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to TravelMate AI</h2>
              <p className="text-gray-300 mb-6">Use the toggle buttons above to show the chat history or chat window</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowChatHistory(true);
                    setShowChatBot(true);
                  }}
                  onClick={() => {
                    setShowChatHistory(true);
                    setShowChatBot(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white rounded-xl hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Show Chat History
                </button>
                <button
                  onClick={() => {
                    setShowChatBot(true);
                    if (!showChatHistory) {
                      setShowChatHistory(true);
                    }
                  }}
                  onClick={() => {
                    setShowChatBot(true);
                    if (!showChatHistory) {
                      setShowChatHistory(true);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white rounded-xl hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Bot className="w-5 h-5" />
                  Show Chat Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;