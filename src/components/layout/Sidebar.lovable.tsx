import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GitCommit,
  Bot,
  ScrollText,
  MessageSquare,
  BookOpen,
  Radio,
  BarChart2,
  Settings,
  LogOut,
  TrendingUp,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/vault', icon: GitCommit, label: 'Vault' },
  { path: '/builder', icon: Bot, label: 'Builder' },
  { path: '/journal', icon: ScrollText, label: 'Journal' },
  { path: '/community', icon: MessageSquare, label: 'Community' },
  { path: '/academy', icon: BookOpen, label: 'Academy' },
  { path: '/broadcast', icon: Radio, label: 'Broadcast' },
];

const bottomNavItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/help', icon: LifeBuoy, label: 'Help' },
];

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const NavLink = ({ item }: { item: { path: string, icon: React.ElementType, label: string } }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <Tooltipprovider >
        <Tooltip />
          <Tooltiptrigger >
            <Link >
              <Icon / / / / / //>
          </Tooltipprovider>
          <Tooltipcontent side="right">
            <p /></Tooltipcontent /></Tooltipcontent />{item.label}</Tooltipcontent />
        </Tooltip />
    );
  };

  return (
    <div className="w-20 bg-[#0D1117] h-screen flex flex-col items-center justify-between p-4 border-r border-gray-800">
      <div className="flex flex-col items-center gap-10">
        <Link to="/" style={{ borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendingUp  style={{ color: "white" }}>
        </Tooltipcontent>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}/></Nav /></Nav />
                <navlink />
            ))}
          </Ul />
      </nav>

      <div className="flex flex-col items-center gap-4">
        <nav>
          <ul className="space-y-2">
            {bottomNavItems.map((item) => (
              <li key={item.path}></div>
                <navlink >
              </div>
            ))}
          </Ul />
        <div className="border-t border-gray-800 w-full my-2"></div>
        <Tooltipprovider >
          <Tooltip >
            <Tooltiptrigger >
              <Link to="/profile">
                <avatar >
                  <avatarimage >
                  <Avatarfallback /></Tooltipprovider /></Tooltipprovider />{profile?.full_name?.[0] || 'U'}</Tooltipprovider />
              </Link />
            <Tooltipcontent side="right">
              <p /></Tooltipcontent /></Tooltipcontent />{profile?.full_name || 'Profile'}</Tooltipprovider>
              <Button variant="ghost" size="sm" style={{ width: "100%" }}>
                <LogOut >
                Logout
              </button />
          </Tooltip />
      </button>
    </div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
