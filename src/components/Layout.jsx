import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, Users, Shield, LayoutDashboard } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['*'] },
  { to: '/products', label: 'Products', icon: Package, roles: ['*'] },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['*'] },
  { to: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  { to: '/roles', label: 'Roles', icon: Shield, roles: ['ADMIN'] },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-zinc-100 pb-16 md:pb-0">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">EC</span>
            </div>
            <span className="font-semibold text-base text-zinc-900 truncate">E-Commerce API</span>
          </Link>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600 shrink-0">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-sm min-w-0">
                <span className="text-zinc-900 font-medium truncate max-w-[100px] block">{user?.username}</span>
                {isAdmin && (
                  <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-medium">
                    admin
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-zinc-500 hover:text-zinc-900 shrink-0">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        <nav className="w-52 shrink-0 hidden md:block">
          <div className="space-y-1 sticky top-24">
            {navItems
              .filter((i) => i.roles.includes('*') || i.roles.includes('ADMIN') === isAdmin)
              .map((i) => {
                const active = pathname === i.to || (i.to !== '/' && pathname.startsWith(i.to))
                return (
                  <Link
                    key={i.to}
                    to={i.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                    }`}
                  >
                    <i.icon className="w-4 h-4" />
                    {i.label}
                  </Link>
                )
              })}
          </div>
        </nav>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-0.5">
          {navItems
            .filter((i) => i.roles.includes('*') || i.roles.includes('ADMIN') === isAdmin)
            .map((i) => {
              const active = pathname === i.to || (i.to !== '/' && pathname.startsWith(i.to))
              return (
                <Link
                  key={i.to}
                  to={i.to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-lg text-[11px] font-medium transition-colors min-w-0 ${
                    active
                      ? 'text-zinc-900'
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <i.icon className="w-5 h-5" />
                  <span className="truncate max-w-full leading-tight">{i.label}</span>
                </Link>
              )
            })}
        </div>
      </nav>
    </div>
  )
}
