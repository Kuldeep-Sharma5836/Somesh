# DivineAura - MERN E-Commerce (Spiritual & Worship Products)

DivineAura is a full-stack MERN e-commerce project with a premium spiritual UI, customer storefront, and secure admin dashboard.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hot Toast, Framer Motion
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT with role-based authorization (admin/user)

## Features

- Customer panel:
- Home page with hero, categories, featured products, festival collection, testimonials
- Product listing with search and category/price filters
- Product details with quantity selector, add-to-cart, buy now, reviews
- Cart page with quantity update, remove item, total calculation, checkout flow
- Login/Signup with JWT authentication
- Profile page with user details, address update, and order history

- Admin panel:
- Secure admin login
- Dashboard overview cards
- Product CRUD (create/edit/delete/list)
- Category CRUD (create/delete/list)
- User management (view users)
- Order management (view and update status)

- Backend:
- REST APIs with MVC architecture
- Models: User, Product, Order, Category
- JWT auth + role authorization middleware
- Image upload support using multer
- Dummy seed data script

## Project Structure

- backend/
- src/
- config/
- controllers/
- data/
- middleware/
- models/
- routes/
- utils/
- uploads/
- seed.js
- .env.example

- frontend/
- src/
- api/
- components/
- context/
- layouts/
- pages/
- utils/
- .env.example

## Installation and Setup

1. Clone and open project:

```bash
cd d:/Somesh
```

2. Setup backend:

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

3. Setup frontend (new terminal):

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

4. Open app:

- Customer website: http://localhost:5173
- Admin login page: http://localhost:5173/admin/login
- Backend API: http://localhost:5000/api/health

## Environment Variables

### backend/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/divineaura
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@divineaura.com
ADMIN_PASSWORD=Admin@123
```

### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Seeded Demo Credentials

After running `npm run seed` in backend:

- Admin: admin@divineaura.com / Admin@123
- User: devotee@divineaura.com / User@123

## API Endpoints (Summary)

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Categories: `GET /api/categories`, admin CRUD on `/api/categories`
- Products: `GET /api/products`, `GET /api/products/:id`, featured route, admin CRUD
- Reviews: `POST /api/products/:id/reviews`
- Orders: `POST /api/orders`, `GET /api/orders/mine`, admin order list/status update
- Users: `GET/PUT /api/users/profile`, admin user list
- Upload: `POST /api/upload` (admin only)

## Notes

- Designed with warm spiritual palette: saffron, gold, cream, beige, maroon accents
- Responsive for mobile/tablet/desktop
- Clean and beginner-friendly folder structure for extension
