import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

function App() {
  // Remember the visitor's theme choice between page refreshes.
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shopease-theme') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('shopease-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (
      currentTheme === 'light' ? 'dark' : 'light'
    ))
  }

  return (
    <div data-theme={theme} className="rainbow-matte-background min-h-screen text-slate-900">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </div>
  )
}

export default App
