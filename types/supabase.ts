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
          created_at: string
          updated_at: string
          title: string
          description: string | null
          type: string
          category: string
          visibility: string
          status: string
          founder_id: string
          current_funding: number | null
          funding_goal: number | null
          required_skills: string[] | null
          image_url: string | null
          progress: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          type?: string
          category?: string
          visibility?: string
          status?: string
          founder_id: string
          current_funding?: number | null
          funding_goal?: number | null
          required_skills?: string[] | null
          image_url?: string | null
          progress?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          type?: string
          category?: string
          visibility?: string
          status?: string
          founder_id?: string
          current_funding?: number | null
          funding_goal?: number | null
          required_skills?: string[] | null
          image_url?: string | null
          progress?: number | null
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          priority: 'high' | 'medium' | 'low'
          status: 'todo' | 'in_progress' | 'completed'
          project_id: string
          assignee_id: string | null
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          priority: 'high' | 'medium' | 'low'
          status: 'todo' | 'in_progress' | 'completed'
          project_id: string
          assignee_id?: string | null
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          priority?: 'high' | 'medium' | 'low'
          status?: 'todo' | 'in_progress' | 'completed'
          project_id?: string
          assignee_id?: string | null
          creator_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_attendees: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          start_time: string
          duration: number
          type: 'meeting' | 'review' | 'call' | 'deadline' | 'other'
          project_id: string | null
          project_name: string | null
          location: string | null
          is_virtual: boolean
          meeting_link: string | null
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          start_time: string
          duration: number
          type: 'meeting' | 'review' | 'call' | 'deadline' | 'other'
          project_id?: string | null
          project_name?: string | null
          location?: string | null
          is_virtual?: boolean
          meeting_link?: string | null
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          start_time?: string
          duration?: number
          type?: 'meeting' | 'review' | 'call' | 'deadline' | 'other'
          project_id?: string | null
          project_name?: string | null
          location?: string | null
          is_virtual?: boolean
          meeting_link?: string | null
          creator_id?: string
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
