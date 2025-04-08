import type { Metadata } from 'next';
import { Nunito_Sans, Open_Sans } from 'next/font/google';
import './globals.css';
import { ProjectProvider } from '../contexts/ProjectContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { HelpButton } from '../components/InfoHelp';
import { createClient } from '@/lib/supabase/server';
import SessionRefresh from '@/components/SessionRefresh';

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
  title: 'Time Management',
  description: 'Track and manage your time effectively',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session directly without caching
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunitoSans.variable} ${openSans.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200 font-sans">
        <LanguageProvider>
          <ProjectProvider>
            <div className="min-h-screen flex flex-col">
              <SessionRefresh />
              <Header session={session} />
              <div className="h-16" />
              <main className="flex-grow">{children}</main>
              <Footer appName="Voice Tracker" />
              <HelpButton />
            </div>
          </ProjectProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
