import { redirect } from 'next/navigation';

export function encodedRedirect(type: string, path: string, message: string) {
  const params = new URLSearchParams();
  if (type && message) {
    params.append(type, message);
  }

  const redirectPath = params.toString()
    ? `${path}?${params.toString()}`
    : path;

  return redirect(redirectPath);
}
