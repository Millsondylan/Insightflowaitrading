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

const UserRow: React.FC<userrowprops  > = ({ user, onUserUpdate }) => {
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
    <tr className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center">
          <span 
            className={cn(
              'font-mono text-sm cursor-pointer hover:text-blue-400 transition-colors',
              user.role === 'Admin' && 'text-violet-300',
              user.role === 'Expired' && 'text-gray-400'
            )}
            onClick={handleCopyAddress}
            title="Click to copy"
          >
            {formatAddress(user.address)}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-gray-400">
        {formatDate(user.created_at)}
      </td>

      <td className="px-4 py-3">
        <span className="text-sm">
          {user.subscription_tier || '-'}
        </span>
      </td>

      <td className="px-4 py-3">
        <rolebadge  >
      </td>

      <td className="px-4 py-3">
        <dropdownmenu  >
          <dropdownmenutrigger  >
            <button variant="ghost" size="icon" >
              <morehorizontal  >
            </Button>
          </DropdownMenuTrigger>
          <dropdownmenucontent align="end" style={{ border: "1px solid #E5E7EB" }}>
            <dropdownmenulabel  >User Actions</DropdownMenuLabel>
            <dropdownmenuseparator  >
            
            <dropdownmenusub  >
              <dropdownmenusubtrigger  >
                <usercog  >
                <span>Change Role</span>
              </DropdownMenuSubTrigger>
              <dropdownmenuportal  >
                <dropdownmenusubcontent  style={{ border: "1px solid #E5E7EB" }}>
                  <dropdownmenuitem  > handleRoleChange('Admin')}
                    className="cursor-pointer text-violet-300 hover:bg-violet-900/30"
                  >
                    Admin
                  </DropdownMenuItem>
                  <dropdownmenuitem  > handleRoleChange('User')}
                    className="cursor-pointer text-green-300 hover:bg-green-900/30"
                  >
                    User
                  </DropdownMenuItem>
                  <dropdownmenuitem  > handleRoleChange('Trial')}
                    className="cursor-pointer text-yellow-300 hover:bg-yellow-900/30"
                  >
                    Trial
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <dropdownmenuitem  >
              <copy  >
              <span>Copy Address</span>
            </DropdownMenuItem>
            
            <dropdownmenuitem  >
              <eye  >
              <span>View Details</span>
            </DropdownMenuItem>
            
            <dropdownmenuseparator  >
            
            <dropdownmenuitem  >
              <xcircle  >
              <span>Revoke Access</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default UserRow; 
export const lovable = { component: true };
