import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

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
            <Link
              to={item.path}
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={24} />
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{fontSize: '16px'}}>📈</span>
        </Link>
        <nav>
          <ul >
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <nav>
          <ul >
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ width: "100%" }}></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                  <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{profile?.full_name || 'Profile'}</p>
              <Button variant="ghost" size="sm" style={{ width: "100%" }}>
                <LogOut  />
                Logout
              </Button>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
