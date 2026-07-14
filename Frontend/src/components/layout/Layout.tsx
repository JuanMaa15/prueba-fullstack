import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
