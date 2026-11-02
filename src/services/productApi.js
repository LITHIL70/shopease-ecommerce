import axios from 'axios'

// Local REST API powered by JSON Server.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getProducts() {
  try {
    const response = await axios.get(`${API_URL}/products`)
    return response.data
  } catch (error) {
    console.error('Could not load products from JSON Server:', error)
    throw new Error('Could not connect to ShopEase JSON Server. Start it with npm run server.')
  }
}

export async function getProductById(productId) {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`)
    return response.data
  } catch (error) {
    console.error('Could not load product details:', error)
    throw new Error('Product not found. Please check that JSON Server is running.')
  }
}
