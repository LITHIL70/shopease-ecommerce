import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'

function Wishlist() {
  const { wishlist } = useWishlist()

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Your saved collection</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">My Wishlist</h1>
        <p className="mt-2 text-slate-500">{wishlist.length} saved product(s)</p>
      </div>
      {wishlist.length === 0 ? (
        <section className="rainbow-matte-panel rounded-3xl px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden="true">♡</p>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="mt-2 text-slate-500">Tap the heart on a product to save it here.</p>
          <Link to="/" className="rainbow-matte-button mt-6 inline-block rounded-xl px-6 py-3 font-bold">Explore products</Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </main>
  )
}
export default Wishlist
