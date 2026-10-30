import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Checkout() {
  const { cart, cartCount, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '' })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!cart.length) {
      setError('Your cart is empty. Add products before checkout.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 15) {
      setError('Enter a phone number with 10 to 15 digits.')
      return
    }
    if (!/^[a-zA-Z0-9 -]{4,10}$/.test(form.postalCode.trim())) {
      setError('Enter a valid postal or ZIP code (4–10 characters).')
      return
    }
    const order = {
      orderNumber: `SE-${Date.now().toString().slice(-8)}`,
      customer: form,
      items: cart,
      itemCount: cartCount,
      subtotal: cartTotal,
      shipping: 0,
      total: cartTotal,
      createdAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem('shopease-last-order', JSON.stringify(order))
    } catch {
      setError('Could not save your demo order. Check your browser storage.')
      return
    }
    clearCart()
    navigate('/order-confirmation')
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  if (!cart.length) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add some products before checkout.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Explore Products</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link to="/cart" className="font-medium text-indigo-600 hover:text-indigo-800">← Back to Cart</Link>
      <h1 className="mt-5 text-3xl font-extrabold">Checkout</h1>
      <p className="mt-2 text-slate-500">Enter your shipping details to place a demo order.</p>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="rainbow-matte-panel space-y-6 rounded-2xl p-6 lg:col-span-2">
          <section>
            <h2 className="text-xl font-bold">Shipping Information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">Full Name *
                <input name="fullName" value={form.fullName} onChange={handleChange} autoComplete="name" required maxLength={100} className={inputClass} placeholder="Enter your full name" />
              </label>
              <label className="text-sm font-medium text-slate-700">Email Address *
                <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required className={inputClass} placeholder="you@example.com" />
              </label>
              <label className="text-sm font-medium text-slate-700">Phone Number *
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" required className={inputClass} placeholder="Enter phone number" />
              </label>
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">Street Address *
                <input name="address" value={form.address} onChange={handleChange} autoComplete="street-address" required maxLength={200} className={inputClass} placeholder="House number, street, area" />
              </label>
              <label className="text-sm font-medium text-slate-700">City *
                <input name="city" value={form.city} onChange={handleChange} autoComplete="address-level2" required maxLength={100} className={inputClass} placeholder="Enter city" />
              </label>
              <label className="text-sm font-medium text-slate-700">State *
                <input name="state" value={form.state} onChange={handleChange} autoComplete="address-level1" required maxLength={100} className={inputClass} placeholder="Enter state" />
              </label>
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">Postal / ZIP Code *
                <input name="postalCode" value={form.postalCode} onChange={handleChange} autoComplete="postal-code" required maxLength={10} className={inputClass} placeholder="Enter postal code" />
              </label>
            </div>
          </section>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700">Place Demo Order</button>
          <p className="text-center text-xs text-slate-500">Demo only. No payment details are requested or processed.</p>
        </form>
        <aside className="rainbow-matte-panel h-fit rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt="" className="h-14 w-14 rounded-lg bg-slate-50 object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="my-5 border-t border-slate-200" />
          <div className="flex justify-between text-sm text-slate-600"><span>Items ({cartCount})</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="mt-3 flex justify-between text-sm text-slate-600"><span>Shipping</span><span className="font-medium text-green-600">Free</span></div>
          <div className="my-5 border-t border-slate-200" />
          <div className="flex justify-between gap-3 text-lg font-bold"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
        </aside>
      </div>
    </main>
  )
}
export default Checkout
