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
    <header style={{ display: "flex", alignItems: "center", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div >
          <span style={{fontSize: '16px'}}>🔍</span>
          <input
            type="text"
            placeholder="Search..."
            style={{ border: "1px solid #374151" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span >{today}</span>
        <Button variant="ghost" size="icon">
          <Bell  />
        </Button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar>
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
            <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p >{profile?.full_name || 'Guest'}</p>
            {hasProAccess && (
              <Badge variant="outline" >
                PRO
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 