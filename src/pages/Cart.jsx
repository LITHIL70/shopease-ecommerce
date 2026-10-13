
import { Link } from 'react-router-dom'
import { useCart } from '../Context/CartContext'

function Cart() {
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Shopping Cart
        </h1>

        <Link
          to="/"
          className="font-medium text-indigo-600 hover:text-indigo-800"
        >
          Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-semibold text-slate-800">
            Your cart is empty
          </p>
          <p className="mt-2 text-slate-500">
            Find something you love and add it to your cart.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <section className="space-y-4 md:col-span-2">
            {cart.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-full rounded-xl bg-slate-50 object-contain p-3 sm:w-28"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-800">
                    {item.title}
                  </h2>

                  <p className="mt-2 font-bold text-indigo-600">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="text-sm text-slate-600">
                      Qty:
                      <select
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(
                            item.id,
                            Number(event.target.value)
                          )
                        }
                        className="ml-2 rounded-lg border border-slate-300 p-2"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                          (quantity) => (
                            <option key={quantity} value={quantity}>
                              {quantity}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </article>
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Clear Cart
            </button>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-5 flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="mt-3 flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="my-5 border-t border-slate-200" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                alert('Checkout will be implemented in a future step!')
              }
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Demo checkout — no payment is processed.
            </p>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Cart
