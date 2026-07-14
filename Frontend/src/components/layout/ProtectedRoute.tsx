import { Navigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import type { Rol } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Rol[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/pacientes" replace />
  }

  return <>{children}</>
}
