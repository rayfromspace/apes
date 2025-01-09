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
      investments: {
        Row: {
          id: string
          user_id: string
          project: string
          type: string
          invested: number
          current_value: number
          roi: number
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project: string
          type: string
          invested: number
          current_value: number
          roi: number
          progress: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project?: string
          type?: string
          invested?: number
          current_value?: number
          roi?: number
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      staking_pools: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          token: string
          apy: number
          total_staked: number
          min_stake: number
          lock_period: string
          rewards: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          token: string
          apy: number
          total_staked?: number
          min_stake: number
          lock_period: string
          rewards?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          token?: string
          apy?: number
          total_staked?: number
          min_stake?: number
          lock_period?: string
          rewards?: number
        }
      }
      user_stakes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          pool_id: string
          amount: number
          rewards_earned: number
          locked_until: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          pool_id: string
          amount: number
          rewards_earned?: number
          locked_until?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          pool_id?: string
          amount?: number
          rewards_earned?: number
          locked_until?: string | null
          status?: string
        }
      }
      staking_rewards: {
        Row: {
          id: string
          created_at: string
          user_id: string
          pool_id: string
          amount: number
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          pool_id: string
          amount: number
          type: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          pool_id?: string
          amount?: number
          type?: string
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
