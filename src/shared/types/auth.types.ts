import type { User, Session } from '@supabase/supabase-js'

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
}

export interface AuthState {
  user: User | null
  session: Session | null
  initialized: boolean
}

export interface AuthResponse {
  user: User | null
  session: Session | null
  error: Error | null
}
