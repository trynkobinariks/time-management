import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/lib/ProjectContext";
import { WelcomeProvider } from "@/lib/WelcomeContext";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Time Management",
  description: "Track and manage your time effectively",
};

// Auth routes will use their own layout defined in auth/layout.tsx
// This root layout will only be used for non-auth routes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <ProjectProvider>
          <WelcomeProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </WelcomeProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
