import { supabase } from '@/lib/db/supabase-client';
import { UserProfile, OnboardingFormData, defaultUserProfile } from '@/types/profile';

/**
 * Service for managing user profiles
 */
export class ProfileService {
  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data || null;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }
  
  /**
   * Create a new user profile
   */
  async createProfile(profile: UserProfile): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .insert([profile])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to create profile:', error);
      return null;
    }
  }
  
  /**
   * Update an existing user profile
   */
  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .update(profile)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
  }
  
  /**
   * Complete the onboarding process
   */
  async completeOnboarding(userId: string, formData: OnboardingFormData): Promise<UserProfile | null> {
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profile')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      const profileData: UserProfile = {
        ...formData,
        user_id: userId,
        onboarding_completed: true
      };
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('user_profile')
          .update(profileData)
          .eq('user_id', userId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('user_profile')
          .insert([profileData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      // Call webhook to notify about onboarding completion
      try {
        await fetch('/api/onboarding-completed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            experience: formData.experience,
            tradingStyles: formData.style,
          }),
        });
      } catch (webhookError) {
        // Don't fail if webhook fails
        console.error('Failed to call onboarding webhook:', webhookError);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      return null;
    }
  }
  
  /**
   * Initialize a user profile with default values
   */
  async initializeProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profile: UserProfile = {
        ...defaultUserProfile,
        user_id: userId,
      };
      
      return await this.createProfile(profile);
    } catch (error) {
      console.error('Failed to initialize profile:', error);
      return null;
    }
  }
  
  /**
   * Get or initialize a user profile
   */
  async getOrInitProfile(userId: string): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    
    if (profile) {
      return profile;
    }
    
    const newProfile = await this.initializeProfile(userId);
    return newProfile || { ...defaultUserProfile, user_id: userId };
  }
}

export const profileService = new ProfileService();
export default profileService; 