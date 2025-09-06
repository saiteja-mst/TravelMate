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
}

export const authService = new AuthService();