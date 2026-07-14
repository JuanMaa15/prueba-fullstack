import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { ToastContainer } from '@/components/ui/Toast'
import { LoginPage } from '@/pages/LoginPage'
import { PatientsPage } from '@/pages/PatientsPage'
import { DashboardPage } from '@/pages/DashboardPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/pacientes" element={<PatientsPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/pacientes" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
