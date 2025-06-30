export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: string | null
          subscription_end: string | null
          trial_extended_until: string | null
          base_trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string | null
          subscription_end?: string | null
          trial_extended_until?: string | null
          base_trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string | null
          subscription_end?: string | null
          trial_extended_until?: string | null
          base_trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          symbol: string
          entry_price: number
          exit_price: number | null
          quantity: number
          direction: 'long' | 'short'
          status: 'open' | 'closed' | 'cancelled'
          entry_time: string
          exit_time: string | null
          pnl: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          entry_price: number
          exit_price?: number | null
          quantity: number
          direction: 'long' | 'short'
          status?: 'open' | 'closed' | 'cancelled'
          entry_time: string
          exit_time?: string | null
          pnl?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          entry_price?: number
          exit_price?: number | null
          quantity?: number
          direction?: 'long' | 'short'
          status?: 'open' | 'closed' | 'cancelled'
          entry_time?: string
          exit_time?: string | null
          pnl?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
