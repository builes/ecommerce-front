import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/users')
      .then((data) => setUsers(data.content))
      .catch((err) => setError(err.detail || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/api/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      if (err.status === 500) {
        alert('Cannot delete user. The user may have orders or other data linked to it.')
      } else {
        alert(err.detail || 'Delete failed')
      }
    }
  }

  if (loading) return <p className="text-zinc-500">Loading…</p>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Users</h1>
          <p className="text-sm text-zinc-500 mt-0.5 sm:mt-1">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/users/new" className="self-start sm:self-auto">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New User
          </Button>
        </Link>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="mt-2 text-sm text-zinc-400">No users found</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-zinc-900 truncate">{u.username}</div>
                    <p className="text-sm text-zinc-500 truncate mt-0.5">{u.email}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {u.roles?.map((r) => (
                        <Badge key={r} variant={r === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link to={`/users/${u.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}
                      className="text-zinc-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-xl border border-zinc-200 overflow-x-auto shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">ID</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Username</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Email</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Roles</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">{u.id}</td>
                    <td className="px-5 py-4 font-medium text-zinc-900">{u.username}</td>
                    <td className="px-5 py-4 text-sm text-zinc-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles?.map((r) => (
                          <Badge key={r} variant={r === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Link to={`/users/${u.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}
                          className="text-zinc-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
