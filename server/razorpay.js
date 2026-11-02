import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Razorpay from 'razorpay'
import crypto from 'node:crypto'

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
const port = Number(process.env.PAYMENT_PORT || 5001)

app.post('/api/razorpay/orders', async (req, res) => {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'Add Razorpay test keys to your .env file.' })
    const amount = Number(req.body.amount)
    if (!Number.isInteger(amount) || amount < 100) return res.status(400).json({ error: 'Invalid payment amount.' })
    const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: 'se_' + Date.now(), notes: { environment: 'test', store: 'ShopEase' } })
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: RAZORPAY_KEY_ID })
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message)
    res.status(500).json({ error: 'Could not create Razorpay test order. Check your test keys.' })
  }
})

app.post('/api/razorpay/verify', (req, res) => {
  if (!RAZORPAY_KEY_SECRET) return res.status(503).json({ verified: false, error: 'Razorpay keys are not configured.' })
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ verified: false, error: 'Missing Razorpay payment verification fields.' })
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex')
  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(razorpay_signature)
  const verified = expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  if (!verified) return res.status(400).json({ verified: false, error: 'Razorpay signature verification failed.' })
  res.json({ verified: true })
})

app.listen(port, () => console.log('ShopEase Razorpay test server running at http://localhost:' + port))
