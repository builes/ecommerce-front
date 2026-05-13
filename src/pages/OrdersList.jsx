import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Eye, Trash2, ShoppingCart } from 'lucide-react'

export default function OrdersList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/orders')
      .then((data) => setOrders(data.content))
      .catch((err) => setError(err.detail || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this order?')) return
    try {
      await api.delete(`/api/orders/${id}`)
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } catch (err) {
      alert(err.detail || 'Delete failed')
    }
  }

  if (loading) return <p className="text-zinc-500">Loading…</p>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-500 mt-0.5 sm:mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/orders/new" className="self-start sm:self-auto">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </Link>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="mt-2 text-sm text-zinc-400">No orders yet</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500">#{o.id}</span>
                      <span className="font-medium text-zinc-900 truncate">{o.username}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="font-mono text-zinc-900 font-medium">${Number(o.total).toFixed(2)}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5">{o.orderDate}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link to={`/orders/${o.id}`}>
                      <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(o.id)}
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
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">User</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Items</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Total</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Date</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">#{o.id}</td>
                    <td className="px-5 py-4 text-sm font-medium text-zinc-900">{o.username}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-zinc-900">${Number(o.total).toFixed(2)}</td>
                    <td className="px-5 py-4 text-sm text-zinc-500">{o.orderDate}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Link to={`/orders/${o.id}`}>
                          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(o.id)}
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
