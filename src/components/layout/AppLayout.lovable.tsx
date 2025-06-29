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
    <Div className="bg-background-primary text-text-primary min-h-screen">
      <Div className="flex">
        <Sidebar >
        <Div className="flex-1 flex flex-col">
          <Topbar  /></Div></Div>
          <Main className="flex-1 p-6 md:p-8">
            <Div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Div className="lg:col-span-2">{children}</Main>
              {rightColumn && <Div className="lg:col-span-1">{rightColumn}</Div>}
            </Div>
          </Main>
        </Div>
      </Div>
      <Toaster ></Toaster>
    </Div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
