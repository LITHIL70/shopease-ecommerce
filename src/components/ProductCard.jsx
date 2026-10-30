import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const saved = isInWishlist(product.id)

  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-3xl p-3 sm:p-4">
      <div className="product-image-stage relative flex h-52 items-center justify-center overflow-hidden rounded-2xl p-5 sm:h-56">
        <Link to={'/product/' + product.id} className="flex h-full w-full items-center justify-center" aria-label={'View ' + product.title}>
          <img src={product.image} alt={product.title} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" loading="lazy" />
        </Link>
        <button type="button" onClick={() => toggleWishlist(product)} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={saved} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-rose-500 shadow-md transition hover:scale-110">
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <Link to={'/product/' + product.id} className="block">
        <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-indigo-600">{product.category}</p>
        <h2 className="mt-2 min-h-12 line-clamp-2 text-base font-bold leading-6 text-slate-800 transition group-hover:text-indigo-600">{product.title}</h2>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-xl font-extrabold tracking-tight text-slate-900">${Number(product.price).toFixed(2)}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">★ {product.rating?.rate ?? 'N/A'}</span>
      </div>
      <button type="button" onClick={() => addToCart(product)} className="rainbow-matte-button mt-4 w-full rounded-xl px-4 py-3 font-bold text-white">Add to Cart</button>
    </article>
  )
}
export default ProductCard
