import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar({ theme, onToggleTheme }) {
  const { cartCount } = useCart()
  const isDarkTheme = theme === 'dark'

  return (
    <header className="sticky top-0 z-10 border-b border-white/80 bg-white/75 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight rainbow-matte-text"
        >
          ShopEase<span className="text-slate-900">.</span>
        </Link>

        <span className="hidden text-sm font-medium text-slate-500 sm:block">
          Discover your next favorite
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDarkTheme}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
          </button>

          <NavLink
            to="/cart"
            className="rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-4 py-2 font-semibold text-indigo-700 ring-1 ring-white/80 transition hover:from-blue-100 hover:to-violet-100"
          >
            Cart ({cartCount})
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
