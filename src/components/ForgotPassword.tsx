import React, { useState } from 'react';
import { Mail, ArrowLeft, Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import TravelMateAILogo from './Logo';
import { authService } from '../services/authService';

interface ForgotPasswordProps {
  onBack: () => void;
}

type Step = 'email' | 'otp' | 'newPassword' | 'success';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Start cooldown timer
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.sendPasswordResetOTP(email);
      
      if (result.success) {
        setCurrentStep('otp');
        startResendCooldown();
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.verifyPasswordResetOTP(email, otp);
      
      if (result.success) {
        setCurrentStep('newPassword');
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.resetPassword(email, otp, newPassword);
      
      if (result.success) {
        setCurrentStep('success');
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setError(''); // Clear previous errors
    setIsLoading(true);

    try {
      const result = await authService.sendPasswordResetOTP(email);
      
      if (result.success) {
        startResendCooldown();
        // Success message could be added here
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-gray-300 text-sm">
          Enter your email address and we'll send you an OTP to reset your password
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/20 focus:border-teal-400 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Enter OTP</h2>
        <p className="text-gray-300 text-sm">
          We've sent a 6-digit OTP to <span className="text-teal-400 font-semibold">{email}</span>
        </p>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-semibold text-gray-200 mb-1">
          Enter OTP
        </label>
        <div className="relative">
          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/20 focus:border-teal-400 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15 text-center text-2xl tracking-widest"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendCooldown > 0 || isLoading}
          className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </form>
  );

  const renderNewPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
        <p className="text-gray-300 text-sm">
          Create a strong password for your account
        </p>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-200 mb-1">
          New Password
        </label>
        <div className="relative">
          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-12 pr-14 py-3 rounded-xl border-2 border-white/20 focus:border-teal-400 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-12 pr-14 py-3 rounded-xl border-2 border-white/20 focus:border-teal-400 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/15"
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Updating Password...' : 'Update Password'}
      </button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-400" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
        <p className="text-gray-300 text-sm">
          Your password has been updated successfully. You can now sign in with your new password.
        </p>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-gradient-to-r from-orange-500 via-teal-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:via-teal-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/25"
      >
        Back to Sign In
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/30 to-teal-500/30 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-teal-500/30 to-blue-500/30 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-teal-400 hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <TravelMateAILogo className="w-12 h-12" />
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                  TravelMate AI
                </h1>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 'email' && renderEmailStep()}
            {currentStep === 'otp' && renderOTPStep()}
            {currentStep === 'newPassword' && renderNewPasswordStep()}
            {currentStep === 'success' && renderSuccessStep()}

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;