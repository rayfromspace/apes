import { create } from 'zustand'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type TeamRole = 'founder' | 'admin' | 'member'
export type TeamMemberStatus = 'active' | 'inactive' | 'pending'

// Database schema interfaces
interface DbTeamMember {
  id: string
  project_id: string
  user_id: string
  role: TeamRole
  permissions: Record<string, any>
  salary: number
  status: TeamMemberStatus
  last_active: string
  created_at: string
  updated_at: string
  user: {
    email: string
    full_name?: string
  }
}

interface DbTeamInvite {
  id: string
  project_id: string
  email: string
  role: TeamRole
  permissions: Record<string, any>
  invited_by: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

// UI interfaces with additional computed fields
export interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  permissions: Record<string, any>
  salary: number
  status: TeamMemberStatus
  lastActive: string
  projectId: string
  userId: string
  user?: {
    email: string
    full_name?: string
  }
}

interface TeamInvite {
  id: string
  email: string
  role: TeamRole
  permissions: Record<string, any>
  status: 'pending' | 'accepted' | 'rejected'
  invitedBy: string
  projectId: string
  createdAt: string
}

interface TeamState {
  members: TeamMember[]
  invites: TeamInvite[]
  loading: boolean
  error: string | null
  fetchMembers: (projectId: string) => Promise<void>
  inviteMember: (projectId: string, email: string, role: TeamRole, permissions: Record<string, any>) => Promise<void>
  updateMemberRole: (memberId: string, role: TeamRole, permissions: Record<string, any>) => Promise<void>
  updateMemberSalary: (memberId: string, salary: number) => Promise<void>
  updateMemberStatus: (memberId: string, status: TeamMemberStatus) => Promise<void>
  removeMember: (memberId: string) => Promise<void>
  subscribeToTeamChanges: (projectId: string) => void
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  invites: [],
  loading: false,
  error: null,

  fetchMembers: async (projectId: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClientComponentClient()

      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          id,
          project_id,
          user_id,
          role,
          permissions,
          salary,
          status,
          last_active,
          created_at,
          updated_at,
          user:user_id (
            email,
            full_name
          )
        `)
        .eq('project_id', projectId)

      if (error) throw error

      const transformedMembers: TeamMember[] = members.map((member: DbTeamMember) => ({
        id: member.id,
        name: member.user?.full_name || member.user?.email.split('@')[0] || 'Unknown',
        email: member.user?.email || '',
        role: member.role,
        permissions: member.permissions,
        salary: member.salary,
        status: member.status,
        lastActive: member.last_active,
        projectId: member.project_id,
        userId: member.user_id,
        user: member.user
      }))

      set({ members: transformedMembers, loading: false })
    } catch (error) {
      console.error('Error fetching team members:', error)
      set({ error: 'Failed to load team members', loading: false })
    }
  },

  inviteMember: async (projectId: string, email: string, role: TeamRole, permissions: Record<string, any>) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data: invite, error } = await supabase
        .from('team_invites')
        .insert({
          project_id: projectId,
          email,
          role,
          permissions,
          invited_by: supabase.auth.user()?.id,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      set(state => ({
        invites: [...state.invites, {
          id: invite.id,
          email: invite.email,
          role: invite.role,
          permissions: invite.permissions,
          projectId: invite.project_id,
          invitedBy: invite.invited_by,
          status: invite.status,
          createdAt: invite.created_at
        }],
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateMemberRole: async (memberId: string, role: TeamRole, permissions: Record<string, any>) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role, permissions })
        .eq('id', memberId)

      if (error) throw error

      set(state => ({
        members: state.members.map(member =>
          member.id === memberId
            ? { ...member, role, permissions }
            : member
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateMemberSalary: async (memberId: string, salary: number) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase
        .from('team_members')
        .update({ salary })
        .eq('id', memberId)

      if (error) throw error

      set(state => ({
        members: state.members.map(member =>
          member.id === memberId
            ? { ...member, salary }
            : member
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateMemberStatus: async (memberId: string, status: TeamMemberStatus) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase
        .from('team_members')
        .update({ 
          status,
          last_active: status === 'active' ? new Date().toISOString() : null
        })
        .eq('id', memberId)

      if (error) throw error

      set(state => ({
        members: state.members.map(member =>
          member.id === memberId
            ? { ...member, status }
            : member
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  removeMember: async (memberId: string) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      set(state => ({
        members: state.members.filter(member => member.id !== memberId),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  subscribeToTeamChanges: (projectId: string) => {
    const supabase = createClientComponentClient()

    // Subscribe to team_members changes
    const teamSubscription = supabase
      .channel('team_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_members',
        filter: `project_id=eq.${projectId}`
      }, () => {
        get().fetchMembers(projectId)
      })
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      teamSubscription.unsubscribe()
    }
  }
}))
