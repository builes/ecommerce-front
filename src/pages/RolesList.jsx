import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Pencil, Shield } from 'lucide-react'

export default function RolesList() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/roles')
      .then((data) => setRoles(data.content || data))
      .catch((err) => setError(err.detail || 'Failed to load roles'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-zinc-500">Loading…</p>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Roles</h1>
          <p className="text-sm text-zinc-500 mt-0.5 sm:mt-1">{roles.length} role{roles.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/roles/new" className="self-start sm:self-auto">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Role
          </Button>
        </Link>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {roles.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="mt-2 text-sm text-zinc-400">No roles defined</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {roles.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-zinc-900">{r.name}</div>
                    <p className="text-xs text-zinc-400 mt-0.5">ID: {r.id}</p>
                  </div>
                  <Link to={`/roles/${r.id}/edit`}>
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 shrink-0">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-xl border border-zinc-200 overflow-x-auto shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">ID</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Name</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {roles.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">{r.id}</td>
                    <td className="px-5 py-4 font-medium text-zinc-900">{r.name}</td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/roles/${r.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
