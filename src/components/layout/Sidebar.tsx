
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GitCommit,
  Bot,
  ScrollText,
  MessageSquare,
  BookOpen,
  Radio,
  Settings,
  LogOut,
  TrendingUp,
  LifeBuoy,
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={item.path}
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={24}/>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="w-20 bg-[#0D1117] h-screen flex flex-col items-center justify-between p-4 border-r border-gray-800">
      <div className="flex flex-col items-center gap-10">
        <Link to="/" className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white"/>
        </Link>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink item={item}/>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col items-center gap-4">
        <nav>
          <ul className="space-y-2">
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <NavLink item={item}/>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-800 w-full my-2"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'}/>
                  <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{profile?.full_name || 'Profile'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="ghost" size="sm" className="w-full mt-2 text-left justify-start">
          <LogOut className="w-4 h-4 mr-2"/>
          Logout
        </Button>
      </div>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
