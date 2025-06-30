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
          name: string | null
          created_at: string
          updated_at: string
          settings: Json
          subscription: Json
          last_active: string
          preferences: Json
          onboarding_completed: boolean
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json
          subscription?: Json
          last_active?: string
          preferences?: Json
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json
          subscription?: Json
          last_active?: string
          preferences?: Json
          onboarding_completed?: boolean
        }
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          rules: string[]
          performance: Json
          created_at: string
          updated_at: string
          is_active: boolean
          tags: string[]
          pair: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          rules: string[]
          performance?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
          tags?: string[]
          pair?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          rules?: string[]
          performance?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
          tags?: string[]
          pair?: string | null
        }
      }
      backtests: {
        Row: {
          id: string
          strategy_id: string
          user_id: string
          pair: string
          timeframe: string
          results: Json
          created_at: string
        }
        Insert: {
          id?: string
          strategy_id: string
          user_id: string
          pair: string
          timeframe: string
          results: Json
          created_at?: string
        }
        Update: {
          id?: string
          strategy_id?: string
          user_id?: string
          pair?: string
          timeframe?: string
          results?: Json
          created_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          tx_hash: string
          cryptocurrency: string
          amount: string | null
          status: 'pending' | 'confirmed' | 'failed'
          confirmations: number
          required_confirmations: number
          verification_timestamp: string
          confirmation_timestamp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tx_hash: string
          cryptocurrency: string
          amount?: string | null
          status?: 'pending' | 'confirmed' | 'failed'
          confirmations?: number
          required_confirmations?: number
          verification_timestamp?: string
          confirmation_timestamp?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tx_hash?: string
          cryptocurrency?: string
          amount?: string | null
          status?: 'pending' | 'confirmed' | 'failed'
          confirmations?: number
          required_confirmations?: number
          verification_timestamp?: string
          confirmation_timestamp?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      public_setups: {
        Row: {
          id: string
          user_id: string
          strategy_id: string | null
          symbol: string
          entry: number
          sl: number
          tp: number
          timeframe: string
          stats: Json
          likes: number
          views: number
          shared_at: string
        }
        Insert: {
          id?: string
          user_id: string
          strategy_id?: string | null
          symbol: string
          entry: number
          sl: number
          tp: number
          timeframe: string
          stats?: Json
          likes?: number
          views?: number
          shared_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          strategy_id?: string | null
          symbol?: string
          entry?: number
          sl?: number
          tp?: number
          timeframe?: string
          stats?: Json
          likes?: number
          views?: number
          shared_at?: string
        }
      }
      setup_leaderboard: {
        Row: {
          id: string
          setup_id: string
          rank: number
          score: number
          updated_at: string
        }
        Insert: {
          id?: string
          setup_id: string
          rank: number
          score: number
          updated_at?: string
        }
        Update: {
          id?: string
          setup_id?: string
          rank?: number
          score?: number
          updated_at?: string
        }
      }
      setup_likes: {
        Row: {
          id: string
          setup_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          setup_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          setup_id?: string
          user_id?: string
          created_at?: string
        }
      }
      setup_views: {
        Row: {
          id: string
          setup_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          setup_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          setup_id?: string
          user_id?: string
          created_at?: string
        }
      }
      qr_login_sessions: {
        Row: {
          id: string
          session_id: string
          user_id: string
          created_at: string
          expires_at: string
          status: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          created_at?: string
          expires_at: string
          status?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          created_at?: string
          expires_at?: string
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_setup_views: {
        Args: {
          setup_id: string
        }
        Returns: void
      }
      increment_setup_likes: {
        Args: {
          setup_id: string
        }
        Returns: void
      }
      decrement_setup_likes: {
        Args: {
          setup_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
