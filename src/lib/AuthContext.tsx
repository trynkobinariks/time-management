'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, SupabaseUser, AuthError } from './supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ user: SupabaseUser | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: SupabaseUser | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || undefined,
          created_at: session.user.created_at,
        });
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || undefined,
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email || undefined,
            created_at: data.user.created_at,
          },
          error: null,
        };
      }

      return { user: null, error: null };
    } catch (error) {
      return {
        user: null,
        error: { message: 'An unexpected error occurred' },
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email || undefined,
            created_at: data.user.created_at,
          },
          error: null,
        };
      }

      return { user: null, error: null };
    } catch (error) {
      return {
        user: null,
        error: { message: 'An unexpected error occurred' },
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 