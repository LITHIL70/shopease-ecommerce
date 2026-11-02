import Razorpay from 'razorpay'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: 'Razorpay keys are not configured in Vercel.' })
  }

  try {
    const amount = Number(req.body?.amount)
    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ error: 'Invalid payment amount.' })
    }
    const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: 'se_' + Date.now(),
      notes: { environment: 'test', store: 'ShopEase' },
    })
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message)
    return res.status(500).json({ error: 'Could not create Razorpay test order. Check your Vercel test keys.' })
  }
}
