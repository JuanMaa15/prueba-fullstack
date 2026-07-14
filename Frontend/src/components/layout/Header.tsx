import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.nombre}</span>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
