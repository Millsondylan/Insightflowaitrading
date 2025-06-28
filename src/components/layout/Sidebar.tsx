import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, BookOpen, Book, Wallet, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { path: '/strategy', icon: Brain, label: 'Strategy', accessLevel: 'pro' },
  { path: '/journal', icon: BookOpen, label: 'Journal', accessLevel: 'pro' },
  { path: '/academy', icon: Book, label: 'Academy', accessLevel: null },
  { path: '/wallet', icon: Wallet, label: 'Wallet', accessLevel: null },
  { path: '/admin', icon: Shield, label: 'Admin', accessLevel: 'admin' },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { isAdmin, hasProAccess } = useAuth();

  const hasAccess = (accessLevel: string | null) => {
    if (!accessLevel) return true;
    if (accessLevel === 'admin') return isAdmin;
    if (accessLevel === 'pro') return hasProAccess;
    return false;
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-background-overlay backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full z-50 transition-all duration-300
        ${isExpanded ? 'w-64' : 'w-16'}
        md:w-64 md:relative
        bg-background-glass border-r border-border-primary
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <Link 
            to="/" 
            className={`text-xl font-bold text-text-accent transition-opacity ${
              isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'
            }`}
          >
            InsightFlow
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-background-interactive text-text-secondary hover:text-text-primary transition-colors md:hidden"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              if (!hasAccess(item.accessLevel)) return null;

              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${active 
                        ? 'bg-brand-accent/20 text-text-accent shadow-lg shadow-brand-accent/20' 
                        : 'text-text-secondary hover:bg-background-interactive hover:text-text-primary'
                      }
                    `}
                    onClick={() => {
                      if (window.innerWidth < 768) setIsExpanded(false);
                    }}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className={`
                      transition-opacity font-medium
                      ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Tooltip for collapsed state */}
                    <div className={`
                      absolute left-16 px-2 py-1 bg-background-secondary text-text-primary text-sm rounded
                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                      ${isExpanded ? 'md:hidden' : 'hidden md:block'}
                    `}>
                      {item.label}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-primary">
          <div className={`
            text-xs text-text-muted transition-opacity
            ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}
          `}>
            © 2024 InsightFlow
          </div>
        </div>
      </div>

      {/* Mobile toggle button when collapsed */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-30 p-2 bg-background-glass backdrop-blur-md rounded-lg border border-border-interactive text-text-primary md:hidden"
        >
          <Menu size={20} />
        </button>
      )}
    </>
  );
}
