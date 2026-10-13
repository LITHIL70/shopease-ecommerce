
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')
        setProduct(null)

        const response = await fetch(
          `https://fakestoreapi.com/products/${id}`
        )

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()

        if (!cancelled) {
          setProduct(data)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load this product. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        <p className="text-lg text-slate-500">
          Loading product details...
        </p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Product unavailable
        </h1>

        <p className="mt-3 text-slate-500">
          {error || 'We could not find this product.'}
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Back to Products
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-800"
      >
        <span aria-hidden="true">←</span>
        Back to Products
      </Link>

      <section className="mt-6 grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
        {/* Product image */}
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-slate-50 p-8">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-96 w-full object-contain"
          />
        </div>

        {/* Product information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>

            <span className="rounded-lg bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              ★ {product.rating?.rate ?? 'N/A'}
              {product.rating?.count != null
                ? ` (${product.rating.count} reviews)`
                : ''}
            </span>
          </div>

          <div className="my-6 border-t border-slate-200" />

          <h2 className="text-lg font-bold text-slate-900">
            Product Description
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {product.description}
          </p>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            Add to Cart
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Added products are saved in your shopping cart.
          </p>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails
