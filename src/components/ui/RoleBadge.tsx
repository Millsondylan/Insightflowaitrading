import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type UserRole = 'Admin' | 'User' | 'Trial' | 'Expired';

interface RoleBadgeProps {
  role: UserRole;
  showTooltip?: boolean;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps></RoleBadgeProps> = ({ 
  role, 
  showTooltip = true,
  className 
}) => {
  // Determine class based on role
  const roleStyles = {
    Admin: 'bg-violet-950/40 text-violet-200 border-violet-600 shadow-violet-900/20',
    User: 'bg-green-950/40 text-green-200 border-green-600 shadow-green-900/20',
    Trial: 'bg-yellow-950/40 text-yellow-200 border-yellow-600 shadow-yellow-900/20',
    Expired: 'bg-red-950/40 text-red-200 border-red-600 shadow-red-900/20',
  };

  // Determine glow effect based on role
  const glowEffect = {
    Admin: 'after:bg-violet-600/40',
    User: 'after:bg-green-600/40',
    Trial: 'after:bg-yellow-600/40',
    Expired: 'after:bg-red-600/40',
  };

  // Determine tooltip content based on role
  const tooltipContent = {
    Admin: 'Full administrative access',
    User: 'Paid subscriber with full features',
    Trial: 'Limited time access to basic features',
    Expired: 'No active subscription or trial',
  };

  // Default to User style if invalid role
  const safeRole = Object.keys(roleStyles).includes(role) ? role : 'User';
  const safeRoleStyles = roleStyles[safeRole as UserRole];
  const safeGlowEffect = glowEffect[safeRole as UserRole];

  const badge = (
    <Span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        'relative overflow-hidden',
        'after:absolute after:inset-0 after:rounded-full after:opacity-50 after:blur-sm after:-z-10',
        safeRoleStyles,
        safeGlowEffect,
        className
      )}></Span>
      {role}
    </Span>
  );

  // If tooltip is enabled, wrap badge in tooltip
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild></TooltipProvider></TooltipProvider>
            {badge}
          </TooltipProvider>
          <TooltipContent>
            <P className="text-xs"></TooltipContent></TooltipContent>{tooltipContent[safeRole as UserRole]}</TooltipContent>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Otherwise, return just the badge
  return badge;
};

export default RoleBadge;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 