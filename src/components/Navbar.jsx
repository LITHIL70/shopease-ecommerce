import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function Navbar({ theme, onToggleTheme }) {
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()
  const isDarkTheme = theme === 'dark'

  return (
    <header className="sticky top-0 z-20 border-b border-white/80 bg-white/75 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-lg font-extrabold text-white shadow-lg">S</span>
          <span className="logo-font text-2xl rainbow-matte-text sm:text-3xl">ShopEase</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onToggleTheme} aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={isDarkTheme} className="theme-toggle">
            <span aria-hidden="true">{isDarkTheme ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{isDarkTheme ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <NavLink to="/wishlist" className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-600 ring-1 ring-white/80 transition hover:-translate-y-0.5">♡ <span className="hidden sm:inline">Wishlist</span> <span className="rounded-full bg-white/80 px-1.5 py-0.5">{wishlist.length}</span></NavLink>
          <NavLink to="/cart" className="rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-3 py-2.5 text-sm font-bold text-indigo-700 ring-1 ring-white/80 transition hover:-translate-y-0.5">Cart <span className="ml-1 rounded-full bg-white/80 px-2 py-0.5">{cartCount}</span></NavLink>
        </div>
      </nav>
    </header>
  )
}
export default Navbar
