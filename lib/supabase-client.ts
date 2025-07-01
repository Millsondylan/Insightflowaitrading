// API client for server-side authentication and data operations
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

interface AuthUser {
  id: number;
  username: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: any;
  preferences: any;
  loading: boolean;
}

class ApiClient {
  private baseUrl = '/api';

  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async register(username: string, password: string, email?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();
      return data;
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

      const data = await response.json();
      return data;
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
        if (response.status === 401) {
          return { success: false, error: 'Not authenticated' };
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: 'Failed to get user' };
    }
  }

  async getTradingStrategies(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/trading-strategies`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get trading strategies:', error);
      return [];
    }
  }

  async createTradingStrategy(strategy: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/trading-strategies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(strategy),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create trading strategy:', error);
      throw error;
    }
  }

  async getJournalEntries(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/journal-entries`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get journal entries:', error);
      return [];
    }
  }

  async createJournalEntry(entry: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/journal-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      throw error;
    }
  }

  async getMarketSetups(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/market-setups`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get market setups:', error);
      return [];
    }
  }

  async analyzeMarketSetup(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-market-setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to analyze market setup:', error);
      throw error;
    }
  }
}

// Export the API client
export const apiClient = new ApiClient();

// For backward compatibility, export as 'supabase' but it's now the API client
export const supabase = apiClient;

// Helper functions for configuration checking (now always returns true since we use our own API)
export const isSupabaseConfigured = () => true;

export const getSupabaseConfigStatus = () => ({
  url: true,
  anonKey: true,
  configured: true
}); 