import crypto from 'node:crypto'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ verified: false, error: 'Method not allowed.' })
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return res.status(503).json({ verified: false, error: 'Razorpay Secret is not configured in Vercel.' })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ verified: false, error: 'Missing Razorpay payment verification fields.' })
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex')
  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(razorpay_signature)
  const verified = expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)

  if (!verified) return res.status(400).json({ verified: false, error: 'Razorpay signature verification failed.' })
  return res.status(200).json({ verified: true })
}
