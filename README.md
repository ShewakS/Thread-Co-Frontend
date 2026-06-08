# THREAD & CO

A full-stack fashion e-commerce platform built with React, Material UI, Express, MongoDB, and Razorpay.

THREAD & CO provides a complete online shopping experience with secure authentication, product browsing, wishlist management, checkout, payment processing, order tracking, and an admin dashboard for managing products, inventory, users, coupons, and orders.

## Live Demo

**Frontend:** https://your-frontend-url.com

**Backend API:** https://your-backend-url.com

---

## Key Features
### Customer Features

* JWT-based user authentication
* User registration and login
* Terms & Privacy acceptance during signup
* Password strength validation
* Product catalog with category filtering and search
* Product details with size and color selection
* Shopping cart management
* Wishlist functionality
* Product reviews and ratings
* Multiple saved shipping addresses
* Secure checkout process
* Razorpay payment integration
* Cash on Delivery (COD) support
* Order history and tracking

### Admin Features

* Dashboard analytics and KPIs
* Product management
* Inventory stock management
* User management
* Order management
* Coupon and offer management
* Recent orders monitoring

---

## Tech Stack

### Frontend

* React
* React Router
* Material UI (MUI)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication & Security

* JWT (JSON Web Tokens)
* bcryptjs

### Payments

* Razorpay

---

## System Architecture

```text
React Frontend
       │
Express REST API
       │
MongoDB Atlas
       │
Razorpay Payment Gateway
```

---

## Database Models

* User
* Product
* Order
* Payment
* Wishlist
* Review
* Offer
* ContactMessage
* PasswordReset

---

## API Modules

```text
/api/user
/api/products
/api/orders
/api/offers
/api/payments
/api/wishlist
/api/reviews
/api/contact
/api/password-reset
```

---

## Project Structure

```text
Thread&Co/
│
├── frontend/
│   ├── src/
│   └── public/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   
│
└── README.md
```

---

## Environment Variables

### Backend

Create `backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
BACKEND_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend

Create `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production deployment, replace local URLs with deployed URLs.

---

## Local Development Setup

### Clone Repository

```bash
git clone <repository-url>
cd Thread&Co
```

### Install Backend Dependencies
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm start
```

Frontend: http://localhost:3000

Backend: http://localhost:5000

---

## Build for Production

```bash
cd frontend
npm run build
```

---

## Payment Workflow

1. User proceeds to checkout.
2. Frontend requests Razorpay order creation.
3. Razorpay Checkout opens.
4. Payment is verified by the backend.
5. Order and payment details are stored in MongoDB.
6. User receives order confirmation.

---

## Data Persistence

All business data is stored in MongoDB:

* Users
* Addresses
* Products
* Inventory
* Orders
* Payments
* Wishlists
* Reviews
* Offers
* Contact Messages
* Password Reset Requests

---

## Challenges Solved

* Secure JWT authentication and authorization
* Payment verification using Razorpay signatures
* Role-based admin access control
* MongoDB schema relationships and data consistency
* Inventory management and stock updates
* End-to-end checkout and order processing

---

## Future Enhancements

* Email notifications
* Product recommendation engine
* Sales analytics dashboard
* Wishlist sharing
* Product image search
* Multi-vendor marketplace support

---

## Deployment Notes

* Configure environment variables on the hosting platform.
* Add deployed frontend URL to backend CORS settings.
* Configure MongoDB Atlas network access.
* Configure Razorpay test/live credentials.
* Set production API URL in frontend environment variables.

---

## Scripts

### Backend

```bash
npm start
npm run dev
```

### Frontend

```bash
npm start
npm run build
npm test
```

---
