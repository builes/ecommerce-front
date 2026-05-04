import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/auth/register', form)
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(err.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">EC</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-zinc-900">Create Account</h1>
          <p className="mt-1 text-sm text-zinc-500">Register a new account</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input id="username" value={form.username} onChange={set('username')} autoFocus required minLength={3} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={set('email')} required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={set('password')} required minLength={6} className="h-10" />
            </div>
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-900 font-medium underline underline-offset-2 hover:text-zinc-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
