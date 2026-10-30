import axios from 'axios'

// Keep the API address in one place so it is easy to update later.
const PRODUCT_API_URL = 'https://fakestoreapi.com/products'

// Axios sends the request and gives us the response data directly.
export async function getProducts() {
  try {
    const response = await axios.get(PRODUCT_API_URL)
    return response.data
  } catch (error) {
    console.error('Could not load the product list:', error)
    throw new Error('Failed to fetch products. Please try again.')
  }
}

// Load one product using its ID from the URL.
export async function getProductById(productId) {
  try {
    const response = await axios.get(`${PRODUCT_API_URL}/${productId}`)
    return response.data
  } catch (error) {
    console.error('Could not load product details:', error)
    throw new Error('Product not found. Please try again.')
  }
}
