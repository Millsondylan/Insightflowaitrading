import { useEffect, useState, useCallback } from 'react';

/**
 * useDeveloperMode – simple hook that persists a boolean flag in localStorage
 * and returns the current state plus a toggle helper.
 *
 * The flag is expected to be used by admin-only or debugging components
 * such as <SystemStatusPanel /> to let non-admin users inspect extra panels
 * when developing locally.
 */
export function useDeveloperMode() {
  const [developerMode, setDeveloperMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('developer_mode') === 'true';
  });

  // Keep localStorage in sync when the flag changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('developer_mode', developerMode ? 'true' : 'false');
  }, [developerMode]);

  const toggleDeveloperMode = useCallback(() => {
    setDeveloperMode((prev) => !prev);
  }, []);

  return { developerMode, setDeveloperMode, toggleDeveloperMode } as const;
} 
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 
