'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from './supabase-server';
import { encodedRedirect } from './auth-utils';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nextUrl = (formData.get('next') as string) || '/app';

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/auth/login', error.message);
  }

  revalidatePath('/', 'layout');
  return redirect(nextUrl);
}
