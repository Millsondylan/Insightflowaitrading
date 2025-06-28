
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="flex min-h-screen">
        <Sidebar />
        
        {/* Main content */}
        <main className="flex-1 md:ml-0 transition-all duration-300">
          <div className="min-h-screen p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
