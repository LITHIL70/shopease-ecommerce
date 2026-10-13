
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-indigo-600"
        >
          ShopEase<span className="text-slate-900">.</span>
        </Link>

        <span className="text-sm font-medium text-slate-500">
          Discover your next favorite
        </span>

        <NavLink
          to="/cart"
          className="rounded-xl bg-indigo-50 px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          Cart ({cartCount})
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
