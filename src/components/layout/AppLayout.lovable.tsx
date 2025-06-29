import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: ReactNode;
  rightColumn?: ReactNode;
}

export default function AppLayout({ children, rightColumn }: AppLayoutProps) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Topbar />
          <main style={{ padding: "24px" }}>
            <div >
              <div >{children}</div>
              {rightColumn && <div >{rightColumn}</div>}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
