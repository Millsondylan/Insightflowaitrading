import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/db/supabase-client';
import { useAuth } from './use-auth';

interface UserPreferences {
  language: string;
  theme: string;
  push_enabled: boolean;
}

export function useUserPreferences() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    theme: 'dark',
    push_enabled: true
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user preferences
  useEffect(() => {
    async function fetchPreferences() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setPreferences(data);
          // Update i18n language if it's different
          if (data.language && i18n.language !== data.language) {
            i18n.changeLanguage(data.language);
          }
        }
      } catch (err) {
        console.error('Error fetching user preferences:', err);
        setError('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [user, i18n]);

  // Update user preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Update language in i18n if changed
      if (newPreferences.language && newPreferences.language !== preferences.language) {
        i18n.changeLanguage(newPreferences.language);
      }

      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      const { error } = await supabase
        .from('user_preferences')
        .update(newPreferences)
        .eq('user_id', user.id);

      if (error) throw error;
      
      return updatedPreferences;
    } catch (err) {
      console.error('Error updating user preferences:', err);
      setError('Failed to update preferences');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update language
  const changeLanguage = async (language: string) => {
    return await updatePreferences({ language });
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    changeLanguage
  };
} 
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 
