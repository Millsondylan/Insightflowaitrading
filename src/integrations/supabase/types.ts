export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          analysis_data: Json | null
          content: string
          created_at: string | null
          id: string
          message_type: string
          user_id: string | null
        }
        Insert: {
          analysis_data?: Json | null
          content: string
          created_at?: string | null
          id?: string
          message_type: string
          user_id?: string | null
        }
        Update: {
          analysis_data?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_reflections: {
        Row: {
          id: string
          journalEntryId: string
          userId: string
          summary: string
          tags: string[]
          suggestion: string
          confidence: number
          provider: string
          createdAt: string
        }
        Insert: {
          id?: string
          journalEntryId: string
          userId: string
          summary: string
          tags: string[]
          suggestion: string
          confidence: number
          provider: string
          createdAt?: string
        }
        Update: {
          id?: string
          journalEntryId?: string
          userId?: string
          summary?: string
          tags?: string[]
          suggestion?: string
          confidence?: number
          provider?: string
          createdAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reflections_journalEntryId_fkey"
            columns: ["journalEntryId"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reflections_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          title: string
          pair: string
          timeframe: string
          entryPrice: number
          exitPrice: number
          chartUrl?: string | null
          reason: string
          sentiment: string
          tags: string[]
          userId?: string | null
          createdAt: string
        }
        Insert: {
          id?: string
          title: string
          pair: string
          timeframe: string
          entryPrice: number
          exitPrice: number
          chartUrl?: string | null
          reason: string
          sentiment: string
          tags: string[]
          userId?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          title?: string
          pair?: string
          timeframe?: string
          entryPrice?: number
          exitPrice?: number
          chartUrl?: string | null
          reason?: string
          sentiment?: string
          tags?: string[]
          userId?: string | null
          createdAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      backtest_results: {
        Row: {
          created_at: string | null
          end_date: string
          final_balance: number
          id: string
          initial_balance: number | null
          losing_trades: number | null
          max_drawdown: number | null
          profit_factor: number | null
          results_data: Json | null
          sharpe_ratio: number | null
          start_date: string
          strategy_id: string | null
          symbol: string
          timeframe: string
          total_trades: number | null
          user_id: string | null
          win_rate: number | null
          winning_trades: number | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          final_balance: number
          id?: string
          initial_balance?: number | null
          losing_trades?: number | null
          max_drawdown?: number | null
          profit_factor?: number | null
          results_data?: Json | null
          sharpe_ratio?: number | null
          start_date: string
          strategy_id?: string | null
          symbol: string
          timeframe: string
          total_trades?: number | null
          user_id?: string | null
          win_rate?: number | null
          winning_trades?: number | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          final_balance?: number
          id?: string
          initial_balance?: number | null
          losing_trades?: number | null
          max_drawdown?: number | null
          profit_factor?: number | null
          results_data?: Json | null
          sharpe_ratio?: number | null
          start_date?: string
          strategy_id?: string | null
          symbol?: string
          timeframe?: string
          total_trades?: number | null
          user_id?: string | null
          win_rate?: number | null
          winning_trades?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "backtest_results_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          message: string
          target_tier: string | null
          title: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          message: string
          target_tier?: string | null
          title: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          message?: string
          target_tier?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      code_redemptions: {
        Row: {
          code_id: string
          days_added: number
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          code_id: string
          days_added: number
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          code_id?: string
          days_added?: number
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "promotional_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          post_type: string | null
          symbol: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_type?: string | null
          symbol?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_type?: string | null
          symbol?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      demo_accounts: {
        Row: {
          balance: number | null
          created_at: string | null
          equity: number | null
          id: string
          margin: number | null
          margin_level: number | null
          total_profit: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          equity?: number | null
          id?: string
          margin?: number | null
          margin_level?: number | null
          total_profit?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          equity?: number | null
          id?: string
          margin?: number | null
          margin_level?: number | null
          total_profit?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      demo_trades: {
        Row: {
          closed_at: string | null
          demo_account_id: string | null
          entry_price: number
          exit_price: number | null
          id: string
          mt5_ticket_id: string | null
          notes: string | null
          opened_at: string | null
          pnl: number | null
          quantity: number
          status: string | null
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          trade_type: string
          user_id: string | null
          volume: number
        }
        Insert: {
          closed_at?: string | null
          demo_account_id?: string | null
          entry_price: number
          exit_price?: number | null
          id?: string
          mt5_ticket_id?: string | null
          notes?: string | null
          opened_at?: string | null
          pnl?: number | null
          quantity: number
          status?: string | null
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          trade_type: string
          user_id?: string | null
          volume: number
        }
        Update: {
          closed_at?: string | null
          demo_account_id?: string | null
          entry_price?: number
          exit_price?: number | null
          id?: string
          mt5_ticket_id?: string | null
          notes?: string | null
          opened_at?: string | null
          pnl?: number | null
          quantity?: number
          status?: string | null
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          trade_type?: string
          user_id?: string | null
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_trades_demo_account_id_fkey"
            columns: ["demo_account_id"]
            isOneToOne: false
            referencedRelation: "demo_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      market_alerts: {
        Row: {
          alert_type: string
          condition_data: Json
          created_at: string | null
          id: string
          message: string | null
          symbol: string
          triggered: boolean | null
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          condition_data: Json
          created_at?: string | null
          id?: string
          message?: string | null
          symbol: string
          triggered?: boolean | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          condition_data?: Json
          created_at?: string | null
          id?: string
          message?: string | null
          symbol?: string
          triggered?: boolean | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          created_at: string | null
          id: string
          snapshot_data: Json | null
          total_pnl: number | null
          total_value: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          snapshot_data?: Json | null
          total_pnl?: number | null
          total_value: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          snapshot_data?: Json | null
          total_pnl?: number | null
          total_value?: number
          user_id?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          base_trial_end: string | null
          created_at: string
          currency: string | null
          email: string
          email_notifications: boolean | null
          extra_posts_earned: number | null
          full_name: string | null
          id: string
          mt5_account_id: string | null
          price_alerts: boolean | null
          subscription_end: string | null
          subscription_tier: string | null
          theme: string | null
          timezone: string | null
          total_likes_received: number | null
          trading_alerts: boolean | null
          trial_extended_until: string | null
          updated_at: string
          weekly_posts_used: number | null
        }
        Insert: {
          avatar_url?: string | null
          base_trial_end?: string | null
          created_at?: string
          currency?: string | null
          email: string
          email_notifications?: boolean | null
          extra_posts_earned?: number | null
          full_name?: string | null
          id: string
          mt5_account_id?: string | null
          price_alerts?: boolean | null
          subscription_end?: string | null
          subscription_tier?: string | null
          theme?: string | null
          timezone?: string | null
          total_likes_received?: number | null
          trading_alerts?: boolean | null
          trial_extended_until?: string | null
          updated_at?: string
          weekly_posts_used?: number | null
        }
        Update: {
          avatar_url?: string | null
          base_trial_end?: string | null
          created_at?: string
          currency?: string | null
          email?: string
          email_notifications?: boolean | null
          extra_posts_earned?: number | null
          full_name?: string | null
          id?: string
          mt5_account_id?: string | null
          price_alerts?: boolean | null
          subscription_end?: string | null
          subscription_tier?: string | null
          theme?: string | null
          timezone?: string | null
          total_likes_received?: number | null
          trading_alerts?: boolean | null
          trial_extended_until?: string | null
          updated_at?: string
          weekly_posts_used?: number | null
        }
        Relationships: []
      }
      promotional_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string | null
          duration_days: number
          expires_at: string | null
          id: string
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotional_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          expires_at: string | null
          id: string
          payment_hash: string | null
          status: string | null
          tier: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          payment_hash?: string | null
          status?: string | null
          tier: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          payment_hash?: string | null
          status?: string | null
          tier?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          closed_at: string | null
          emotional_state: string | null
          entry_price: number
          exit_price: number | null
          id: string
          market_condition: string | null
          mt5_ticket_id: string | null
          notes: string | null
          opened_at: string
          pnl: number | null
          quantity: number
          setup_quality: number | null
          status: string | null
          strategy: string | null
          symbol: string
          tags: string[] | null
          trade_type: string
          user_id: string | null
        }
        Insert: {
          closed_at?: string | null
          emotional_state?: string | null
          entry_price: number
          exit_price?: number | null
          id?: string
          market_condition?: string | null
          mt5_ticket_id?: string | null
          notes?: string | null
          opened_at?: string
          pnl?: number | null
          quantity: number
          setup_quality?: number | null
          status?: string | null
          strategy?: string | null
          symbol: string
          tags?: string[] | null
          trade_type: string
          user_id?: string | null
        }
        Update: {
          closed_at?: string | null
          emotional_state?: string | null
          entry_price?: number
          exit_price?: number | null
          id?: string
          market_condition?: string | null
          mt5_ticket_id?: string | null
          notes?: string | null
          opened_at?: string
          pnl?: number | null
          quantity?: number
          setup_quality?: number | null
          status?: string | null
          strategy?: string | null
          symbol?: string
          tags?: string[] | null
          trade_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_insights: {
        Row: {
          action_text: string | null
          confidence: number | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          insight_type: string
          symbol: string | null
          timeframe: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_text?: string | null
          confidence?: number | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_type: string
          symbol?: string | null
          timeframe?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_text?: string | null
          confidence?: number | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_type?: string
          symbol?: string | null
          timeframe?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trading_strategies: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          language: string | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          language?: string | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_watchlists: {
        Row: {
          created_at: string | null
          id: string
          name: string
          symbols: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string
          symbols?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          symbols?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
