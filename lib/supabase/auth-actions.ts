'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from './server';
import { encodedRedirect } from '../utils/auth-utils';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nextUrl = (formData.get('next') as string) || '/';

  const supabase = await createClient();

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

export async function signOutAction() {
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut({ scope: 'global' });

  // Revalidate all paths to ensure the UI updates
  revalidatePath('/', 'layout');

  // Redirect to login page after sign out
  redirect('/auth/login');
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect('error', '/auth/signup', error.message);
  }

  revalidatePath('/', 'layout');
  return encodedRedirect(
    'success',
    '/auth/login',
    'Check your email for the confirmation link',
  );
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) {
    return encodedRedirect('error', '/auth/reset-password', error.message);
  }

  return encodedRedirect(
    'success',
    '/auth/login',
    'Password reset instructions sent to your email',
  );
}

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return encodedRedirect('error', '/auth/update-password', error.message);
  }

  revalidatePath('/', 'layout');
  return encodedRedirect(
    'success',
    '/auth/login',
    'Password updated successfully',
  );
}
