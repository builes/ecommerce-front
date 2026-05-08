import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Package, ShoppingCart, Users, Shield, ArrowRight } from 'lucide-react'

const cards = [
  { to: '/products', label: 'Products', desc: 'Browse, create and manage products', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', admin: false },
  { to: '/orders', label: 'Orders', desc: 'View orders and create new ones', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50', admin: false },
  { to: '/users', label: 'Users', desc: 'Manage user accounts', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', admin: true },
  { to: '/roles', label: 'Roles', desc: 'Manage roles and permissions', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', admin: true },
]

export default function Dashboard() {
  const { user, isAdmin } = useAuth()

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Welcome, {user?.username}</h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-1">What would you like to do today?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {cards
          .filter((c) => !c.admin || isAdmin)
          .map((c) => (
            <Link key={c.to} to={c.to} className="group block">
              <div className="bg-white rounded-xl border border-zinc-200 p-6 transition-all duration-200 hover:shadow-lg hover:border-zinc-300 hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <c.icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">{c.label}</h3>
                <p className="mt-1 text-sm text-zinc-500">{c.desc}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}
