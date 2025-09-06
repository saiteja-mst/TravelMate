import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Plane, MapPin, Compass, Sparkles, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import ChatBot from './components/ChatBot';
import TravelMateAILogo from './components/Logo';
import { authService, UserProfile } from './services/authService';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const profile = await authService.getUserProfile(session.user.id);
        setUserProfile(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const profile = await authService.getUserProfile(currentUser.id);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setAuthError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setAuthError('Email and password are required');
      return false;
    }

    if (authMode === 'signup') {
      if (!formData.fullName) {
        setAuthError('Full name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setAuthError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setAuthError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const { user: newUser } = await authService.signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (newUser) {
          const profile = await authService.getUserProfile(newUser.id);
          setUserProfile(profile);
        }
      } else {
        const { user: signedInUser } = await authService.signIn(
          formData.email,
          formData.password
        );
        if (signedInUser) {
          const profile = await authService.getUserProfile(signedInUser.id);
          setUserProfile(profile);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setUserProfile(null);
      setFormData({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setAuthError(null);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <TravelMateAILogo className="w-20 h-20 mx-auto mb-4 animate-pulse" />
          <div className="text-white text-lg">Loading TravelMate...</div>
        </div>
      </div>
    );
  }

  if (!user) {
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

        {/* Auth Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <TravelMateAILogo className="w-20 h-20 mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text text-transparent font-['Inter'] mb-2">
                <span className="font-light relative text-white bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text">
                  <span className="font-elegant font-semibold tracking-wide">Travel</span><span className="font-modern font-bold tracking-tight">Mate</span>
                  <span className="text-lg ml-1 font-sans font-normal not-italic opacity-80">AI</span>
                </span>
              </h1>
              <p className="text-gray-300 text-lg">Your Personal Travel Assistant</p>
            </div>

            {/* Auth Form */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {authMode === 'signin' ? 'Welcome Back!' : 'Join TravelMate'}
                </h2>
                <p className="text-gray-300">
                  {authMode === 'signin' 
                    ? 'Sign in to continue your travel journey' 
                    : 'Create your account to start planning amazing trips'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 text-white placeholder-gray-400 transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 text-white placeholder-gray-400 transition-all duration-200"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white rounded-xl hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:shadow-orange-500/25"
                >
                  {authLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    authMode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={switchAuthMode}
                    className="text-teal-400 hover:text-teal-300 font-semibold transition-colors duration-200"
                  >
                    {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <ChatBot user={user} userProfile={userProfile} onSignOut={handleSignOut} />
    </div>
  );
}

export default App;