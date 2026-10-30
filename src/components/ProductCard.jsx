
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <article className="group overflow-hidden rainbow-matte-panel group overflow-hidden rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-xl">
      <Link
        to={`/product/${product.id}`}
        aria-label={`View details for ${product.title}`}
        className="block"
      >
        <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {product.category}
        </p>

        <h2 className="mt-2 min-h-12 line-clamp-2 font-semibold text-slate-800 group-hover:text-indigo-600">
          {product.title}
        </h2>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xl font-bold text-slate-900">
          ${product.price.toFixed(2)}
        </span>

        <span className="text-sm text-amber-600">
          ★ {product.rating?.rate ?? 'N/A'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => addToCart(product)}
        className="mt-4 w-full rounded-xl rainbow-matte-button px-4 py-3 font-medium text-white"
      >
        Add to Cart
      </button>
    </article>
  )
}

export default ProductCard
