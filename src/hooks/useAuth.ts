import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { UserProfile } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await authService.supabase.auth.getSession();
        if (session?.user) {
          // Create a basic user profile from auth data
          const basicProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_active: true,
            preferences: {}
          };
          setUser(basicProfile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Create a basic user profile from auth data
        const basicProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          created_at: session.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          is_active: true,
          preferences: {}
        };
        setUser(basicProfile);
      } else {
        setUser(null);
      }
      setError(null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signUp({ email, password, full_name: fullName });
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      // Create basic profile for immediate use
      const basicProfile: UserProfile = {
        id: result.user?.id || '',
        email: email,
        full_name: fullName || email.split('@')[0],
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        preferences: {}
      };
      setUser(basicProfile);
      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signIn({ email, password });
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      // Create basic profile for immediate use
      const basicProfile: UserProfile = {
        id: result.user?.id || '',
        email: email,
        full_name: result.user?.full_name || email.split('@')[0],
        avatar_url: result.user?.avatar_url || null,
        created_at: result.user?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        preferences: {}
      };
      setUser(basicProfile);
      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signin failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    
    try {
      const result = await authService.signOut();
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      setUser(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setError(null);
    
    try {
      const updatedUser = await authService.updateUserProfile(user.id, updates);
      
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'Failed to update profile' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  };
};