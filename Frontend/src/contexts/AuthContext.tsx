import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types'
import { authService } from '@/services/authService'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (usuario: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getInitialAuthState(): AuthState {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  if (token && userRaw) {
    try {
      const user = JSON.parse(userRaw) as User
      return { token, user, isAuthenticated: true }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
  return { token: null, user: null, isAuthenticated: false }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState)

  const login = useCallback(async (usuario: string, password: string) => {
    const result = await authService.login({ usuario, password })
    localStorage.setItem('token', result.token)
    localStorage.setItem('user', JSON.stringify(result.user))
    setAuthState({ token: result.token, user: result.user, isAuthenticated: true })
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setAuthState({ token: null, user: null, isAuthenticated: false })
    }
  }, [])

  const value = useMemo(() => ({
    ...authState,
    login,
    logout,
  }), [authState, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
