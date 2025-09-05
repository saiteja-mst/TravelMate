import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Calendar, Plane, Sparkles, RotateCcw } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  onSignOut: () => void;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

const ChatBot: React.FC<ChatBotProps> = ({ onSignOut }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hey, Hi, an Amazing Human Being! \nCan we just start our journey with just a Hi to me please....",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
- Don't overwhelm with too many questions at once (2-3 max)
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
          content: "Hey, hi, amazing Human Being! Can we just start our journey with just a hi to me please....",
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
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "Hey, Hi, an Amazing Human Being! \nCan we just start our journey with just a Hi to me please....",
        timestamp: new Date()
      }
    ]);
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-sky-100/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white transform rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                TravelMate AI
              </h1>
              <p className="text-sm text-gray-600">Your Personal Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all duration-200"
              title="Clear chat"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white ml-12'
                      : 'bg-white/90 backdrop-blur-sm border border-sky-100/50 shadow-sm'
                  }`}
                >
                  <div className={`text-sm leading-relaxed ${
                    message.type === 'user' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {message.type === 'bot' ? formatMessageContent(message.content) : message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-sky-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-sky-100/50 shadow-sm rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Creating your personalized itinerary...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-sky-100/50 bg-white/90 backdrop-blur-xl p-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell me about your dream trip... Where would you like to go?"
                  className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-sm"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;