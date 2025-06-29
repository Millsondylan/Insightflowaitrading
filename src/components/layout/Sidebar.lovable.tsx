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
        <Tooltip  />
          <Tooltiptrigger  >
            <Link >
              <Icon />
            </Link>
          </Tooltiptrigger>
          <Tooltipcontent side="right" >
            <p>{item.label}</p>
          </Tooltipcontent>
        </Tooltip>
      </Tooltipprovider>
    );
  };

  return (
    <div className="w-20 bg-[#0D1117] h-screen flex flex-col items-center justify-between p-4 border-r border-gray-800">
      <div className="flex flex-col items-center gap-10">
        <Link to="/" style={{ borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <trendingup  style={{ color: "white" }}>
        </Link>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <navlink  >
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
                <navlink  >
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-800 w-full my-2"></div>
        <Tooltipprovider  >
          <Tooltip  >
            <Tooltiptrigger  >
              <Link to="/profile" >
                <avatar  >
                  <avatarimage  >
                  <avatarfallback  >{profile?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            </Tooltiptrigger>
            <Tooltipcontent side="right" >
              <p>{profile?.full_name || 'Profile'}</p>
              <Button variant="ghost" size="sm" style={{ width: "100%" }}>
                <logout  >
                Logout
              </Button>
            </Tooltipcontent>
          </Tooltip>
        </Tooltipprovider>
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
