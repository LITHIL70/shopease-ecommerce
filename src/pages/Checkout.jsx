import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Checkout() {
  const { cart, cartCount, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '' })
  const [error, setError] = useState('')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [paymentStatus, setPaymentStatus] = useState('idle')
  const [razorpayError, setRazorpayError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!cart.length) return setError('Your cart is empty. Add products before checkout.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Please enter a valid email address.')
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 15) return setError('Enter a phone number with 10 to 15 digits.')
    if (!/^[a-zA-Z0-9 -]{4,10}$/.test(form.postalCode.trim())) return setError('Enter a valid postal or ZIP code (4–10 characters).')
    setPaymentOpen(true)
  }

  function simulatePayment() {
    if (paymentStatus === 'processing') return
    setPaymentStatus('processing')
    window.setTimeout(() => {
      const order = {
        orderNumber: `SE-${Date.now().toString().slice(-8)}`,
        paymentId: `pay_demo_${Math.random().toString(36).slice(2, 10)}`,
        paymentMethod,
        paymentStatus: 'SIMULATED_SUCCESS',
        customer: form,
        items: cart,
        itemCount: cartCount,
        subtotal: cartTotal,
        shipping: 0,
        total: cartTotal,
        createdAt: new Date().toISOString(),
        demo: true,
      }
      try {
        localStorage.setItem('shopease-last-order', JSON.stringify(order))
        clearCart()
        setPaymentStatus('success')
        window.setTimeout(() => navigate('/order-confirmation'), 1100)
      } catch {
        setPaymentStatus('idle')
        setError('Could not save your demo order. Check your browser storage.')
        setPaymentOpen(false)
      }
    }, 2200)
  }

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  async function payWithRazorpay() {
    if (paymentStatus === 'processing') return
    setRazorpayError('')
    setPaymentStatus('processing')
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Could not load Razorpay Checkout. Check your internet connection.')
      const orderResponse = await fetch('http://localhost:5001/api/razorpay/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(cartTotal * 83 * 100) }),
      })
      const orderData = await orderResponse.json()
      if (!orderResponse.ok) throw new Error(orderData.error || 'Could not create Razorpay order.')
      const options = {
        key: orderData.keyId, amount: orderData.amount, currency: orderData.currency,
        name: 'ShopEase', description: 'ShopEase order payment (test mode)', order_id: orderData.orderId,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('http://localhost:5001/api/razorpay/verify', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }),
            })
            const verification = await verifyResponse.json()
            if (!verifyResponse.ok || !verification.verified) throw new Error(verification.error || 'Payment verification failed.')
            const order = { orderNumber: 'SE-' + Date.now().toString().slice(-8), paymentId: response.razorpay_payment_id, paymentMethod: 'razorpay', paymentStatus: 'PAID_TEST', customer: form, items: cart, itemCount: cartCount, subtotal: cartTotal, shipping: 0, total: cartTotal, createdAt: new Date().toISOString(), demo: true }
            localStorage.setItem('shopease-last-order', JSON.stringify(order))
            clearCart()
            setPaymentStatus('success')
            window.setTimeout(() => navigate('/order-confirmation'), 1100)
          } catch (err) { setRazorpayError(err.message || 'Payment verification failed.'); setPaymentStatus('idle') }
        },
        modal: { ondismiss: () => setPaymentStatus('idle') },
      }
      setPaymentStatus('idle')
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (event) => { setRazorpayError(event.error && event.error.description ? event.error.description : 'Razorpay test payment failed.'); setPaymentStatus('idle') })
      razorpay.open()
    } catch (err) { setRazorpayError(err.message || 'Unable to start Razorpay payment.'); setPaymentStatus('idle') }
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
      <p className="mt-2 text-slate-500">Enter your shipping details and continue to the demo payment screen.</p>
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
          <button type="submit" className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700">Continue to Demo Payment · ${cartTotal.toFixed(2)}</button>
          <p className="text-center text-xs text-slate-500">Demo checkout only. No real payment details or money are processed.</p>
        </form>
        <aside className="rainbow-matte-panel h-fit rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt="" className="h-14 w-14 rounded-lg bg-slate-50 object-contain p-1" />
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium text-slate-800">{item.title}</p><p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p></div>
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

      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="payment-title">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-[#172b55] px-6 py-5 text-white">
              <div className="flex items-center justify-between"><span className="text-lg font-bold tracking-wide">Razorpay-style checkout</span><span className="rounded bg-white/15 px-2 py-1 text-xs">DEMO</span></div>
              <p className="mt-3 text-sm text-blue-100">ShopEase · Test payment experience</p>
              <p className="mt-1 text-2xl font-bold">₹{(cartTotal * 83).toFixed(2)}</p>
            </div>
            <div className="p-6">
              {paymentStatus === 'success' ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-20 w-20 animate-[pop_0.35s_ease-out] items-center justify-center rounded-full bg-green-100 text-5xl text-green-600">✓</div>
                  <h2 className="mt-5 text-2xl font-bold text-slate-900">Payment successful!</h2>
                  <p className="mt-2 text-sm text-slate-500">Demo transaction completed. Redirecting to your order…</p>
                </div>
              ) : paymentStatus === 'processing' ? (
                <div className="py-10 text-center">
                  <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                  <h2 className="mt-5 text-xl font-bold">Processing payment</h2>
                  <p className="mt-2 text-sm text-slate-500">Please wait while we simulate a secure transaction…</p>
                  <div className="mx-auto mt-5 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-100"><div className="h-full w-full origin-left animate-[progress_2.2s_linear] rounded-full bg-indigo-600" /></div>
                </div>
              ) : (
                <>
                  <h2 id="payment-title" className="text-lg font-bold text-slate-900">Choose payment method</h2>
                  <div className="mt-4 space-y-3">
                    {[['upi','UPI','GPay · PhonePe · Paytm'],['card','Cards','Credit or debit card (demo)'],['netbanking','Netbanking','All major banks (demo)'],['razorpay','Razorpay','Pay securely with Razorpay Test Mode']].map(([value,label,sub]) => (
                      <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>
                        <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
                        <span><span className="block font-semibold text-slate-800">{label}</span><span className="text-xs text-slate-500">{sub}</span></span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">{paymentMethod === 'razorpay' ? 'Razorpay Test Mode: use test credentials only. No real money will be charged.' : 'Simulation only: this is not connected to Razorpay. Do not enter card, UPI, or banking credentials. No real transaction will occur.'}</p>
                  {razorpayError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{razorpayError}</p>}
                  {paymentMethod === 'razorpay' ? <button onClick={payWithRazorpay} className="mt-5 w-full rounded-xl bg-[#2563eb] px-5 py-3.5 font-semibold text-white hover:bg-blue-700">Pay with Razorpay · ₹{(cartTotal * 83).toFixed(2)}</button> : <button onClick={simulatePayment} className="mt-5 w-full rounded-xl bg-[#2563eb] px-5 py-3.5 font-semibold text-white hover:bg-blue-700">Simulate payment · ₹{(cartTotal * 83).toFixed(2)}</button>}
                  <button onClick={() => setPaymentOpen(false)} className="mt-3 w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } } @keyframes pop { 0% { transform: scale(.4); opacity: 0; } 80% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </main>
  )
}
export default Checkout
