
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full z-50 transition-all duration-300
        ${isExpanded ? 'w-64' : 'w-16'}
        md:w-64 md:relative
        bg-black/20 backdrop-blur-md border-r border-white/10
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link 
            to="/" 
            className={`text-xl font-bold text-cyan-400 transition-opacity ${
              isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'
            }`}
          >
            Insight Flow
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
          >
            {isExpanded ? <span style={{fontSize: '16px'}}>❌</span> : <span style={{fontSize: '16px'}}>☰</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const canAccess = hasAccess(item.accessLevel);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${active 
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20' 
                        : canAccess
                        ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                        : 'text-gray-500 cursor-not-allowed opacity-50'
                      }
                    `}
                    onClick={(e) => {
                      if (!canAccess) e.preventDefault();
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
                      absolute left-16 px-2 py-1 bg-black/80 text-white text-sm rounded
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
        <div className="p-4 border-t border-white/10">
          <div className={`
            text-xs text-gray-400 transition-opacity
            ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}
          `}>
            © 2024 Insight Flow
          </div>
        </div>
      </div>

      {/* Mobile toggle button when collapsed */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-30 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white md:hidden"
        >
          <span style={{fontSize: '16px'}}>☰</span>
        </button>
      )}
    </>
  );
}
