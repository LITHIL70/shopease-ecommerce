import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })
  try {
    const file = path.join(process.cwd(), 'server', 'db.json')
    const database = JSON.parse(await readFile(file, 'utf8'))
    return res.status(200).json(database.products || [])
  } catch (error) {
    console.error('Unable to read ShopEase product database:', error.message)
    return res.status(500).json({ error: 'Unable to load products.' })
  }
}
