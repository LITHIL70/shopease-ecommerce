import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('shopease-wishlist')
      return savedWishlist ? JSON.parse(savedWishlist) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('shopease-wishlist', JSON.stringify(wishlist))
    } catch {
      console.error('Unable to save wishlist.')
    }
  }, [wishlist])

  function toggleWishlist(product) {
    setWishlist((currentWishlist) => {
      const alreadySaved = currentWishlist.some((item) => item.id === product.id)
      if (alreadySaved) {
        return currentWishlist.filter((item) => item.id !== product.id)
      }
      return [...currentWishlist, product]
    })
  }

  function isInWishlist(productId) {
    return wishlist.some((item) => item.id === productId)
  }

  return <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}
