import { supabase } from '@/infrastructure/supabase/client'
import type {
  SignInCredentials,
  SignUpCredentials,
  ForgotPasswordData,
} from '@shared/types/auth.types'

export const authApi = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
    return data
  },

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
        },
      },
    })

    if (error) throw error
    return data
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Get the current user session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  /**
   * Get the current user
   */
  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  /**
   * Send password reset email
   */
  async resetPasswordForEmail(data: ForgotPasswordData) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return data
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
