
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, User, Shield, Crown, Mail } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'pro' | 'subscribed' | 'free';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

interface UserRowProps {
  user: UserData;
  onRoleChange?: (userId: string, newRole: string) => void;
  onToggleStatus?: (userId: string) => void;
  onSendEmail?: (userId: string) => void;
}

const UserRow = ({ user, onRoleChange, onToggleStatus, onSendEmail }: UserRowProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'pro':
        return 'default';
      case 'subscribed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'pro':
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{user.email}</p>
            <p className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</p>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3">
        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
          {getRoleIcon(user.role)}
          <span className="capitalize">{user.role}</span>
        </Badge>
      </td>
      
      <td className="px-4 py-3">
        <span className="text-sm">{formatDate(user.createdAt)}</span>
      </td>
      
      <td className="px-4 py-3">
        <span className="text-sm">
          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
        </span>
      </td>
      
      <td className="px-4 py-3">
        <Badge variant={user.isActive ? 'default' : 'secondary'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {onRoleChange && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Change Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['admin', 'pro', 'subscribed', 'free'].map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => onRoleChange(user.id, role)}
                      disabled={user.role === role}
                    >
                      {getRoleIcon(role)}
                      <span className="ml-2 capitalize">{role}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            
            {onSendEmail && (
              <DropdownMenuItem onClick={() => onSendEmail(user.id)}>
                <Mail className="h-4 w-4 mr-2" />
                <span>Send Email</span>
              </DropdownMenuItem>
            )}
            
            {onToggleStatus && (
              <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                <User className="h-4 w-4 mr-2" />
                <span>{user.isActive ? 'Deactivate' : 'Activate'}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default UserRow;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
