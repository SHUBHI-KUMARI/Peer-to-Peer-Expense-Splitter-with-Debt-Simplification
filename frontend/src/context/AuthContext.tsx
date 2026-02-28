import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  authApi,
  setTokens,
  clearTokens,
  getAccessToken,
} from '../services/api'
import { AuthContext } from './authTypes'

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<import('../services/api').User | null>(null)
  const [loading, setLoading] = useState(() => !!getAccessToken())

  /* On mount, hydrate user from stored token */
  useEffect(() => {
    if (!loading) return
    let cancelled = false
    authApi
      .getMe()
      .then(({ user }) => { if (!cancelled) setUser(user) })
      .catch(() => { if (!cancelled) clearTokens() })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loading])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    setTokens(res.accessToken, res.refreshToken)
    setUser(res.user)
  }, [])

  const signup = useCallback(
    async (data: {
      username: string
      email: string
      password: string
      phoneNumber?: string
    }) => {
      const res = await authApi.register(data)
      setTokens(res.accessToken, res.refreshToken)
      setUser(res.user)
    },
    [],
  )

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
