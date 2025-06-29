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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
