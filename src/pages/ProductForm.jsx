import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'

export default function ProductForm() {
  const { id } = useParams()
  const edit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (edit) {
      api.get(`/api/products/${id}`)
        .then((p) => setForm({ name: p.name, description: p.description || '', price: String(p.price), stock: String(p.stock) }))
        .catch((err) => setError(err.detail || 'Failed to load product'))
    }
  }, [edit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    const body = { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock) }
    setError('')
    setSaving(true)
    try {
      if (edit) {
        await api.put(`/api/products/${id}`, body)
      } else {
        await api.post('/api/products', body)
      }
      navigate('/products')
    } catch (err) {
      setError(err.detail || 'Failed to save product')
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-zinc-500">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{edit ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{edit ? 'Update product details' : 'Create a new product'}</p>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input id="name" value={form.name} onChange={set('name')} required className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Input id="description" value={form.description} onChange={set('description')} className="h-10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price</Label>
              <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium">Stock</Label>
              <Input id="stock" type="number" min="0" step="1" value={form.stock} onChange={set('stock')} required className="h-10" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : edit ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/products')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
