"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Profile } from '@/lib/supabase'

const debug = (message: string, data?: any) => {
  console.log(`[Auth Debug] ${message}`, data || '')
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    debug('Initializing auth listener')
    checkUser()
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      debug('Auth state changed:', { event: _event, userId: session?.user?.id })
      
      if (session?.user) {
        try {
          debug('Session exists, fetching profile')
          const profile = await getProfile(session.user.id)
          debug('Profile fetch result:', profile)
          
          if (_event === 'SIGNED_IN') {
            debug('Sign in event detected, redirecting to dashboard')
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          debug('Error in auth state change:', error)
        }
      } else {
        debug('No session, clearing user state')
        setUser(null)
        if (_event === 'SIGNED_OUT') {
          debug('Sign out event detected, redirecting to login')
          router.push('/login')
        }
      }
      setLoading(false)
    })

    return () => {
      debug('Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [router])

  async function checkUser() {
    debug('Checking current user session')
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        debug('Session error:', sessionError)
        throw sessionError
      }

      debug('Current session:', { userId: session?.user?.id })
      
      if (session?.user) {
        debug('Session exists, fetching profile')
        await getProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      debug('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  async function getProfile(userId: string) {
    debug('Fetching profile for user:', userId)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        debug('Profile fetch error:', error)
        // If profile doesn't exist yet (during registration), don't throw
        if (error.code === 'PGRST116') {
          debug('No profile found (normal during registration)')
          return null
        }
        throw error
      }

      debug('Profile fetched successfully:', data)
      setUser(data)
      return data
    } catch (error) {
      console.error('Error loading profile:', error)
      debug('Error loading profile:', error)
      toast.error('Error loading user profile')
      setUser(null)
      return null
    }
  }

  async function createProfile(userId: string, email: string, username: string, role: string) {
    debug('Creating new profile:', { userId, email, username, role })
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            username,
            role,
          },
        ])
        .single()

      if (error) {
        debug('Profile creation error:', error)
        throw error
      }

      debug('Profile created successfully')
      // Fetch the newly created profile
      return await getProfile(userId)
    } catch (error) {
      console.error('Error creating profile:', error)
      debug('Error creating profile:', error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    debug('Attempting login:', { email })
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        debug('Login error:', error)
        throw error
      }

      if (!data?.user) {
        debug('No user data received from login')
        throw new Error('No user data received')
      }

      debug('Login successful:', { userId: data.user.id })
      const profile = await getProfile(data.user.id)
      
      if (!profile) {
        debug('No profile found after login')
        throw new Error('Profile not found')
      }

      debug('Profile loaded successfully')
      toast.success('Successfully logged in!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      debug('Login error:', error)
      toast.error(error.message || 'Failed to log in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, username: string, role: string) => {
    debug('Attempting registration:', { email, username, role })
    try {
      setLoading(true)

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        debug('Registration error:', error)
        throw error
      }

      if (!user) {
        debug('No user data received from registration')
        throw new Error('No user data received')
      }

      debug('User created successfully:', { userId: user.id })
      
      // Create profile for the new user
      const profile = await createProfile(user.id, email, username, role)
      debug('Profile creation result:', profile)
      
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error)
      debug('Registration error:', error)
      toast.error(error.message || 'Failed to register')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    debug('Attempting logout')
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        debug('Logout error:', error)
        throw error
      }

      debug('Logout successful')
      setUser(null)
      toast.success('Successfully logged out!')
      router.push('/login')
    } catch (error: any) {
      console.error('Logout error:', error)
      debug('Logout error:', error)
      toast.error(error.message || 'Failed to log out')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
  }
}