import React from 'react';
import { ArrowLeft, Sparkles, Globe, MapPin, Compass, Plane, Camera, Heart, Star, Zap, Coffee, Mountain } from 'lucide-react';
import TravelMateAILogo from './Logo';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements - More Playful */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating travel icons with more playful animations */}
        <div className="absolute top-10 left-10 opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>
          <Camera className="w-16 h-16 text-orange-400 transform rotate-12" />
        </div>
        <div className="absolute top-20 right-20 opacity-20 animate-spin" style={{ animationDuration: '20s' }}>
          <Compass className="w-20 h-20 text-teal-400" />
        </div>
        <div className="absolute bottom-40 left-16 opacity-20 animate-pulse" style={{ animationDuration: '3s' }}>
          <Mountain className="w-24 h-24 text-orange-400" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-15 animate-bounce" style={{ animationDuration: '6s' }}>
          <Heart className="w-12 h-12 text-pink-400" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Coffee className="w-14 h-14 text-orange-400" />
        </div>
        
        {/* More dynamic gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/30 to-orange-500/30 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-teal-500/30 to-purple-500/30 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/20 to-teal-400/20 blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl relative z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Sign In</span>
          </button>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex-shrink-0">
              <TravelMateAILogo className="w-10 h-10 hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text text-transparent font-['Inter']">
                <span className="font-light relative text-white bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text">
                  <span className="font-elegant font-semibold tracking-wide">Travel</span><span className="font-modern font-bold tracking-tight">Mate</span>
                  <span className="text-sm ml-1 font-sans font-normal not-italic opacity-80">AI</span>
                </span>
              </h1>
              <p className="text-sm text-gray-300">About the Assistant</p>
            </div>
          </div>

          <div className="w-32 flex-shrink-0"></div> {/* Spacer for balance */
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-40 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 via-teal-500 to-blue-600 rounded-full flex items-center justify-center animate-float shadow-2xl">
                  <Sparkles className="w-16 h-16 text-white animate-pulse" />
                </div>
                <div className="absolute -top-4 -right-4 animate-bounce">
                  <Sparkles className="w-8 h-8 text-orange-400" />
                </div>
                <div className="absolute -bottom-2 -left-2 animate-pulse">
                  <Star className="w-6 h-6 text-teal-400" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-teal-400 to-purple-400 bg-clip-text text-transparent">
              About the Assistant
            </h1>
            
            <div className="relative">
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Meet your new travel buddy who's got more tricks up its sleeve than a magician at a tourist convention! 🎩✨
              </p>
              <div className="absolute -right-8 top-0 animate-bounce" style={{ animationDelay: '1s' }}>
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Main Pitch Card */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-12 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Globe className="w-16 h-16 text-teal-400 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Plane className="w-12 h-12 text-orange-400 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-teal-500 rounded-2xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">The Secret Sauce</h2>
              </div>

              <div className="text-lg text-gray-200 leading-relaxed space-y-4">
                <p className="text-xl font-semibold text-teal-400 mb-4">
                  Ready to dust off your curiosity and leap into the unknown? 🚀
                </p>
                
                <p>
                  Our app is your <span className="text-orange-400 font-semibold">secret passport</span> to hidden corners of the world that even the maps forgot! Skip the usual tourist traps and dive into adventures so fresh, your friends won't believe they're real.
                </p>
                
                <p>
                  Discover places you didn't know existed — because the best stories don't come from postcards, they come from the <span className="text-teal-400 font-semibold">unexpected</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Instagram-Worthy Spots</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Find those "How did you even find this place?!" locations that'll make your feed legendary. 📸
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Off-the-Beaten-Path</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We specialize in the roads less traveled. Sometimes literally roads that GPS gave up on! 🗺️
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Personalized Magic</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your travel style, your budget, your weird obsession with finding the best local coffee. We get it! ☕
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-gradient-to-r from-orange-500/20 via-teal-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              How This Magic Works ✨
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tell Us Your Vibe</h3>
                <p className="text-gray-300">
                  Adventure seeker? Chill explorer? Foodie on a mission? We speak all travel languages! 🌮🏔️🏖️
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Does the Heavy Lifting</h3>
                <p className="text-gray-300">
                  Our AI assistant crafts your perfect itinerary faster than you can say "wanderlust"! 🤖⚡
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ animationDelay: '1s' }}>
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pack & Go!</h3>
                <p className="text-gray-300">
                  Get your personalized adventure plan and start collecting those "You won't believe what happened" stories! 🎒✈️
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Turn "Someday" into "Today"? 🌟
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Your next epic adventure is just a conversation away!
              </p>
              <button
                onClick={onBack}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 via-teal-500 to-purple-600 text-white text-lg font-bold rounded-2xl hover:from-orange-600 hover:via-teal-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                Start Your Adventure
                <ArrowLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>
          </div>

          {/* Footer Fun Fact */}
          <div className="text-center mt-12 opacity-70">
            <p className="text-gray-400 text-sm">
              💡 Fun Fact: 73% of our users discover places they never knew they wanted to visit. The other 27% find places they didn't know existed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;