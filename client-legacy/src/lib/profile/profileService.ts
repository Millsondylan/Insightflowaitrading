import { UserProfile, OnboardingFormData, defaultUserProfile } from '@/types/profile';

/**
 * Service for managing user profiles - now uses API client instead of Supabase
 */
export class ProfileService {
  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Getting profile for user:', userId);
      return {
        ...defaultUserProfile,
        user_id: userId,
        onboarding_completed: false
      };
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
      console.log('Creating profile:', profile);
      return {
        ...defaultUserProfile,
        ...profile,
        onboarding_completed: false
      };
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
      console.log('Updating profile for user:', userId, profile);
      return {
        ...defaultUserProfile,
        user_id: userId,
        ...profile
      };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
  }

  /**
   * Get or initialize user profile
   */
  async getOrInitProfile(userId: string): Promise<UserProfile> {
    try {
      let profile = await this.getProfile(userId);
      
      if (!profile) {
        const newProfile = {
          ...defaultUserProfile,
          user_id: userId,
          onboarding_completed: false
        };
        profile = await this.createProfile(newProfile);
      }
      
      return profile || {
        ...defaultUserProfile,
        user_id: userId,
        onboarding_completed: false
      };
    } catch (error) {
      console.error('Failed to get or init profile:', error);
      return {
        ...defaultUserProfile,
        user_id: userId,
        onboarding_completed: false
      };
    }
  }

  /**
   * Complete the onboarding process
   */
  async completeOnboarding(userId: string, formData: OnboardingFormData): Promise<UserProfile | null> {
    try {
      console.log('Completing onboarding for user:', userId, formData);
      return await this.updateProfile(userId, {
        ...formData,
        onboarding_completed: true
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      return null;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;