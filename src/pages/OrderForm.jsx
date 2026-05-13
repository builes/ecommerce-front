import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

export default function OrderForm() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/products')
      .then((data) => setProducts(data.content))
      .catch(() => {})
  }, [])

  function addItem() {
    setItems((prev) => [...prev, { productId: '', quantity: 1 }])
  }

  function removeItem(i) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  function setItem(i, field) {
    return (e) => setItems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: field === 'quantity' ? Number(e.target.value) : e.target.value }
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/api/orders', { items: items.filter((i) => i.productId).map((i) => ({ productId: Number(i.productId), quantity: i.quantity })) })
      navigate('/orders')
    } catch (err) {
      setError(err.detail || 'Failed to create order')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-zinc-500">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">New Order</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Create a new order with line items</p>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5 h-8 text-xs">
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end">
                  <div className="flex-1 min-w-0">
                    {i === 0 && <Label className="text-xs text-zinc-400 mb-1 block">Product</Label>}
                    <select
                      value={item.productId}
                      onChange={setItem(i, 'productId')}
                      className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ${Number(p.price).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 sm:gap-3 items-end">
                    <div className="w-20 sm:w-24">
                      {i === 0 && <Label className="text-xs text-zinc-400 mb-1 block">Qty</Label>}
                      <Input type="number" min="1" value={item.quantity} onChange={setItem(i, 'quantity')} className="h-10 text-center" />
                    </div>
                    {items.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}
                        className="text-zinc-400 hover:text-red-500 mb-0.5 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Creating…' : 'Create Order'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/orders')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
