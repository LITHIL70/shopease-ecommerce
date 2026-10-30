import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

function App() {
  // Load the saved theme so the visitor keeps the same appearance after refresh.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('shopease-theme') || 'light'
    } catch {
      return 'light'
    }
  })

  // Apply the theme to the document and save the visitor's choice.
  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem('shopease-theme', theme)
    } catch {
      // The theme still works for this visit if browser storage is unavailable.
    }
  }, [theme])

  function handleThemeToggle() {
    setTheme((currentTheme) => (
      currentTheme === 'light' ? 'dark' : 'light'
    ))
  }

  return (
    <div data-theme={theme} className="rainbow-matte-background min-h-screen">
      <Navbar theme={theme} onToggleTheme={handleThemeToggle} />
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
