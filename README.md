# ShopEase — E-Commerce Web Application

ShopEase is a responsive e-commerce demonstration built with React and Tailwind CSS. It brings together a storefront, product browsing, shopping cart, wishlist, product detail pages, and a checkout flow.

🌐 **Live demo:** [shopease-ecommerce-tan.vercel.app](https://shopease-ecommerce-tan.vercel.app/)

## Features

- Product catalogue backed by JSON Server
- Product browsing and category-based filtering
- Product detail routes
- Shopping cart with quantity updates and item removal
- Wishlist
- Light/dark theme preference saved in browser storage
- Checkout form with basic client-side validation
- Order confirmation page
- Razorpay checkout test-mode integration path and a separate simulated demo payment flow

## Technology

- React
- React Router
- Tailwind CSS
- Vite
- Axios
- JSON Server
- Express and Razorpay SDK (payment API code)

## Run locally

Requires Node.js and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local product API in terminal 1:

   ```bash
   npm run server
   ```

   JSON Server listens on `http://localhost:5000`.

3. Start the frontend in terminal 2:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite (commonly `http://localhost:5173`).

## Environment configuration

Copy `.env.example` to `.env` and set the API URL required by the frontend. The payment API also requires the appropriate Razorpay test credentials in its server-side environment. Never commit real secrets.

## Payment and data notes

- The cart, wishlist, and demo order information use browser `localStorage`.
- A simulated checkout path is available for demonstration.
- The Razorpay integration is configured as a test-mode flow; it must not be represented as live payment processing.
- The local JSON Server catalogue is for development/demo use, not a production database.

## Quality checks

```bash
npm run lint
npm run build
```
