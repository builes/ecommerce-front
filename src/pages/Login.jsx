import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.detail || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">EC</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-zinc-900">E-Commerce API</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to your account</p>
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
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-10" />
            </div>
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-zinc-900 font-medium underline underline-offset-2 hover:text-zinc-600">
              Create one
            </Link>
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-100 text-xs text-zinc-400 text-center space-y-1">
            <p>Demo: <span className="font-mono text-zinc-600">admin</span> / <span className="font-mono text-zinc-600">admin123</span></p>
            <p>User: <span className="font-mono text-zinc-600">user</span> / <span className="font-mono text-zinc-600">user123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
