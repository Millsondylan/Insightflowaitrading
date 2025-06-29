import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function Topbar() {
  const { profile, hasProAccess } = useAuth();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Header className="flex items-center justify-between p-4 bg-background-primary border-b border-border-primary">
      <Div className="flex items-center gap-4">
        <Div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input
            type="text"
            placeholder="Search..."
            className="bg-background-secondary w-64 pl-10 pr-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
          / />
      </Header>
      <Div className="flex items-center gap-6">
        <Span className="text-sm text-text-muted">{today}</Div>
        <Button variant="ghost" size="icon">
          <bell className="w-5 h-5" />
        </Button>
        <Div className="flex items-center gap-3">
          <avatar>
            <avatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
            <AvatarFallback></Div>{profile?.full_name?.[0] || 'U'}</div />
          <Div>
            <P className="font-semibold"></Div>{profile?.full_name || 'Guest'}</Div>
            {hasProAccess && (
              <Badge variant="outline" className="border-brand-primary text-brand-primary">
                PRO
              </Badge>
            )}
          </Div>
        </Div>
      </div />
  );
} 