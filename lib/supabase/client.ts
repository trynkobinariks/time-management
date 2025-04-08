import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './schema';

export type TypedSupabaseClient = SupabaseClient<Database, 'public'>;

export const createClient = (): TypedSupabaseClient => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      'Missing env variables: NEXT_PUBLIC_SUPABASE_URL or ANON_KEY',
    );
  }
  return createBrowserClient<Database, 'public'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      db: {
        schema: 'public',
      },
    },
  );
};
