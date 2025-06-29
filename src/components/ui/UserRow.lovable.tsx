import React, { useState } from 'react';
import { User } from '@/lib/admin/fetchUsers';
import { updateUserRole, revokeUserAccess, UserRole } from '@/lib/admin/updateUserRole';
import RoleBadge from './RoleBadge';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface UserRowProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

const UserRow: React.FC<span style={{fontSize: '16px'}}>👤</span> = ({ user, onUserUpdate }) => {
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
    <tr >
      <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
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

      <td style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>
        {formatDate(user.created_at)}
      </td>

      <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <span >
          {user.subscription_tier || '-'}
        </span>
      </td>

      <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <RoleBadge role={user.role as UserRole} />
      </td>

      <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button 
              variant="ghost" 
              size="icon" 
              
            >
              <MoreHorizontal  />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ border: "1px solid #374151" }}>
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span style={{fontSize: '16px'}}>👤</span>
                <span>Change Role</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent style={{ border: "1px solid #374151" }}>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange('Admin')}
                    
                  >
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange('User')}
                    
                  >
                    User
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange('Trial')}
                    
                  >
                    Trial
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuItem onClick={handleCopyAddress} >
              <Copy  />
              <span>Copy Address</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem >
              <span style={{fontSize: '16px'}}>👁️</span>
              <span>View Details</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleRevokeAccess}
              
            >
              <span style={{fontSize: '16px'}}>❌</span>
              <span>Revoke Access</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default UserRow; 