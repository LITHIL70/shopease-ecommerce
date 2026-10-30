import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { getProductById } from '../services/productApi.js'

function ProductDetails() {
  // Read the product ID from the current route, for example /product/3.
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isComponentActive = true

    async function loadProductDetails() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        setProduct(null)

        // All product requests use the shared Axios service.
        const productData = await getProductById(id)

        if (isComponentActive) {
          setProduct(productData)
        }
      } catch (error) {
        if (isComponentActive) {
          setErrorMessage(
            error.message || 'Unable to load this product. Please try again.'
          )
        }
      } finally {
        if (isComponentActive) {
          setIsLoading(false)
        }
      }
    }

    loadProductDetails()

    // Prevent state updates when the user leaves this page before loading ends.
    return () => {
      isComponentActive = false
    }
  }, [id])

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        <p className="text-lg text-slate-500">
          Loading product details...
        </p>
      </main>
    )
  }

  if (errorMessage || !product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Product unavailable
        </h1>

        <p className="mt-3 text-slate-500">
          {errorMessage || 'We could not find this product.'}
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

      <section className="mt-6 grid gap-10 rainbow-matte-panel rounded-3xl p-6 md:grid-cols-2 md:p-10">
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
              ${Number(product.price).toFixed(2)}
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
