import { useEffect, useState } from 'react'
import { getProducts } from '../services/productApi'
import extraProducts from '../data/extraProducts.json'
import ProductCard from '../components/ProductCard'

function Home() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('featured')

  async function loadProducts() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const apiProducts = await getProducts()
      setProducts([...apiProducts, ...extraProducts])
    } catch {
      setProducts(extraProducts)
      setErrorMessage('The online store could not load. Showing our sample products instead.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const productCategories = ['all', ...new Set(products.map((product) => product.category))]

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (sortOrder === 'price-low') {
    filteredProducts = [...filteredProducts].sort((first, second) => first.price - second.price)
  } else if (sortOrder === 'price-high') {
    filteredProducts = [...filteredProducts].sort((first, second) => second.price - first.price)
  } else if (sortOrder === 'rating') {
    filteredProducts = [...filteredProducts].sort((first, second) => (second.rating?.rate || 0) - (first.rating?.rate || 0))
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <section className="home-hero rounded-[1.5rem] px-6 py-10 text-white shadow-2xl shadow-indigo-200/50 sm:rounded-[2rem] sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur">Welcome to ShopEase</span>
            <h1 className="logo-font mt-6 max-w-xl text-4xl leading-tight sm:text-5xl lg:text-6xl">Find your next everyday favorite.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">A thoughtful collection of essentials, useful discoveries and little upgrades to make every day feel better.</p>
            <a href="#shop-products" className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1">Explore the collection <span className="ml-3" aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section id="shop-products" className="scroll-mt-28 pt-10 sm:pt-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">Curated for you</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Explore our products</h2>
              <p className="mt-2 text-sm text-slate-500">{isLoading ? 'Getting the collection ready...' : filteredProducts.length + ' products to explore'}</p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[650px]">
              <label className="sr-only" htmlFor="product-search">Search products</label>
              <input id="product-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search the collection..." className="form-control min-w-0" />
              <label className="sr-only" htmlFor="product-category">Choose a category</label>
              <select id="product-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="form-control min-w-0">
                {productCategories.map((categoryName) => <option key={categoryName} value={categoryName}>{categoryName === 'all' ? 'All categories' : categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</option>)}
              </select>
              <label className="sr-only" htmlFor="product-sort">Sort products</label>
              <select id="product-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="form-control min-w-0 sm:col-span-2">
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>
          </div>

          {errorMessage && <p role="status" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{errorMessage}</p>}
          {isLoading && <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="rainbow-matte-panel h-80 animate-pulse rounded-3xl p-4"><div className="h-48 rounded-2xl bg-slate-100" /><div className="mt-5 h-3 w-1/3 rounded bg-slate-100" /><div className="mt-3 h-4 w-4/5 rounded bg-slate-100" /><div className="mt-6 h-10 rounded-xl bg-slate-100" /></div>)}</div>}
          {!isLoading && filteredProducts.length === 0 && <div className="rainbow-matte-panel mt-8 rounded-2xl px-6 py-16 text-center"><p className="text-xl font-bold text-slate-800">No products found</p><p className="mt-2 text-slate-500">Try a different search phrase or category.</p></div>}
          {!isLoading && filteredProducts.length > 0 && <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
        </section>
      </main>
      <footer className="border-t border-white/70 bg-white/55 px-5 py-9 text-center backdrop-blur-xl">
        <p className="logo-font text-2xl rainbow-matte-text">ShopEase</p>
        <p className="mt-2 text-sm text-slate-500">Thoughtful finds for everyday living.</p>
        <p className="mt-4 text-xs text-slate-400">© 2026 ShopEase. Built with React and Tailwind CSS.</p>
      </footer>
    </>
  )
}
export default Home
