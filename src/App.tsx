import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Plane, MapPin, Compass } from 'lucide-react';
import ChatBot from './components/ChatBot';

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Travel-themed Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating travel icons */}
        <div className="absolute top-20 left-10 opacity-10">
          <Plane className="w-24 h-24 text-sky-600 transform rotate-45" />
        </div>
        <div className="absolute top-40 right-20 opacity-10">
          <Compass className="w-20 h-20 text-blue-600" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-10">
          <MapPin className="w-16 h-16 text-indigo-600" />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/10 to-blue-300/10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              {/* Travel-themed logo */}
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Plane className="w-10 h-10 text-white transform rotate-45" />
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                TravelMate
              </h1>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {isSignUp ? 'Join Your Travel Assistant' : 'Welcome back, pretty user!'}
              </p>
              <p className="text-gray-600 text-sm">
                {isSignUp 
                  ? 'Create your account and let us help plan your perfect trips' 
                  : 'Sign in to access your personalized travel assistant'
                }
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-gray-100/80 rounded-2xl p-1.5 mb-8 backdrop-blur-sm">
              <button
                onClick={() => !isSignUp && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !isSignUp 
                    ? 'bg-white text-sky-600 shadow-lg shadow-sky-100/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => isSignUp && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isSignUp 
                    ? 'bg-white text-sky-600 shadow-lg shadow-sky-100/50' 
                    : 'text-gray-600 hover:text-gray-900'
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
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white/80 backdrop-blur-sm ${
                          errors.name 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-sky-500 hover:border-sky-300'
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
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white/80 backdrop-blur-sm ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-sky-500 hover:border-sky-300'
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
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-14 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white/80 backdrop-blur-sm ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-sky-500 hover:border-sky-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-600 transition-colors"
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
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-14 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white/80 backdrop-blur-sm ${
                          errors.confirmPassword 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-sky-500 hover:border-sky-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-600 transition-colors"
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
                    className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
              >
                {isSignUp ? 'Start Your Adventure' : 'Access Assistant'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gradient-to-r from-sky-50/80 to-blue-50/80 border-t border-sky-100/50 backdrop-blur-sm">
            <p className="text-center text-sm text-gray-600">
              {isSignUp ? 'Already part of our network?' : "New to TravelMate?"}{' '}
              <button
                onClick={toggleMode}
                className="text-sky-600 hover:text-sky-800 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign In Here' : 'Join Our Network'}
              </button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Secured with enterprise-grade encryption
          </p>
          <p className="text-xs text-gray-400">
            Helping travelers create amazing memories worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;