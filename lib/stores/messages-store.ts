import { create } from 'zustand'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Chat, Message, ChatParticipant } from '@/types/message'

interface MessagesState {
  chats: Chat[]
  currentChat: Chat | null
  messages: Message[]
  participants: ChatParticipant[]
  loading: boolean
  error: string | null
  fetchChats: (projectId: string) => Promise<void>
  fetchMessages: (chatId: string) => Promise<void>
  fetchParticipants: (chatId: string) => Promise<void>
  sendMessage: (chatId: string, content: string, type?: string) => Promise<void>
  createChat: (projectId: string, name: string, type: 'group' | 'direct', participantIds: string[]) => Promise<void>
  markAsRead: (chatId: string) => Promise<void>
  subscribeToChat: (chatId: string) => () => void
  subscribeToProjectChats: (projectId: string) => () => void
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  participants: [],
  loading: false,
  error: null,

  fetchChats: async (projectId: string) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select(`
          *,
          participants:chat_participants(
            user_id,
            role,
            last_read_at
          ),
          last_message:messages(
            id,
            content,
            type,
            created_at,
            sender:sender_id(
              id,
              email,
              raw_user_meta_data
            )
          )
        `)
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false })
        .limit(1)

      if (chatsError) throw chatsError

      // Get unread counts for each chat
      const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
        const { data: unreadCount } = await supabase
          .rpc('get_unread_count', {
            p_chat_id: chat.id,
            p_user_id: (await supabase.auth.getUser()).data.user?.id
          })

        return {
          ...chat,
          unread_count: unreadCount || 0
        }
      }))

      set({ chats: chatsWithUnread, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchMessages: async (chatId: string) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            id,
            email,
            raw_user_meta_data
          ),
          reads:message_reads(
            user_id,
            read_at
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      set({ messages, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchParticipants: async (chatId: string) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data: participants, error: participantsError } = await supabase
        .from('chat_participants')
        .select(`
          *,
          user:user_id(
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('chat_id', chatId)

      if (participantsError) throw participantsError

      set({ participants, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  sendMessage: async (chatId: string, content: string, type = 'text') => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content,
          type
        })

      if (messageError) throw messageError

      // Fetch updated messages
      await get().fetchMessages(chatId)
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createChat: async (projectId: string, name: string, type: 'group' | 'direct', participantIds: string[]) => {
    const supabase = createClientComponentClient()
    set({ loading: true, error: null })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create chat
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({
          project_id: projectId,
          name,
          type
        })
        .select()
        .single()

      if (chatError) throw chatError

      // Add participants
      const participants = [...new Set([...participantIds, user.id])]
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(
          participants.map(userId => ({
            chat_id: chat.id,
            user_id: userId,
            role: userId === user.id ? 'admin' : 'member'
          }))
        )

      if (participantsError) throw participantsError

      // Refresh chats list
      await get().fetchChats(projectId)
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  markAsRead: async (chatId: string) => {
    const supabase = createClientComponentClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update last read timestamp
      const { error: updateError } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Refresh unread count
      const { data: unreadCount } = await supabase
        .rpc('get_unread_count', {
          p_chat_id: chatId,
          p_user_id: user.id
        })

      set(state => ({
        chats: state.chats.map(chat =>
          chat.id === chatId
            ? { ...chat, unread_count: unreadCount || 0 }
            : chat
        )
      }))
    } catch (error) {
      console.error('Error marking chat as read:', error)
    }
  },

  subscribeToChat: (chatId: string) => {
    const supabase = createClientComponentClient()

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, () => {
        get().fetchMessages(chatId)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  },

  subscribeToProjectChats: (projectId: string) => {
    const supabase = createClientComponentClient()

    // Subscribe to chat updates
    const subscription = supabase
      .channel(`project_chats:${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `project_id=eq.${projectId}`
      }, () => {
        get().fetchChats(projectId)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }
}))
