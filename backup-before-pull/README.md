# Group Project 2026 - E-Commerce System

This implementation covers the **Web App** and **Mobile App** requirements from the "Group Project 2026" brief, including:

- User registration and login
- Product catalog with search and filtering
- Shopping cart management
- Checkout with simulated payment
- Order tracking with status timeline
- Admin dashboard for products, users, and orders (web)

The **testing section is intentionally not implemented yet**, as requested.

## Project Structure

- `backend/` - REST API and data layer
- `web/` - React web application
- `mobile/` - Expo React Native mobile application

## Default Seed Accounts

- Admin:
  - Email: `admin@datamak.local`
  - Password: `Admin@123`
- Customer:
  - Email: `customer@datamak.local`
  - Password: `Customer@123`

## 1. Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

## 2. Run Web App

```bash
cd web
npm install
npm run dev
```

Web runs on `http://localhost:5173`.

To point web to a different API URL, create `web/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

## 3. Run Mobile App

```bash
cd mobile
npm install
npm run start
```

For real device testing with Expo, set the API URL in environment:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:4000/api
```

For Android emulator, use:

```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000/api
```

For iOS simulator, `http://localhost:4000/api` usually works.

## Implemented API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/cart` (auth)
- `POST /api/cart/items` (auth)
- `PUT /api/cart/items/:productId` (auth)
- `DELETE /api/cart/items/:productId` (auth)
- `DELETE /api/cart` (auth)
- `POST /api/checkout` (auth)
- `GET /api/orders` (auth)
- `GET /api/orders/:id` (auth)
- `PATCH /api/orders/:id/status` (admin)
- `GET /api/admin/summary` (admin)
- `GET /api/admin/users` (admin)
- `PATCH /api/admin/users/:id/role` (admin)

## Notes
- Data is persisted in `backend/data/db.json` after first run.
- The payment flow is simulated by design for the assignment.
- Admin dashboard is implemented in the web app, while mobile focuses on customer shopping flows.
