import { create } from 'zustand'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'

export type EventType = 'task' | 'meeting' | 'review' | 'deadline'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  duration: number
  type: EventType
  projectId: string
  createdBy: string
}

interface CalendarState {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  fetchEvents: (projectId: string) => Promise<void>
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>
  updateEvent: (event: CalendarEvent) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
  subscribeToEvents: (projectId: string) => () => void
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (projectId: string) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: true })

      if (error) throw error

      const events = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.start_time,
        duration: event.duration,
        type: event.type,
        projectId: event.project_id,
        createdBy: event.created_by
      }))

      set({ events, loading: false })
    } catch (error) {
      console.error('Error fetching events:', error)
      set({ error: 'Failed to fetch events', loading: false })
    }
  },

  createEvent: async (event) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([{
          title: event.title,
          description: event.description,
          date: event.date,
          start_time: event.startTime,
          duration: event.duration,
          type: event.type,
          project_id: event.projectId,
          created_by: event.createdBy
        }])
        .select()
        .single()

      if (error) throw error

      const newEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        startTime: data.start_time,
        duration: data.duration,
        type: data.type,
        projectId: data.project_id,
        createdBy: data.created_by
      }

      set(state => ({
        events: [...state.events, newEvent],
        loading: false
      }))
    } catch (error) {
      console.error('Error creating event:', error)
      set({ error: 'Failed to create event', loading: false })
    }
  },

  updateEvent: async (event) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: event.title,
          description: event.description,
          date: event.date,
          start_time: event.startTime,
          duration: event.duration,
          type: event.type
        })
        .eq('id', event.id)

      if (error) throw error

      set(state => ({
        events: state.events.map(e => e.id === event.id ? event : e),
        loading: false
      }))
    } catch (error) {
      console.error('Error updating event:', error)
      set({ error: 'Failed to update event', loading: false })
    }
  },

  deleteEvent: async (eventId: string) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      set(state => ({
        events: state.events.filter(e => e.id !== eventId),
        loading: false
      }))
    } catch (error) {
      console.error('Error deleting event:', error)
      set({ error: 'Failed to delete event', loading: false })
    }
  },

  subscribeToEvents: (projectId: string) => {
    const supabase = createClientComponentClient()
    
    const subscription = supabase
      .channel(`calendar_events:${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'calendar_events',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        const newEvent = {
          id: payload.new.id,
          title: payload.new.title,
          description: payload.new.description,
          date: payload.new.date,
          startTime: payload.new.start_time,
          duration: payload.new.duration,
          type: payload.new.type,
          projectId: payload.new.project_id,
          createdBy: payload.new.created_by
        }
        set(state => ({ events: [...state.events, newEvent] }))
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'calendar_events',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        const updatedEvent = {
          id: payload.new.id,
          title: payload.new.title,
          description: payload.new.description,
          date: payload.new.date,
          startTime: payload.new.start_time,
          duration: payload.new.duration,
          type: payload.new.type,
          projectId: payload.new.project_id,
          createdBy: payload.new.created_by
        }
        set(state => ({
          events: state.events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
          )
        }))
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'calendar_events',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        set(state => ({
          events: state.events.filter(event => event.id !== payload.old.id)
        }))
      })
      .subscribe()

    // Return cleanup function
    return () => {
      subscription.unsubscribe()
    }
  }
}))
