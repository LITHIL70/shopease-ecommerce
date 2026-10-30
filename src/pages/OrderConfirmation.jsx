import { Link } from 'react-router-dom'

function OrderConfirmation() {
  let order = null
  try {
    const savedOrder = localStorage.getItem('shopease-last-order')
    order = savedOrder ? JSON.parse(savedOrder) : null
  } catch {
    order = null
  }

  if (!order || !order.orderNumber) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">No recent order found</h1>
        <p className="mt-3 text-slate-600">Place a demo order first to see the confirmation page.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Continue Shopping</Link>
      </main>
    )
  }

  const customer = order.customer || {}
  const items = Array.isArray(order.items) ? order.items : []

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <section className="rainbow-matte-panel rounded-2xl p-6 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700" aria-hidden="true">✓</div>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-900">Thank you for your order!</h1>
        <p className="mt-3 text-slate-600">Your ShopEase demo order has been placed successfully.</p>
        <p className="mt-5 text-sm text-slate-500">Order number</p>
        <p className="mt-1 text-xl font-bold text-indigo-600">{order.orderNumber}</p>
        <p className="mt-2 text-xs text-slate-500">Demo only — no payment was processed.</p>
      </section>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rainbow-matte-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold">Shipping Details</h2>
          <p className="mt-4 font-semibold">{customer.fullName}</p>
          <p className="mt-1 text-slate-600">{customer.email}</p>
          <p className="mt-1 text-slate-600">{customer.phone}</p>
          <p className="mt-3 text-slate-600">{customer.address}</p>
          <p className="text-slate-600">{[customer.city, customer.state, customer.postalCode].filter(Boolean).join(', ')}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="my-5 border-t border-slate-200" />
          <div className="flex justify-between text-slate-600"><span>Shipping</span><span>Free</span></div>
          <div className="mt-3 flex justify-between text-lg font-bold"><span>Total</span><span>${Number(order.total || 0).toFixed(2)}</span></div>
        </section>
      </div>
      <div className="mt-8 text-center">
        <Link to="/" className="inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Continue Shopping</Link>
      </div>
    </main>
  )
}
export default OrderConfirmation
