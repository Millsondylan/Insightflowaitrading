import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  rightColumn?: ReactNode;
}

export default function AppLayout({ rightColumn }: AppLayoutProps) {
  return (
    <div className="bg-background-primary text-text-primary min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Outlet />
              </div>
              {rightColumn && <div className="lg:col-span-1">{rightColumn}</div>}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
