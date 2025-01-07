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
