'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import WelcomeManager from "@/components/WelcomeManager";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      {!isAuthPage && <WelcomeManager />}
      <main className={`flex-grow ${!isAuthPage ? 'py-6 pt-20' : ''}`}>
        <div className={`${!isAuthPage ? 'max-w-7xl mx-auto px-0 sm:px-6 lg:px-8' : ''}`}>
          {children}
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Project Hours Tracker | Roman Trynko | &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
} 
