import { create } from 'zustand'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format, formatDistanceToNow } from 'date-fns'

export type MilestoneStatus = 'completed' | 'current' | 'upcoming'

export interface Milestone {
  id: string
  title: string
  description?: string
  date: string
  status: MilestoneStatus
  projectId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface MilestoneState {
  milestones: Milestone[]
  loading: boolean
  error: string | null
  fetchMilestones: (projectId: string) => Promise<void>
  createMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>
  deleteMilestone: (id: string) => Promise<void>
  formatMilestoneDate: (date: string) => string
  setupRealtimeSubscription: (projectId: string) => () => void
}

export const useMilestoneStore = create<MilestoneState>((set, get) => {
  const supabase = createClientComponentClient()

  return {
    milestones: [],
    loading: false,
    error: null,

    fetchMilestones: async (projectId: string) => {
      set({ loading: true, error: null })

      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('date', { ascending: true })

        if (error) throw error

        const milestones = data.map(milestone => ({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          date: milestone.date,
          status: milestone.status,
          projectId: milestone.project_id,
          createdBy: milestone.created_by,
          createdAt: milestone.created_at,
          updatedAt: milestone.updated_at
        }))

        set({ milestones, loading: false })
      } catch (error) {
        console.error('Error fetching milestones:', error)
        set({ error: 'Failed to fetch milestones', loading: false })
      }
    },

    createMilestone: async (milestone) => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('milestones')
          .insert([{
            title: milestone.title,
            description: milestone.description,
            date: milestone.date,
            status: milestone.status,
            project_id: milestone.projectId,
            created_by: userData.user.id
          }])
          .select()
          .single()

        if (error) throw error

        // Don't update state here as the realtime subscription will handle it
      } catch (error) {
        console.error('Error creating milestone:', error)
        set({ error: 'Failed to create milestone' })
      }
    },

    updateMilestone: async (id, updates) => {
      try {
        const { error } = await supabase
          .from('milestones')
          .update({
            title: updates.title,
            description: updates.description,
            date: updates.date,
            status: updates.status,
          })
          .eq('id', id)

        if (error) throw error

        // Don't update state here as the realtime subscription will handle it
      } catch (error) {
        console.error('Error updating milestone:', error)
        set({ error: 'Failed to update milestone' })
      }
    },

    deleteMilestone: async (id) => {
      try {
        const { error } = await supabase
          .from('milestones')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Don't update state here as the realtime subscription will handle it
      } catch (error) {
        console.error('Error deleting milestone:', error)
        set({ error: 'Failed to delete milestone' })
      }
    },

    formatMilestoneDate: (date: string) => {
      const milestoneDate = new Date(date)
      const now = new Date()

      if (milestoneDate < now) {
        return formatDistanceToNow(milestoneDate, { addSuffix: true })
      } else if (milestoneDate > now) {
        return format(milestoneDate, 'MMM d, yyyy')
      } else {
        return 'In progress'
      }
    },

    setupRealtimeSubscription: (projectId: string) => {
      // Subscribe to changes
      const subscription = supabase
        .channel(`milestones:${projectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'milestones',
            filter: `project_id=eq.${projectId}`
          },
          async (payload) => {
            // Refetch all milestones to ensure consistent state
            const { data, error } = await supabase
              .from('milestones')
              .select('*')
              .eq('project_id', projectId)
              .order('date', { ascending: true })

            if (!error && data) {
              const milestones = data.map(milestone => ({
                id: milestone.id,
                title: milestone.title,
                description: milestone.description,
                date: milestone.date,
                status: milestone.status,
                projectId: milestone.project_id,
                createdBy: milestone.created_by,
                createdAt: milestone.created_at,
                updatedAt: milestone.updated_at
              }))
              set({ milestones })
            }
          }
        )
        .subscribe()

      // Return cleanup function
      return () => {
        subscription.unsubscribe()
      }
    }
  }
})
