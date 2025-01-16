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
      projects: {
        Row: {
          id: string
          founder_id: string
          title: string
          description: string | null
          type: 'product' | 'service'
          category: string | null
          visibility: 'private' | 'public' | 'team'
          image_url: string | null
          github_url: string | null
          live_url: string | null
          tech_stack: string[] | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          founder_id: string
          title: string
          description?: string | null
          type: 'product' | 'service'
          category?: string | null
          visibility?: 'private' | 'public' | 'team'
          image_url?: string | null
          github_url?: string | null
          live_url?: string | null
          tech_stack?: string[] | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          founder_id?: string
          title?: string
          description?: string | null
          type?: 'product' | 'service'
          category?: string | null
          visibility?: 'private' | 'public' | 'team'
          image_url?: string | null
          github_url?: string | null
          live_url?: string | null
          tech_stack?: string[] | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string | null
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
