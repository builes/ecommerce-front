import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, ShieldCheck, Shield } from 'lucide-react'

export default function UserForm() {
  const { id } = useParams()
  const edit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [allRoles, setAllRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function toggleRole(role) {
    setSelectedRoles((prev) =>
      prev.find((r) => r.name === role.name) ? prev.filter((r) => r.name !== role.name) : [...prev, role]
    )
  }

  function isSelected(role) {
    return selectedRoles.some((r) => r.name === role.name)
  }

  useEffect(() => {
    api.get('/api/roles')
      .then((data) => {
        const roles = data.content || data
        setAllRoles(roles)
        if (edit) {
          api.get(`/api/users/${id}`)
            .then((u) => {
              setForm({ username: u.username, email: u.email || '', password: '' })
              setSelectedRoles(roles.filter((r) => (u.roles || []).includes(r.name)))
            })
            .catch((err) => setError(err.detail || 'Failed to load user'))
        }
      })
      .catch(() => {})
  }, [edit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    const body = {
      username: form.username,
      email: form.email,
      password: form.password,
      roles: selectedRoles.map((r) => r.name),
    }
    setError('')
    setSaving(true)
    try {
      if (edit) {
        await api.put(`/api/users/${id}`, body)
      } else {
        await api.post('/api/users', body)
      }
      navigate('/users')
    } catch (err) {
      setError(err.detail || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')} className="text-zinc-500">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{edit ? 'Edit User' : 'New User'}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{edit ? 'Update user details' : 'Create a new user'}</p>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            <Input id="username" value={form.username} onChange={set('username')} required className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={set('email')} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={set('password')}
              className="h-10" required />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Roles</Label>
              <p className="text-xs text-zinc-400 mt-0.5">Click a role to toggle it on or off</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allRoles.map((r) => {
                const on = isSelected(r)
                return (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => toggleRole(r)}
                    className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all ${
                      on
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    {on ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    {r.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : edit ? 'Update User' : 'Create User'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/users')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
