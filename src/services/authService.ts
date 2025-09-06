import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_login: string;
}

export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      // Explicitly create user profile
      if (data.user) {
        try {
          const { error: profileError } = await this.supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              is_active: true,
              last_login: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't throw here - allow signup to succeed even if profile creation fails
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError);
        }
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login
      if (data.user) {
        await this.updateLastLogin(data.user.id);
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        if (error.message === 'Auth session missing!') {
          return null;
        }
        throw error;
      }
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  private async updateLastLogin(userId: string) {
    try {
      await this.supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Update last login error:', error);
      // Don't throw - this is not critical
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();