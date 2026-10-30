import { useEffect, useState } from 'react'
import { getProducts } from '../services/productApi'
import ProductCard from '../components/ProductCard'

function Home() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  async function loadProducts() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const productData = await getProducts()
      setProducts(productData)
    } catch {
      setErrorMessage('We could not load the products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const productCategories = [
    'all',
    ...new Set(products.map((product) => product.category)),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:pt-12">
        <section className="home-hero rounded-[2rem] px-7 py-12 text-white shadow-2xl shadow-indigo-200/50 sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              Welcome to ShopEase
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.12] sm:text-5xl lg:text-6xl">
              Find your next everyday favorite.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
              A thoughtful collection of essentials, useful discoveries and
              little upgrades to make every day feel better.
            </p>
            <a
              href="#shop-products"
              className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              Explore the collection <span className="ml-3" aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="shop-products" className="scroll-mt-28 pt-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                Curated for you
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Explore our products
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {isLoading ? 'Getting the collection ready...' : filteredProducts.length + ' products to explore'}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_210px] lg:w-[510px]">
              <label className="sr-only" htmlFor="product-search">Search products</label>
              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search the collection..."
                className="form-control"
              />
              <label className="sr-only" htmlFor="product-category">Choose a category</label>
              <select
                id="product-category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="form-control"
              >
                {productCategories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName === 'all'
                      ? 'All categories'
                      : categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="rainbow-matte-panel h-80 animate-pulse rounded-3xl p-4">
                  <div className="h-48 rounded-2xl bg-slate-100" />
                  <div className="mt-5 h-3 w-1/3 rounded bg-slate-100" />
                  <div className="mt-3 h-4 w-4/5 rounded bg-slate-100" />
                  <div className="mt-6 h-10 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rainbow-matte-panel mt-8 rounded-2xl p-8 text-center">
              <p className="font-semibold text-red-600">{errorMessage}</p>
              <button type="button" onClick={loadProducts} className="rainbow-matte-button mt-5 rounded-xl px-6 py-3 font-bold">
                Try again
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && filteredProducts.length === 0 && (
            <div className="rainbow-matte-panel mt-8 rounded-2xl px-6 py-16 text-center">
              <p className="text-xl font-bold text-slate-800">No products found</p>
              <p className="mt-2 text-slate-500">Try a different search phrase or category.</p>
            </div>
          )}

          {!isLoading && !errorMessage && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/70 bg-white/55 px-5 py-9 text-center backdrop-blur-xl">
        <p className="text-lg font-extrabold rainbow-matte-text">ShopEase</p>
        <p className="mt-2 text-sm text-slate-500">Thoughtful finds for everyday living.</p>
        <p className="mt-4 text-xs text-slate-400">© 2026 ShopEase. Built with React and Tailwind CSS.</p>
      </footer>
    </>
  )
}

export default Home
