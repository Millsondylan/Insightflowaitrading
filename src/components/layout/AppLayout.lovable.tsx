import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
  rightColumn?: ReactNode;
}

export default function AppLayout({ children, rightColumn }: AppLayoutProps) {
  return (
    <div className="bg-background-primary text-text-primary min-h-screen">
      <div className="flex">
        <sidebar  >
        <div className="flex-1 flex flex-col">
          <topbar  >
          <main className="flex-1 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">{children}</div>
              {rightColumn && <div className="lg:col-span-1">{rightColumn}</div>}
            </div>
          </main>
        </div>
      </div>
      <toaster  >
    </div>
  );
}

export const lovable = { component: true };
