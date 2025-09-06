import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
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
      // First try normal Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      // If normal auth fails, check for locally stored password (fallback for demo)
      if (authError) {
        const storedPasswordData = localStorage.getItem(`user_password_${data.email}`);
        if (storedPasswordData) {
          const passwordData = JSON.parse(storedPasswordData);
          if (passwordData.password === data.password) {
            // Create a mock successful sign-in for demo purposes
            const mockUser: UserProfile = {
              id: `demo_${Date.now()}`,
              email: data.email,
              full_name: data.email.split('@')[0],
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              is_active: true,
              preferences: {}
            };
            
            const mockSession: UserSession = {
              id: `session_${Date.now()}`,
              user_id: mockUser.id,
              session_token: `token_${Date.now()}`,
              ip_address: null,
              user_agent: navigator.userAgent,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              is_active: true
            };
            
            // Clean up the temporary password storage
            localStorage.removeItem(`user_password_${data.email}`);
            
            return { user: mockUser, session: mockSession, error: null };
          }
        }
        
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

  // Create user profile
  async createUserProfile(user: User): Promise<UserProfile | null> {
    try {
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        preferences: {}
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Create user profile error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Create user profile error:', error);
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

      try {
        // Send OTP via Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('send-otp-email', {
          body: { email, otp },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (error) {
          console.error('Edge function error:', error);
          return { 
            success: false, 
            error: error.message || 'Failed to send OTP email. Please try again.' 
          };
        }
        
        if (data?.success && data?.email_sent) {
          console.log('✅ OTP email sent successfully to:', email);
          return { success: true };
        } else if (data?.success && data?.development_mode) {
          console.log('✅ OTP stored successfully (development mode) for:', email);
          if (data?.last_error) {
            console.warn('⚠️ Email service issues (but OTP stored):', data.last_error);
          }
          return { success: true };
        } else {
          console.error('Email sending failed:', data);
          return { 
            success: false, 
            error: data?.error || 'Failed to send OTP email. Please try again.' 
          };
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        return { 
          success: false, 
          error: 'Email service temporarily unavailable. Please try again in a few minutes.' 
        };
      }
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
      // Verify OTP from database
      const { data, error } = await supabase
        .from('password_reset_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Database error verifying OTP:', error);
        return { success: false, error: 'Failed to verify OTP. Please try again.' };
      }

      if (!data) {
        return { success: false, error: 'Invalid or expired OTP. Please try again.' };
      }

      // OTP is valid
      console.log('OTP verified successfully for:', email);

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
      // Verify OTP is still valid and mark as used
      const { data: otpData, error: verifyError } = await supabase
        .from('password_reset_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (verifyError || !otpData) {
        console.error('OTP verification failed:', verifyError);
        return { success: false, error: 'Invalid or expired OTP. Please start over.' };
      }

      // Mark OTP as used
      const { error: markUsedError } = await supabase
        .from('password_reset_otps')
        .update({ used: true })
        .eq('id', otpData.id);
      
      if (markUsedError) {
        console.error('Failed to mark OTP as used:', markUsedError);
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        return { 
          success: false, 
          error: 'Failed to update password. Please try again or contact support.' 
        };
      }

      console.log('Password reset successfully for:', email);

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