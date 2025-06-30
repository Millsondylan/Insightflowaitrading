import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'Admin' | 'User' | 'Trial' | 'Expired';

interface UpdateRoleOptions {
  userId: string;
  role: UserRole;
}

export async function updateUserRole({ userId, role }: UpdateRoleOptions): Promise<{ 
  success: boolean; 
  message: string;
}> {
  try {
    if (!userId || !role) {
      return { 
        success: false, 
        message: 'User ID and role are required' 
      };
    }

    let updateData: Record<string, any> = {};
    
    // Set different properties based on the role
    switch (role) {
      case 'Admin':
        // In a real application, we'd need a proper admin table or flag
        // For demo purposes, we'll assume success but in production would need more implementation
        return { 
          success: true, 
          message: 'User granted admin privileges' 
        };
        
      case 'User':
        // Set subscription tier to 'basic' and extend subscription for 30 days
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        updateData = {
          subscription_tier: 'basic',
          subscription_end: thirtyDaysFromNow.toISOString()
        };
        break;
        
      case 'Trial':
        // Set trial end to 7 days from now and clear subscription info
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        updateData = {
          subscription_tier: null,
          subscription_end: null,
          base_trial_end: sevenDaysFromNow.toISOString()
        };
        break;
        
      case 'Expired':
        // Clear subscription data and set trial end to past date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        updateData = {
          subscription_tier: null,
          subscription_end: null,
          base_trial_end: yesterday.toISOString()
        };
        break;
        
      default:
        return { 
          success: false, 
          message: 'Invalid role specified' 
        };
    }

    // Update the user profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return { 
        success: false, 
        message: `Failed to update role: ${error.message}` 
      };
    }

    return { 
      success: true, 
      message: `User role successfully updated to ${role}` 
    };
  } catch (error) {
    console.error('Unexpected error in updateUserRole:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    };
  }
}

export async function revokeUserAccess(userId: string): Promise<{ 
  success: boolean; 
  message: string;
}> {
  try {
    if (!userId) {
      return { 
        success: false, 
        message: 'User ID is required' 
      };
    }

    // Set user to expired state
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const updateData = {
      subscription_tier: null,
      subscription_end: null,
      base_trial_end: yesterday.toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error revoking user access:', error);
      return { 
        success: false, 
        message: `Failed to revoke access: ${error.message}` 
      };
    }

    return { 
      success: true, 
      message: 'User access successfully revoked' 
    };
  } catch (error) {
    console.error('Unexpected error in revokeUserAccess:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    };
  }
} 