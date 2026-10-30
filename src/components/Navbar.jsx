import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar({ theme, onToggleTheme }) {
  const { cartCount } = useCart()
  const isDarkTheme = theme === 'dark'

  return (
    <header className="sticky top-0 z-20 border-b border-white/80 bg-white/75 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-lg font-extrabold text-white shadow-lg shadow-indigo-200/60">
            S
          </span>
          <span className="text-2xl font-extrabold tracking-tight rainbow-matte-text">
            ShopEase
          </span>
        </Link>
        <span className="hidden text-sm font-medium text-slate-500 lg:block">
          Thoughtful finds for everyday living
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDarkTheme}
            className="theme-toggle"
          >
            <span aria-hidden="true">{isDarkTheme ? '☀️' : '🌙'}</span>
            <span>{isDarkTheme ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <NavLink
            to="/cart"
            className="rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-4 py-2.5 text-sm font-bold text-indigo-700 ring-1 ring-white/80 transition hover:-translate-y-0.5"
          >
            Cart <span className="ml-1 rounded-full bg-white/80 px-2 py-0.5">{cartCount}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
