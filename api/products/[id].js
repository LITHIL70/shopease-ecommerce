import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })
  try {
    const file = path.join(process.cwd(), 'server', 'db.json')
    const database = JSON.parse(await readFile(file, 'utf8'))
    const product = (database.products || []).find(item => String(item.id) === String(req.query.id))
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    return res.status(200).json(product)
  } catch (error) {
    console.error('Unable to read ShopEase product database:', error.message)
    return res.status(500).json({ error: 'Unable to load product details.' })
  }
}
