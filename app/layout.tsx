import type { Metadata } from 'next';
import { Nunito_Sans, Open_Sans } from 'next/font/google';
import './globals.css';
import { ProjectProvider } from '../contexts/ProjectContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';
import Header from '../components/Header/Header';
import { createClient } from '@/lib/supabase/server';
import AuthLayoutWrapper from '@/components/AuthLayoutWrapper';
import { ThemeProvider } from '../contexts/ThemeProvider';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Voice Tracker',
  description: 'Track and manage your time effectively',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session directly without caching
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Add auth data to HTML as a data attribute for hydration
  const userData = user ? { id: user.id, email: user.email } : null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunitoSans.variable} ${openSans.variable}`}
      data-user={userData ? JSON.stringify(userData) : ''}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover"
        />
        {/* Add a script to ensure client has latest auth state */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (window.sessionStorage && window.location.pathname.indexOf('/auth/callback') === -1) {
                    sessionStorage.setItem('lastRefresh', Date.now().toString());
                  }
                } catch (e) {
                  console.error('Failed to set session data:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200 font-sans">
        <div className="min-h-screen flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageProvider>
              <ProjectProvider>
                <UserSettingsProvider>
                  <Header user={user} />
                  <div className="h-16" />
                  <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
                </UserSettingsProvider>
              </ProjectProvider>
            </LanguageProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
