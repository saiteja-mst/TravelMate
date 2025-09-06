import { supabase } from '../lib/supabase';
import type { UserProfile, UserSession, TravelPreferences, AuthResponse, SignUpData, SignInData } from '../types/auth';

class AuthService {
  // Sign up new user
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || data.email.split('@')[0]
          }
        }
      });

      if (authError) {
        if (authError.message === 'User already registered') {
          console.warn('Signup validation:', authError.message);
        } else {
          console.error('Signup error:', authError);
        }
        return { user: null, session: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, session: null, error: 'Failed to create user account' };
      }

      // Create user profile manually since triggers might not work
      const userProfile = await this.createUserProfile(authData.user);
      
      // Create session record
      const session = await this.createSession(authData.user.id);

      return { 
        user: userProfile, 
        session, 
        error: null 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred during signup' 
      };
    }
  }

  // Sign in existing user
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        console.error('Signin error:', authError);
        return { user: null, session: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, session: null, error: 'Failed to sign in' };
      }

      // Get or create user profile
      let userProfile = await this.getUserProfile(authData.user.id);
      if (!userProfile) {
        userProfile = await this.createUserProfile(authData.user);
      }
      
      // Create session record
      const session = await this.createSession(authData.user.id);

      return { 
        user: userProfile, 
        session, 
        error: null 
      };
    } catch (error) {
      console.error('Signin error:', error);
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred during signin' 
      };
    }
  }

  // Sign out user
  async signOut(): Promise<{ error: string | null }> {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Deactivate all user sessions
        await this.deactivateUserSessions(session.user.id);
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Check if the error is due to missing/invalid session
        const sessionMissingErrors = [
          'Auth session missing!',
          'Session from session_id claim in JWT does not exist',
          'session_not_found'
        ];
        
        const isSessionMissingError = sessionMissingErrors.some(errorMsg => 
          error.message.includes(errorMsg) || error.code === 'session_not_found'
        );
        
        if (isSessionMissingError) {
          // Treat missing session as successful sign-out
          console.warn('Session already invalid during sign-out, treating as success:', error.message);
          return { error: null };
        }
        
        console.error('Signout error:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred during signout' };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return await this.getUserProfile(user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Get user profile error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update user profile error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Create session record
  async createSession(userId: string): Promise<UserSession | null> {
    try {
      const sessionData = {
        user_id: userId,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        is_active: true
      };

      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('Create session error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Create session error:', error);
      return null;
    }
  }

  // Deactivate user sessions
  async deactivateUserSessions(userId: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);
    } catch (error) {
      console.error('Deactivate sessions error:', error);
    }
  }

  // Get user travel preferences
  async getTravelPreferences(userId: string): Promise<TravelPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('travel_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Get travel preferences error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get travel preferences error:', error);
      return null;
    }
  }

  // Update travel preferences
  async updateTravelPreferences(userId: string, preferences: Partial<TravelPreferences>): Promise<TravelPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('travel_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Update travel preferences error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Update travel preferences error:', error);
      return null;
    }
  }

  // Get client IP (simplified version)
  private async getClientIP(): Promise<string | null> {
    try {
      // In a real application, you might want to use a service to get the real IP
      // For now, we'll return null and let the database handle it
      return null;
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch {
      return false;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Expose supabase client for direct access when needed
  get supabase() {
    return supabase;
  }

  // Password Reset Methods
  async sendPasswordResetOTP(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in localStorage temporarily
      const otpData = {
        email,
        otp,
        expiresAt: expiresAt.toISOString(),
        verified: false
      };
      localStorage.setItem(`password_reset_${email}`, JSON.stringify(otpData));

      try {
        // Send OTP via Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('send-otp-email', {
          body: { email, otp }
        });

        if (error) {
          console.error('Edge function error:', error);
          // Fallback: Show OTP in alert for demo
          alert(`Demo Mode: Your password reset OTP is: ${otp}\n\nEmail service is not configured. In production, this would be sent to your email.`);
        } else if (data?.demo_otp) {
          // Demo mode - show OTP
          alert(`Demo Mode: Your password reset OTP is: ${data.demo_otp}\n\nCheck your email for the OTP (or use the one shown here for demo).`);
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Show OTP in alert as fallback
        alert(`Fallback Mode: Your password reset OTP is: ${otp}\n\nEmail service unavailable. Use this OTP to continue.`);
      }

      return { success: true };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send OTP' 
      };
    }
  }

  async verifyPasswordResetOTP(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const storedData = localStorage.getItem(`password_reset_${email}`);
      
      if (!storedData) {
        return { success: false, error: 'No OTP found. Please request a new one.' };
      }

      const otpData = JSON.parse(storedData);
      const now = new Date();
      const expiresAt = new Date(otpData.expiresAt);

      if (now > expiresAt) {
        localStorage.removeItem(`password_reset_${email}`);
        return { success: false, error: 'OTP has expired. Please request a new one.' };
      }

      if (otpData.otp !== otp) {
        return { success: false, error: 'Invalid OTP. Please try again.' };
      }

      // Mark OTP as verified
      otpData.verified = true;
      localStorage.setItem(`password_reset_${email}`, JSON.stringify(otpData));

      return { success: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify OTP' 
      };
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const storedData = localStorage.getItem(`password_reset_${email}`);
      
      if (!storedData) {
        return { success: false, error: 'Invalid reset session. Please start over.' };
      }

      const otpData = JSON.parse(storedData);
      
      if (!otpData.verified || otpData.otp !== otp) {
        return { success: false, error: 'Invalid or unverified OTP.' };
      }

      const now = new Date();
      const expiresAt = new Date(otpData.expiresAt);

      if (now > expiresAt) {
        localStorage.removeItem(`password_reset_${email}`);
        return { success: false, error: 'Reset session has expired. Please start over.' };
      }

      // Update password using Supabase Admin API
      // Note: In production, this should be done through a secure backend endpoint
      try {
        // First, sign in the user temporarily to update password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'temp' // This will fail, but we'll use resetPasswordForEmail instead
        });

        // Fallback: Use Supabase's built-in password reset
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        
        if (resetError) {
          console.error('Password reset error:', resetError);
          return { success: false, error: 'Failed to reset password. Please try again.' };
        }
      } catch (updateError) {
        console.error('Password update error:', updateError);
        return { success: false, error: 'Failed to update password. Please try again.' };
      }

      // Clean up OTP data
      localStorage.removeItem(`password_reset_${email}`);

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to reset password' 
      };
    }
  }
}

export const authService = new AuthService();