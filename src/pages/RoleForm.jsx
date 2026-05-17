import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'

export default function RoleForm() {
  const { id } = useParams()
  const edit = Boolean(id)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (edit) {
      api.get(`/api/roles/${id}`)
        .then((r) => setName(r.name))
        .catch((err) => setError(err.detail || 'Failed to load role'))
    }
  }, [edit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (edit) {
        await api.put(`/api/roles/${id}`, { name })
      } else {
        await api.post('/api/roles', { name })
      }
      navigate('/roles')
    } catch (err) {
      setError(err.detail || 'Failed to save role')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/roles')} className="text-zinc-500">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{edit ? 'Edit Role' : 'New Role'}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{edit ? 'Update role name' : 'Create a new role'}</p>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-10" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : edit ? 'Update Role' : 'Create Role'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/roles')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
