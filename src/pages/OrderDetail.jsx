import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/orders/${id}`)
      .then(setOrder)
      .catch((err) => setError(err.detail || 'Failed to load order'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-zinc-500">Loading…</p>
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
  if (!order) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-zinc-500 shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 truncate">Order #{order.id}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{order.orderDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Customer</h3>
          <p className="mt-2 text-zinc-900 font-medium break-words">{order.username}</p>
          <p className="mt-1 text-sm text-zinc-400 break-words">User ID: {order.userId}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Summary</h3>
          <p className="mt-2 text-xl sm:text-2xl font-bold text-zinc-900">${Number(order.total).toFixed(2)}</p>
          <p className="mt-1 text-sm text-zinc-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Items</h3>
        <div className="md:hidden space-y-3">
          {order.items.map((item, i) => (
            <div key={item.id || i} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-zinc-900 text-sm break-words">{item.productName}</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="font-mono text-zinc-600">${Number(item.price).toFixed(2)} × {item.quantity}</span>
                    <span className="font-mono text-zinc-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-500">Total</span>
              <span className="font-bold font-mono text-zinc-900">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block bg-white rounded-xl border border-zinc-200 overflow-x-auto shadow-sm">
          <div className="px-5 py-3.5 border-b border-zinc-100">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Items</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3">Qty</th>
                <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {order.items.map((item, i) => (
                <tr key={item.id || i} className="hover:bg-zinc-50">
                  <td className="px-5 py-3.5 text-sm font-medium text-zinc-900">{item.productName}</td>
                  <td className="px-5 py-3.5 text-sm text-right font-mono text-zinc-600">${Number(item.price).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-sm text-right text-zinc-900">{item.quantity}</td>
                  <td className="px-5 py-3.5 text-sm text-right font-mono text-zinc-900 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-50/50">
                <td colSpan={3} className="px-5 py-3.5 text-sm font-medium text-zinc-500 text-right">Total</td>
                <td className="px-5 py-3.5 text-sm font-bold text-right font-mono text-zinc-900">
                  ${Number(order.total).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
