import { NavLink } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import type { Rol } from '@/types'

const navItems: Array<{ to: string; label: string; roles: Rol[] }> = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN'] },
  { to: '/pacientes', label: 'Pacientes', roles: ['ADMIN', 'OPERADOR'] },
]

export function Sidebar() {
  const { user } = useAuth()

  const visibleItems = navItems.filter((item) =>
    user && item.roles.includes(user.rol)
  )

  return (
    <aside className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-semibold tracking-tight">
          Gestión Pacientes
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">{user?.nombre}</p>
        <p className="text-xs text-gray-500 mt-0.5">{user?.rol}</p>
      </div>
    </aside>
  )
}
