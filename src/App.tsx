import React from 'react';
import { Plane, MapPin, Compass, Sparkles } from 'lucide-react';
import ChatBot from './components/ChatBot';
import TravelMateAILogo from './components/Logo';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-teal-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating travel icons with animation */}
        <div className="absolute top-20 left-10 opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>
          <Plane className="w-24 h-24 text-teal-400 transform rotate-45" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Compass className="w-20 h-20 text-orange-400" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-20 animate-bounce" style={{ animationDuration: '5s' }}>
          <MapPin className="w-16 h-16 text-teal-400" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10 animate-spin" style={{ animationDuration: '20s' }}>
          <Sparkles className="w-12 h-12 text-orange-300" />
        </div>
        
        {/* Dynamic gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/30 to-teal-500/30 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-teal-500/30 to-blue-500/30 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/20 to-teal-400/20 blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      <ChatBot />
    </div>
  );
}

export default App;