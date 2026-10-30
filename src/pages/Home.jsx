
import { useEffect, useState } from 'react'
import { getProducts } from '../services/productApi'
import ProductCard from '../components/ProductCard'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  async function loadProducts() {
    try {
      setLoading(true)
      setError('')

      const data = await getProducts()
      setProducts(data)
    } catch {
      setError('Unable to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const categories = [
    'all',
    ...new Set(products.map((product) => product.category)),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'all' || product.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="rainbow-matte-background text-slate-900">
      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Hero section */}
        <section className="rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-400 to-violet-400 px-6 py-12 text-white shadow-xl shadow-indigo-200/50 sm:px-10 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            Welcome to ShopEase
          </p>

          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Find something you'll love.
          </h1>

          <p className="mt-4 max-w-xl text-violet-50">
            Explore our collection of everyday essentials and
            discover products picked for you.
          </p>
        </section>

        {/* Products section */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Our Products</h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? 'Fetching products...'
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            {/* Search and category filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Filter by category"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === 'all'
                      ? 'All Categories'
                      : item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <p className="py-16 text-center text-slate-500">
              Loading products...
            </p>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
              <p>{error}</p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="py-16 text-center text-slate-500">
              No products found. Try another search or category.
            </p>
          )}

          {/* Product grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/70 bg-white/60 px-5 py-8 backdrop-blur-xl text-center text-sm text-slate-500">
        © 2026 ShopEase. Built with React and Tailwind CSS.
      </footer>
    </div>
  )
}

export default Home
