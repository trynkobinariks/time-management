import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a browser client safely
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Export a function to get the client that ensures it's only used on the client side
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | null = null;

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    throw new Error('getSupabase should only be called on the client side');
  }
  
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient();
  }
  
  return browserClient;
};

// For backward compatibility in existing code
export const supabase = typeof window !== 'undefined'
  ? getSupabase()
  : null;

export type SupabaseUser = {
  id: string;
  email?: string;
  created_at: string;
};

export type AuthError = {
  message: string;
};
