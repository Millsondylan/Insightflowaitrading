import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function Topbar() {
  const { profile, hasProAccess } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between p-4 bg-background-primary border-b border-border-primary">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span style={{fontSize: '16px'}}>🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-background-secondary w-64 pl-10 pr-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-text-muted">{today}</span>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
            <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{profile?.full_name || 'Guest'}</p>
            {hasProAccess && (
              <Badge variant="outline" className="border-brand-primary text-brand-primary">
                PRO
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 