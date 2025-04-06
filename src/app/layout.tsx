import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { WelcomeProvider } from "@/contexts/WelcomeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header/Header";
import { AuthProvider } from '@/contexts/AuthContext';

// Primary font for body text - wider character width
const nunitoSans = Nunito_Sans({ 
  subsets: ["latin"],
  variable: '--font-nunito-sans',
  display: 'swap',
});

// Font for headings and UI elements - wider letter spacing
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Time Management",
  description: "Track and manage your time effectively",
};

// Auth routes will use their own layout defined in auth/layout.tsx
// This root layout will only be used for non-auth routes
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${nunitoSans.variable} ${openSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200 font-sans">
        <AuthProvider>
          <LanguageProvider>
            <ProjectProvider>
              <WelcomeProvider>
                <div className="min-h-[calc(100vh-65px)]">
                  <Header />
                  <div className="h-16" />
                  <main>
                    {children}
                  </main>
                </div>
              </WelcomeProvider>
            </ProjectProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
