import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  function handleAddToCart() {
    addToCart(product)
  }

  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-3xl p-4">
      <Link
        to={'/product/' + product.id}
        aria-label={'View details for ' + product.title}
        className="block"
      >
        <div className="product-image-stage flex h-56 items-center justify-center overflow-hidden rounded-2xl p-5">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-indigo-600">
          {product.category}
        </p>
        <h2 className="mt-2 min-h-12 line-clamp-2 text-base font-bold leading-6 text-slate-800 transition group-hover:text-indigo-600">
          {product.title}
        </h2>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          {'$' + Number(product.price).toFixed(2)}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
          ★ {product.rating?.rate ?? 'N/A'}
        </span>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="rainbow-matte-button mt-4 w-full rounded-xl px-4 py-3 font-bold text-white"
      >
        Add to Cart
      </button>
    </article>
  )
}

export default ProductCard
