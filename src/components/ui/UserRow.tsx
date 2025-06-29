import React, { useState } from 'react';
import { User } from '@/lib/admin/fetchUsers';
import { updateUserRole, revokeUserAccess, UserRole } from '@/lib/admin/updateUserRole';
import RoleBadge from './RoleBadge';
import { MoreHorizontal, Copy, UserCog, XCircle, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface UserRowProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onUserUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Format address for display (shorten it)
  const formatAddress = (address: string) => {
    if (!address) return '';
    // Keep first 6 and last 4 characters
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle role change
  const handleRoleChange = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const result = await updateUserRole({
        userId: user.id,
        role: newRole
      });

      if (result.success) {
        toast({
          title: 'Role Updated',
          description: result.message,
          variant: 'default'
        });

        // Update the user in the parent component if callback provided
        if (onUserUpdate) {
          onUserUpdate({
            ...user,
            role: newRole
          });
        }
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
      console.error('Error updating role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user access revocation
  const handleRevokeAccess = async () => {
    setIsLoading(true);
    try {
      const result = await revokeUserAccess(user.id);

      if (result.success) {
        toast({
          title: 'Access Revoked',
          description: result.message,
          variant: 'default'
        });

        // Update the user in the parent component if callback provided
        if (onUserUpdate) {
          onUserUpdate({
            ...user,
            role: 'Expired'
          });
        }
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke user access',
        variant: 'destructive'
      });
      console.error('Error revoking access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copy address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.address)
      .then(() => {
        toast({
          title: 'Address Copied',
          description: 'Wallet address copied to clipboard',
          variant: 'default'
        });
      })
      .catch(err => {
        console.error('Failed to copy address:', err);
        toast({
          title: 'Error',
          description: 'Failed to copy address',
          variant: 'destructive'
        });
      });
  };

  return (
    <Tr className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
      <Td className="px-4 py-3">
        <Div className="flex items-center">
          <Span className={cn(
              'font-mono text-sm cursor-pointer hover:text-blue-400 transition-colors',
              user.role === 'Admin' && 'text-violet-300',
              user.role === 'Expired' && 'text-gray-400'
            )}
            onClick={handleCopyAddress}
            title="Click to copy"
     >
            {formatAddress(user.address)}
          </UserRowProps>
        </Div>
      </Td>

      <Td className="px-4 py-3 text-sm text-gray-400">
        {formatDate(user.created_at)}
      </Td>

      <Td className="px-4 py-3">
        <Span className="text-sm">
          {user.subscription_tier || '-'}
        </Td>
      </Td>

      <Td className="px-4 py-3">
        <RoleBadge role={user.role as UserRole} />
      </Td>

      <Td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading} />
            <Button variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full p-0"
            />
              <MoreHorizontal className="h-4 w-4" />
            </Td>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-900 border border-gray-800" />
            <DropdownMenuLabel>User Actions</DropdownMenuContent>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="mr-2 h-4 w-4" />
                <Span>Change Role</DropdownMenuSeparator>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-gray-900 border border-gray-800" />
                  <DropdownMenuItem onClick={() = /> handleRoleChange('Admin')}
                    className="cursor-pointer text-violet-300 hover:bg-violet-900/30"
                  >
                    Admin
                  </DropdownMenuPortal>
                  <DropdownMenuItem onClick={() = /> handleRoleChange('User')}
                    className="cursor-pointer text-green-300 hover:bg-green-900/30"
                  >
                    User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() = /> handleRoleChange('Trial')}
                    className="cursor-pointer text-yellow-300 hover:bg-yellow-900/30"
                  >
                    Trial
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer" />
              <Copy className="mr-2 h-4 w-4" />
              <Span>Copy Address</DropdownMenuItem>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer" />
              <Eye className="mr-2 h-4 w-4" />
              <Span>View Details</DropdownMenuItem>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleRevokeAccess}
              className="cursor-pointer text-red-400 hover:bg-red-900/30"
         >
              <XCircle className="mr-2 h-4 w-4" /></DropdownMenuSeparator></DropdownMenuSeparator>
              <Span>Revoke Access</Span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Td>
    </Tr>
  );
};

export default UserRow;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 