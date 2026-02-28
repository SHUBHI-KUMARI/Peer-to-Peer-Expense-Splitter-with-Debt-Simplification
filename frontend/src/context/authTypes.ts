import { createContext } from 'react'
import type { User } from '../services/api'

export interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: {
    username: string
    email: string
    password: string
    phoneNumber?: string
  }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | undefined>(undefined)
