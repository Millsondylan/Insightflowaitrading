// API client for our server-side authentication and data operations
// This replaces the previous Supabase client

interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email?: string;
  };
  profile?: any;
  preferences?: any;
  error?: string;
}

class ApiClient {
  private baseUrl = '/api';

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, password }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, password, email }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        credentials: 'include',
      });
      if (!response.ok) {
        return { success: false, error: 'Not authenticated' };
      }
      const data = await response.json();
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: 'Failed to get user' };
    }
  }

  // Mock auth object for compatibility
  auth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const result = await this.login(email, password);
      return {
        data: result.success ? { user: result.user } : null,
        error: result.success ? null : new Error(result.error || 'Login failed')
      };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      const result = await this.register(email, password);
      return {
        data: result.success ? { user: result.user } : null,
        error: result.success ? null : new Error(result.error || 'Registration failed')
      };
    },
    signOut: async () => {
      const result = await this.logout();
      return {
        error: result.success ? null : new Error(result.error || 'Logout failed')
      };
    },
    getUser: async () => {
      const result = await this.getCurrentUser();
      return {
        data: result.success ? { user: result.user } : { user: null },
        error: result.success ? null : new Error(result.error || 'Failed to get user')
      };
    },
    onAuthStateChange: (callback: Function) => {
      // Mock implementation - in a real app you'd implement this properly
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };
}

// Export the API client as supabase for compatibility
export const supabase = new ApiClient();
export default supabase; 