
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Shield, User, Zap } from 'lucide-react';

interface RoleBadgeProps {
  role: 'admin' | 'pro' | 'subscribed' | 'free';
  showIcon?: boolean;
  showTooltip?: boolean;
}

const RoleBadge = ({ role, showIcon = true, showTooltip = true }: RoleBadgeProps) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          variant: 'destructive' as const,
          icon: <Crown className="h-3 w-3" />,
          description: 'Full system access and management privileges'
        };
      case 'pro':
        return {
          label: 'Pro',
          variant: 'default' as const,
          icon: <Zap className="h-3 w-3" />,
          description: 'Access to all premium features and advanced tools'
        };
      case 'subscribed':
        return {
          label: 'Premium',
          variant: 'secondary' as const,
          icon: <Shield className="h-3 w-3" />,
          description: 'Access to premium features and content'
        };
      case 'free':
        return {
          label: 'Free',
          variant: 'outline' as const,
          icon: <User className="h-3 w-3" />,
          description: 'Basic access with limited features'
        };
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          icon: <User className="h-3 w-3" />,
          description: 'Unknown role'
        };
    }
  };

  const config = getRoleConfig(role);

  const badgeContent = (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {showIcon && config.icon}
      <span>{config.label}</span>
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RoleBadge;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
