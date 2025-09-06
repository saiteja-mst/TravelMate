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
        const { data: { session } } = await authService.supabase.auth.getSession();
        if (session?.user) {
          let userProfile = await authService.getUserProfile(session.user.id);
          if (!userProfile) {
            userProfile = await authService.createUserProfile(session.user);
          }
          setUser(userProfile);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Don't set error for auth check failures, just continue as unauthenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        let userProfile = await authService.getUserProfile(session.user.id);
        if (!userProfile) {
          userProfile = await authService.createUserProfile(session.user);
        }
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
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
      
      setUser(result.user);
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
      
      setUser(result.user);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setLoading(true);
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
    } finally {
      setLoading(false);
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