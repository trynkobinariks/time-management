import { getSupabase } from './supabase';

// Make sure all auth functions are only called on the client side
const ensureClientSide = () => {
  if (typeof window === 'undefined') {
    throw new Error('Auth functions should only be called on the client side');
  }
  return getSupabase();
};

export async function signUp(email: string, password: string) {
  const supabase = ensureClientSide();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Signup error:', error);
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = ensureClientSide();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Sign in exception:', err);
    // Enhanced error handling with more specific messages
    if (err instanceof Error) {
      if (err.message === 'Failed to fetch') {
        console.error(
          'Network error connecting to Supabase. Check your internet connection and Supabase URL.',
        );
        throw new Error(
          'Network error connecting to authentication service. Please check your internet connection and try again.',
        );
      }
    }
    throw err;
  }
}

export async function signOut() {
  const supabase = ensureClientSide();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  const supabase = ensureClientSide();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

export async function updatePassword(password: string) {
  const supabase = ensureClientSide();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error('Update password error:', error);
    throw error;
  }
}

export async function getSession() {
  const supabase = ensureClientSide();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
    throw error;
  }
  return session;
}

export async function getUser() {
  const supabase = ensureClientSide();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error('Get user error:', error);
    throw error;
  }
  return user;
}
