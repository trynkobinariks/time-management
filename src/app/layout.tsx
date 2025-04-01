import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { WelcomeProvider } from "@/contexts/WelcomeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200`}>
        <LanguageProvider>
          <ProjectProvider>
            <WelcomeProvider>
              <div className="min-h-screen">
                <Header />
                <main>
                  {children}
                </main>
              </div>
            </WelcomeProvider>
          </ProjectProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
