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
          confidence: number
          createdat: string
          id: string
          journalentryid: string
          provider: string
          suggestion: string
          summary: string
          tags: string[]
          userid: string
        }
        Insert: {
          confidence: number
          createdat?: string
          id?: string
          journalentryid: string
          provider?: string
          suggestion: string
          summary: string
          tags?: string[]
          userid: string
        }
        Update: {
          confidence?: number
          createdat?: string
          id?: string
          journalentryid?: string
          provider?: string
          suggestion?: string
          summary?: string
          tags?: string[]
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reflections_journalentryid_fkey"
            columns: ["journalentryid"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reflections_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      journal_entries: {
        Row: {
          charturl: string | null
          createdat: string
          entryprice: number
          exitprice: number
          id: string
          pair: string
          reason: string
          sentiment: string
          tags: string[] | null
          timeframe: string
          title: string
          userid: string | null
        }
        Insert: {
          charturl?: string | null
          createdat?: string
          entryprice: number
          exitprice: number
          id?: string
          pair: string
          reason: string
          sentiment: string
          tags?: string[] | null
          timeframe: string
          title: string
          userid?: string | null
        }
        Update: {
          charturl?: string | null
          createdat?: string
          entryprice?: number
          exitprice?: number
          id?: string
          pair?: string
          reason?: string
          sentiment?: string
          tags?: string[] | null
          timeframe?: string
          title?: string
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      daily_plans: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          focus_note: string;
          selected_strategies: string[];
          market_condition: string | null;
          risk_level: string | null;
          trading_goals: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          focus_note: string;
          selected_strategies?: string[];
          market_condition?: string | null;
          risk_level?: string | null;
          trading_goals?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          focus_note?: string;
          selected_strategies?: string[];
          market_condition?: string | null;
          risk_level?: string | null;
          trading_goals?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_plans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      }
      replay_data: {
        Row: {
          id: string;
          user_id: string;
          trade_id: string;
          symbol: string;
          timeframe: string;
          start_time: string;
          end_time: string;
          candles: {
            timestamp: string;
            open: number;
            high: number;
            low: number;
            close: number;
            volume: number;
          }[];
          tags: string[] | null;
          annotations: {
            timestamp: string;
            type: string;
            text: string;
          }[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trade_id: string;
          symbol: string;
          timeframe: string;
          start_time: string;
          end_time: string;
          candles: {
            timestamp: string;
            open: number;
            high: number;
            low: number;
            close: number;
            volume: number;
          }[];
          tags?: string[] | null;
          annotations?: {
            timestamp: string;
            type: string;
            text: string;
          }[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          trade_id?: string;
          symbol?: string;
          timeframe?: string;
          start_time?: string;
          end_time?: string;
          candles?: {
            timestamp: string;
            open: number;
            high: number;
            low: number;
            close: number;
            volume: number;
          }[];
          tags?: string[] | null;
          annotations?: {
            timestamp: string;
            type: string;
            text: string;
          }[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "replay_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "replay_data_trade_id_fkey";
            columns: ["trade_id"];
            isOneToOne: false;
            referencedRelation: "trades";
            referencedColumns: ["id"];
          }
        ];
      };
      strategy_backtests: {
        Row: {
          id: string;
          user_id: string;
          strategy_id: string;
          symbol: string;
          timeframe: string;
          start_date: string;
          end_date: string;
          initial_balance: number;
          final_balance: number;
          total_trades: number;
          winning_trades: number;
          losing_trades: number;
          profit_factor: number | null;
          sharpe_ratio: number | null;
          max_drawdown: number | null;
          win_rate: number | null;
          results_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          strategy_id: string;
          symbol: string;
          timeframe: string;
          start_date: string;
          end_date: string;
          initial_balance?: number;
          final_balance: number;
          total_trades: number;
          winning_trades: number;
          losing_trades: number;
          profit_factor?: number | null;
          sharpe_ratio?: number | null;
          max_drawdown?: number | null;
          win_rate?: number | null;
          results_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          strategy_id?: string;
          symbol?: string;
          timeframe?: string;
          start_date?: string;
          end_date?: string;
          initial_balance?: number;
          final_balance?: number;
          total_trades?: number;
          winning_trades?: number;
          losing_trades?: number;
          profit_factor?: number | null;
          sharpe_ratio?: number | null;
          max_drawdown?: number | null;
          win_rate?: number | null;
          results_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_backtests_strategy_id_fkey";
            columns: ["strategy_id"];
            isOneToOne: false;
            referencedRelation: "trading_strategies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "strategy_backtests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      strategy_versions: {
        Row: {
          id: string;
          strategy_id: string;
          user_id: string;
          version: string;
          code: string;
          description: string | null;
          changes_summary: string | null;
          performance_data: Json;
          is_live: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          strategy_id: string;
          user_id: string;
          version: string;
          code: string;
          description?: string | null;
          changes_summary?: string | null;
          performance_data?: Json;
          is_live?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          strategy_id?: string;
          user_id?: string;
          version?: string;
          code?: string;
          description?: string | null;
          changes_summary?: string | null;
          performance_data?: Json;
          is_live?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_versions_strategy_id_fkey";
            columns: ["strategy_id"];
            isOneToOne: false;
            referencedRelation: "trading_strategies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "strategy_versions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      market_analysis: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          timeframe: string;
          analysis_type: string;
          analysis_data: Json;
          sentiment: string | null;
          key_levels: number[] | null;
          indicators: Json;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          timeframe: string;
          analysis_type: string;
          analysis_data: Json;
          sentiment?: string | null;
          key_levels?: number[] | null;
          indicators?: Json;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          timeframe?: string;
          analysis_type?: string;
          analysis_data?: Json;
          sentiment?: string | null;
          key_levels?: number[] | null;
          indicators?: Json;
          created_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "market_analysis_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      trading_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_value: number | null;
          current_value: number;
          goal_type: string;
          start_date: string;
          target_date: string | null;
          status: string;
          progress_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          target_value?: number | null;
          current_value?: number;
          goal_type: string;
          start_date: string;
          target_date?: string | null;
          status?: string;
          progress_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          target_value?: number | null;
          current_value?: number;
          goal_type?: string;
          start_date?: string;
          target_date?: string | null;
          status?: string;
          progress_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trading_goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      risk_settings: {
        Row: {
          id: string;
          user_id: string;
          max_position_size: number;
          max_daily_drawdown: number;
          default_stop_loss_percent: number;
          default_take_profit_percent: number;
          max_trades_per_day: number | null;
          allowed_symbols: string[];
          risk_per_trade_percent: number;
          compounding_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          max_position_size: number;
          max_daily_drawdown: number;
          default_stop_loss_percent: number;
          default_take_profit_percent: number;
          max_trades_per_day?: number | null;
          allowed_symbols?: string[];
          risk_per_trade_percent: number;
          compounding_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          max_position_size?: number;
          max_daily_drawdown?: number;
          default_stop_loss_percent?: number;
          default_take_profit_percent?: number;
          max_trades_per_day?: number | null;
          allowed_symbols?: string[];
          risk_per_trade_percent?: number;
          compounding_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "risk_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      trading_sessions: {
        Row: {
          id: string;
          user_id: string;
          start_time: string;
          end_time: string | null;
          initial_balance: number;
          final_balance: number | null;
          pnl: number | null;
          total_trades: number;
          winning_trades: number;
          losing_trades: number;
          emotional_state: string | null;
          focus_level: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_time: string;
          end_time?: string | null;
          initial_balance: number;
          final_balance?: number | null;
          pnl?: number | null;
          total_trades?: number;
          winning_trades?: number;
          losing_trades?: number;
          emotional_state?: string | null;
          focus_level?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_time?: string;
          end_time?: string | null;
          initial_balance?: number;
          final_balance?: number | null;
          pnl?: number | null;
          total_trades?: number;
          winning_trades?: number;
          losing_trades?: number;
          emotional_state?: string | null;
          focus_level?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trading_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      market_correlations: {
        Row: {
          id: string;
          symbol_pair: string[];
          timeframe: string;
          correlation_value: number;
          start_date: string;
          end_date: string;
          data_points: number;
          created_at: string;
          color_palette: Json;
          correlation_trend: number[];
          significance_level: number;
        };
        Insert: {
          id?: string;
          symbol_pair: string[];
          timeframe: string;
          correlation_value: number;
          start_date: string;
          end_date: string;
          data_points: number;
          created_at?: string;
          color_palette?: Json;
          correlation_trend?: number[];
          significance_level?: number;
        };
        Update: {
          id?: string;
          symbol_pair?: string[];
          timeframe?: string;
          correlation_value?: number;
          start_date?: string;
          end_date?: string;
          data_points?: number;
          created_at?: string;
          color_palette?: Json;
          correlation_trend?: number[];
          significance_level?: number;
        };
        Relationships: [];
      };
      
      market_correlations_cache: {
        Row: {
          id: string;
          asset_set: string;
          timeframe: string;
          correlation_data: Json;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_set: string;
          timeframe: string;
          correlation_data: Json;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_set?: string;
          timeframe?: string;
          correlation_data?: Json;
          last_updated?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      academy_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          color_scheme: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          color_scheme?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          color_scheme?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      academy_courses: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          difficulty: string | null;
          course_type: string[];
          icon: string | null;
          duration_hours: number;
          modules_count: number;
          enrolled_count: number;
          rating: number;
          tags: string[];
          prerequisites: string[];
          learning_objectives: Json;
          author_info: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          difficulty?: string | null;
          course_type?: string[];
          icon?: string | null;
          duration_hours?: number;
          modules_count?: number;
          enrolled_count?: number;
          rating?: number;
          tags?: string[];
          prerequisites?: string[];
          learning_objectives?: Json;
          author_info?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          difficulty?: string | null;
          course_type?: string[];
          icon?: string | null;
          duration_hours?: number;
          modules_count?: number;
          enrolled_count?: number;
          rating?: number;
          tags?: string[];
          prerequisites?: string[];
          learning_objectives?: Json;
          author_info?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "academy_courses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "academy_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      academy_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          started_at: string;
          last_accessed_at: string;
          completed_at: string | null;
          progress_percentage: number;
          module_checkpoints: Json;
          quiz_answers: Json;
          time_spent_seconds: number;
          reflection_timestamps: string[];
          notes: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          started_at?: string;
          last_accessed_at?: string;
          completed_at?: string | null;
          progress_percentage?: number;
          module_checkpoints?: Json;
          quiz_answers?: Json;
          time_spent_seconds?: number;
          reflection_timestamps?: string[];
          notes?: string[];
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          started_at?: string;
          last_accessed_at?: string;
          completed_at?: string | null;
          progress_percentage?: number;
          module_checkpoints?: Json;
          quiz_answers?: Json;
          time_spent_seconds?: number;
          reflection_timestamps?: string[];
          notes?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "academy_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "academy_progress_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "academy_courses";
            referencedColumns: ["id"];
          }
        ];
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          notification_channels: Json;
          notification_types: Json;
          quiet_hours: Json;
          theme_preferences: Json;
          layout_preferences: Json;
          chart_settings: Json;
          feature_toggles: Json;
          audio_settings: Json;
          coaching_tone: string;
          reminder_frequency: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_channels?: Json;
          notification_types?: Json;
          quiet_hours?: Json;
          theme_preferences?: Json;
          layout_preferences?: Json;
          chart_settings?: Json;
          feature_toggles?: Json;
          audio_settings?: Json;
          coaching_tone?: string;
          reminder_frequency?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_channels?: Json;
          notification_types?: Json;
          quiet_hours?: Json;
          theme_preferences?: Json;
          layout_preferences?: Json;
          chart_settings?: Json;
          feature_toggles?: Json;
          audio_settings?: Json;
          coaching_tone?: string;
          reminder_frequency?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          notification_type: string;
          title: string;
          message: string;
          data: Json;
          priority: string;
          channels: string[];
          status: string;
          sent_at: string | null;
          read_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_type: string;
          title: string;
          message: string;
          data?: Json;
          priority?: string;
          channels?: string[];
          status?: string;
          sent_at?: string | null;
          read_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_type?: string;
          title?: string;
          message?: string;
          data?: Json;
          priority?: string;
          channels?: string[];
          status?: string;
          sent_at?: string | null;
          read_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action_type: string;
          component_name: string;
          component_path: string | null;
          action_details: Json;
          client_timestamp: string;
          server_timestamp: string;
          session_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          duration_ms: number | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action_type: string;
          component_name: string;
          component_path?: string | null;
          action_details?: Json;
          client_timestamp: string;
          server_timestamp?: string;
          session_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          duration_ms?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action_type?: string;
          component_name?: string;
          component_path?: string | null;
          action_details?: Json;
          client_timestamp?: string;
          server_timestamp?: string;
          session_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          duration_ms?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      market_assets: {
        Row: {
          id: string;
          symbol: string;
          name: string;
          asset_class: string | null;
          exchange: string | null;
          tags: string[];
          volatility_profile: string | null;
          avg_true_range: Json;
          trading_hours: Json;
          contract_specs: Json;
          correlation_pairs: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          symbol: string;
          name: string;
          asset_class?: string | null;
          exchange?: string | null;
          tags?: string[];
          volatility_profile?: string | null;
          avg_true_range?: Json;
          trading_hours?: Json;
          contract_specs?: Json;
          correlation_pairs?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          symbol?: string;
          name?: string;
          asset_class?: string | null;
          exchange?: string | null;
          tags?: string[];
          volatility_profile?: string | null;
          avg_true_range?: Json;
          trading_hours?: Json;
          contract_specs?: Json;
          correlation_pairs?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_favorite_pairs: {
        Row: {
          id: string;
          user_id: string;
          symbol_pair: string[];
          notify_on_inverse_correlation: boolean;
          correlation_threshold: number;
          custom_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol_pair: string[];
          notify_on_inverse_correlation?: boolean;
          correlation_threshold?: number;
          custom_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol_pair?: string[];
          notify_on_inverse_correlation?: boolean;
          correlation_threshold?: number;
          custom_notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorite_pairs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      copilot_logs: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          component_context: string;
          user_query: string | null;
          copilot_response: string;
          response_type: string | null;
          scope_context: Json;
          user_history_key: string | null;
          tokens_used: number;
          response_time_ms: number | null;
          feedback_rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          component_context: string;
          user_query?: string | null;
          copilot_response: string;
          response_type?: string | null;
          scope_context?: Json;
          user_history_key?: string | null;
          tokens_used?: number;
          response_time_ms?: number | null;
          feedback_rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          component_context?: string;
          user_query?: string | null;
          copilot_response?: string;
          response_type?: string | null;
          scope_context?: Json;
          user_history_key?: string | null;
          tokens_used?: number;
          response_time_ms?: number | null;
          feedback_rating?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "copilot_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      coaching_feedback: {
        Row: {
          id: string;
          user_id: string;
          feedback_type: string | null;
          context_data: Json;
          ai_analysis: string;
          suggestions: Json;
          urgency: string;
          user_acknowledged: boolean;
          acknowledged_at: string | null;
          follow_up_required: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feedback_type?: string | null;
          context_data: Json;
          ai_analysis: string;
          suggestions?: Json;
          urgency?: string;
          user_acknowledged?: boolean;
          acknowledged_at?: string | null;
          follow_up_required?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          feedback_type?: string | null;
          context_data?: Json;
          ai_analysis?: string;
          suggestions?: Json;
          urgency?: string;
          user_acknowledged?: boolean;
          acknowledged_at?: string | null;
          follow_up_required?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coaching_feedback_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      ui_error_captures: {
        Row: {
          id: string;
          user_id: string | null;
          error_type: string;
          error_message: string;
          stack_trace: string | null;
          component_stack: string | null;
          browser_info: Json;
          gpt_analysis: string | null;
          user_facing_message: string | null;
          suggested_actions: Json;
          severity: string;
          resolution_status: string;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          error_type: string;
          error_message: string;
          stack_trace?: string | null;
          component_stack?: string | null;
          browser_info?: Json;
          gpt_analysis?: string | null;
          user_facing_message?: string | null;
          suggested_actions?: Json;
          severity?: string;
          resolution_status?: string;
          occurred_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          error_type?: string;
          error_message?: string;
          stack_trace?: string | null;
          component_stack?: string | null;
          browser_info?: Json;
          gpt_analysis?: string | null;
          user_facing_message?: string | null;
          suggested_actions?: Json;
          severity?: string;
          resolution_status?: string;
          occurred_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ui_error_captures_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      interaction_heatmap: {
        Row: {
          id: string;
          user_id: string;
          page_path: string;
          component_id: string;
          interaction_type: string;
          x_position: number | null;
          y_position: number | null;
          viewport_width: number | null;
          viewport_height: number | null;
          time_on_component: number | null;
          interaction_count: number;
          device_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          page_path: string;
          component_id: string;
          interaction_type: string;
          x_position?: number | null;
          y_position?: number | null;
          viewport_width?: number | null;
          viewport_height?: number | null;
          time_on_component?: number | null;
          interaction_count?: number;
          device_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          page_path?: string;
          component_id?: string;
          interaction_type?: string;
          x_position?: number | null;
          y_position?: number | null;
          viewport_width?: number | null;
          viewport_height?: number | null;
          time_on_component?: number | null;
          interaction_count?: number;
          device_type?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interaction_heatmap_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_journey_state: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          current_path: string;
          journey_stack: Json;
          form_states: Json;
          component_states: Json;
          feature_interactions: Json;
          last_activity: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          current_path: string;
          journey_stack?: Json;
          form_states?: Json;
          component_states?: Json;
          feature_interactions?: Json;
          last_activity?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          current_path?: string;
          journey_stack?: Json;
          form_states?: Json;
          component_states?: Json;
          feature_interactions?: Json;
          last_activity?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_journey_state_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      lesson_commentary: {
        Row: {
          id: string;
          course_id: string;
          user_id: string;
          lesson_section: string;
          narrator_style: string;
          generated_commentary: string;
          user_context: Json;
          timestamp_in_lesson: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          user_id: string;
          lesson_section: string;
          narrator_style?: string;
          generated_commentary: string;
          user_context?: Json;
          timestamp_in_lesson?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          user_id?: string;
          lesson_section?: string;
          narrator_style?: string;
          generated_commentary?: string;
          user_context?: Json;
          timestamp_in_lesson?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_commentary_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "academy_courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_commentary_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_course_feedback: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          rating: number | null;
          difficulty_rating: string | null;
          comment: string | null;
          helpful_modules: string[];
          improvement_suggestions: string | null;
          would_recommend: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          rating?: number | null;
          difficulty_rating?: string | null;
          comment?: string | null;
          helpful_modules?: string[];
          improvement_suggestions?: string | null;
          would_recommend?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          rating?: number | null;
          difficulty_rating?: string | null;
          comment?: string | null;
          helpful_modules?: string[];
          improvement_suggestions?: string | null;
          would_recommend?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_course_feedback_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_course_feedback_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "academy_courses";
            referencedColumns: ["id"];
          }
        ];
      };
      course_challenges: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          challenge_type: string | null;
          requirements: Json;
          passing_criteria: Json;
          time_limit_minutes: number | null;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          challenge_type?: string | null;
          requirements?: Json;
          passing_criteria?: Json;
          time_limit_minutes?: number | null;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          challenge_type?: string | null;
          requirements?: Json;
          passing_criteria?: Json;
          time_limit_minutes?: number | null;
          points?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_challenges_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "academy_courses";
            referencedColumns: ["id"];
          }
        ];
      };
      market_mood_feed: {
        Row: {
          id: string;
          generated_at: string;
          market_summary: Json;
          correlation_shifts: Json;
          volatility_alerts: Json;
          sentiment_indicators: Json;
          ai_brief: string | null;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          generated_at?: string;
          market_summary: Json;
          correlation_shifts?: Json;
          volatility_alerts?: Json;
          sentiment_indicators?: Json;
          ai_brief?: string | null;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          generated_at?: string;
          market_summary?: Json;
          correlation_shifts?: Json;
          volatility_alerts?: Json;
          sentiment_indicators?: Json;
          ai_brief?: string | null;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      user_market_focus: {
        Row: {
          id: string;
          user_id: string;
          focused_markets: string[];
          favorite_symbols: string[];
          trading_hours_preference: Json;
          news_preferences: Json;
          technical_indicator_preferences: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          focused_markets?: string[];
          favorite_symbols?: string[];
          trading_hours_preference?: Json;
          news_preferences?: Json;
          technical_indicator_preferences?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          focused_markets?: string[];
          favorite_symbols?: string[];
          trading_hours_preference?: Json;
          news_preferences?: Json;
          technical_indicator_preferences?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_market_focus_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      pinescript_requests: {
        Row: {
          id: string
          user_id: string
          prompt: string
          created_at: string | null
          is_premium: boolean | null
          script_type: string
          status: string
          processing_time_ms: number | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          created_at?: string | null
          is_premium?: boolean | null
          script_type: string
          status?: string
          processing_time_ms?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          created_at?: string | null
          is_premium?: boolean | null
          script_type?: string
          status?: string
          processing_time_ms?: number | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pinescript_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pinescript_outputs: {
        Row: {
          id: string
          request_id: string
          user_id: string
          code: string
          version: number
          syntax_valid: boolean | null
          has_errors: boolean | null
          error_details: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          request_id: string
          user_id: string
          code: string
          version?: number
          syntax_valid?: boolean | null
          has_errors?: boolean | null
          error_details?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          request_id?: string
          user_id?: string
          code?: string
          version?: number
          syntax_valid?: boolean | null
          has_errors?: boolean | null
          error_details?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pinescript_outputs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "pinescript_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinescript_outputs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_limits: {
        Row: {
          id: string
          user_id: string
          resource_type: string
          monthly_limit: number
          used_count: number
          reset_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          resource_type: string
          monthly_limit: number
          used_count?: number
          reset_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          resource_type?: string
          monthly_limit?: number
          used_count?: number
          reset_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pinescript_feedback: {
        Row: {
          id: string
          pinescript_id: string
          user_id: string
          rating: number | null
          feedback_text: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          pinescript_id: string
          user_id: string
          rating?: number | null
          feedback_text?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          pinescript_id?: string
          user_id?: string
          rating?: number | null
          feedback_text?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pinescript_feedback_pinescript_id_fkey"
            columns: ["pinescript_id"]
            isOneToOne: false
            referencedRelation: "pinescript_outputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinescript_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pinescript_shares: {
        Row: {
          id: string
          pinescript_id: string
          user_id: string
          share_token: string
          views_count: number | null
          is_public: boolean | null
          expires_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          pinescript_id: string
          user_id: string
          share_token: string
          views_count?: number | null
          is_public?: boolean | null
          expires_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          pinescript_id?: string
          user_id?: string
          share_token?: string
          views_count?: number | null
          is_public?: boolean | null
          expires_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pinescript_shares_pinescript_id_fkey"
            columns: ["pinescript_id"]
            isOneToOne: false
            referencedRelation: "pinescript_outputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinescript_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_email: {
        Args: Record<propertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<propertyKey, never>
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
