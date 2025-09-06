import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Plane, MapPin, Compass, Sparkles } from 'lucide-react';
import ChatBot from './components/ChatBot';
import TravelMateAILogo from './components/Logo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      setIsAuthenticated(true);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setIsSignUp(false);
  };

  if (isAuthenticated) {
    return <ChatBot onSignOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
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

      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              {/* Travel-themed logo */}
              <div className="mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <TravelMateAILogo className="w-20 h-20" />
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-2 font-['Inter']">
                <span className="text-4xl font-light relative text-white bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text">
                  <span className="font-elegant font-semibold tracking-wide">Travel</span><span className="font-modern font-bold tracking-tight">Mate</span>
                  <span className="absolute -top-2 -right-3 text-xl animate-bounce" style={{ animationDuration: '3s' }}>✈</span>
                </span>
              </h1>
              <p className="text-lg font-semibold text-white mb-2">
                {isSignUp ? 'Join Your Travel Assistant' : 'Welcome back, pretty user!'}
              </p>
              <p className="text-gray-300 text-sm">
                {isSignUp 
                  ? 'Create your account and let us help plan your perfect trips' 
                  : 'Sign in to access your personalized travel assistant'
                }
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 mb-8 border border-white/10">
              <button
                onClick={() => !isSignUp && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  !isSignUp 
                    ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-lg shadow-orange-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => isSignUp && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  isSignUp 
                    ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-lg shadow-orange-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Sign Up Only) */}
              <div className={`transition-all duration-500 overflow-hidden ${
                isSignUp ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15 ${
                          errors.name 
                            ? 'border-red-400 focus:border-red-400' 
                            : 'border-white/20 focus:border-teal-400 hover:border-white/30'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-2 ml-1">{errors.name}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15 ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'border-white/20 focus:border-teal-400 hover:border-white/30'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-14 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15 ${
                      errors.password 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'border-white/20 focus:border-teal-400 hover:border-white/30'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              <div className={`transition-all duration-500 overflow-hidden ${
                isSignUp ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {isSignUp && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-14 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15 ${
                          errors.confirmPassword 
                            ? 'border-red-400 focus:border-red-400' 
                            : 'border-white/20 focus:border-teal-400 hover:border-white/30'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Forgot Password (Sign In Only) */}
              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25"
              >
                {isSignUp ? 'Start Your Adventure' : 'Access Assistant'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10 backdrop-blur-sm">
            <p className="text-center text-sm text-gray-300">
              {isSignUp ? 'Already part of our network?' : "New to TravelMate?"}{' '}
              <button
                onClick={toggleMode}
                className="text-teal-400 hover:text-teal-300 font-semibold transition-colors hover:underline"
              >
                {isSignUp ? 'Sign In Here' : 'Join Our Network'}
              </button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Secured with enterprise-grade encryption
          </p>
          <p className="text-xs text-gray-500">
            Helping travelers create amazing memories worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;