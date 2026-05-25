# 🛒 QuickMart: Next-Gen Instant Grocery Platform
### *Modern. Fast. Reliable. Full-Stack.*

[![Status](https://img.shields.io/badge/Status-Production--Ready-00E676?style=for-the-badge&logo=statuspage)](https://github.com/Dev-anxit/Quick-Mart)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-React%20+%20Node.js%20+%20PostgreSQL-61DAFB?style=for-the-badge&logo=react)](https://github.com/Dev-anxit/Quick-Mart)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

QuickMart is a high-fidelity, production-grade quick-commerce platform inspired by industry leaders like Zepto and Blinkit. Delivering sub-10-minute grocery convenience through a robust full-stack architecture with real-time Socket.io communication.

🌐 **Live Site:** [quick-mart-virid-phi.vercel.app](https://quick-mart-virid-phi.vercel.app)  
⚙️ **API:** [quick-mart-q63b.onrender.com](https://quick-mart-q63b.onrender.com)

---

## 🎯 Quick Start

```bash
# Clone the repo
git clone https://github.com/Dev-anxit/Quick-Mart.git && cd Quick-Mart

# Setup backend
cd backend && cp .env.example .env   # fill in your credentials
npm install && npm run dev

# Setup frontend (in a new terminal)
cd frontend && cp .env.example .env
npm install && npm run dev
```

---

## ✨ Features

### 👤 User Experience
- **Authentication**: JWT-based auth with OTP verification support
- **Product Catalog**: Full-text search with category filters and instant suggestions
- **Smart Cart**: Persistent shopping cart backed by PostgreSQL
- **Real-Time Tracking**: Live order status and rider movement via Socket.io
- **Secure Checkout**: Multi-step flow with Razorpay payment integration
- **Order History**: Full order timeline with status tracking

### 🏪 Admin & Logistics
- **Dynamic Dashboard**: Real-time sales analytics and inventory metrics
- **Inventory Control**: Comprehensive product, category, and promo management
- **Smart Dispatch**: Intelligent rider assignment and automated order workflows

---

## 🛠️ Tech Stack

| Frontend | Backend | Infrastructure |
|---|---|---|
| **React 18** (Vite) | **Node.js** (Express 5) | **Supabase** (PostgreSQL) |
| **TypeScript** | **TypeScript** | **Prisma** ORM |
| **Vanilla CSS** | **Socket.io** | **Firebase** (Auth/Notifications) |
| **React Router v6** | **Razorpay SDK** | **Vercel** (Frontend) |
| **Axios** | **JWT** | **Render** (Backend) |

---

## 🏗️ Architecture & Structure

```bash
E-commerce/
├── 📂 frontend/               # React Production Client
│   ├── 📂 src/pages/          # Home, Listing, Detail, Checkout, Account, Admin
│   ├── 📂 src/components/     # Shared UI components
│   ├── 📂 src/hooks/          # Custom React hooks (useAuth, useCart...)
│   ├── 📂 src/services/       # API clients & Socket logic
│   ├── 📄 vercel.json         # SPA routing config
│   └── 📄 package.json
├── 📂 backend/                # Express REST API
│   ├── 📂 src/controllers/    # Route handlers & business logic
│   ├── 📂 src/routes/         # API route definitions
│   ├── 📂 src/services/       # Service layer (User, Product, Order)
│   ├── 📂 src/config/         # Prisma, JWT config
│   ├── 📂 src/middleware/     # Auth middleware
│   ├── 📂 prisma/             # Database schema & migrations
│   ├── 📄 render.yaml         # Render deployment config
│   └── 📄 package.json
└── 📄 README.md
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | `POST` | User registration |
| `/api/auth/login` | `POST` | Login & JWT issuance |
| `/api/products` | `GET` | Paginated product retrieval |
| `/api/cart` | `GET/POST/DELETE` | Cart management |
| `/api/orders` | `POST` | Create order & payment |
| `/api/orders/:id` | `GET` | Order details & tracking |
| `/api/admin/dashboard` | `GET` | Admin analytics (protected) |
| `/health` | `GET` | Service health check |

---

## 🚀 Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3500
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
FIREBASE_PROJECT_ID=your-project-id
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3500/api
VITE_SOCKET_URL=http://localhost:3500
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## 🗄️ Database Setup

```bash
# Generate Prisma client
cd backend && npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run seed
```

---

## 📈 Roadmap

- [x] **Phase 1**: Core Auth, Product Catalog & Cart
- [x] **Phase 2**: Real-time Order Tracking via Socket.io
- [x] **Phase 3**: Razorpay Payment Integration
- [x] **Phase 4**: Admin Dashboard & Analytics
- [x] **Phase 5**: Production Deployment (Vercel + Render)
- [ ] **Phase 6**: AI-powered product recommendations
- [ ] **Phase 7**: Native Mobile App (React Native)
- [ ] **Phase 8**: Multi-vendor marketplace support

---

## 🤝 Contributing

We welcome contributions! Please fork the repo, create a feature branch, and submit a PR.

- **Issues**: [Report bugs here](https://github.com/Dev-anxit/Quick-Mart/issues)
- **Repo**: [github.com/Dev-anxit/Quick-Mart](https://github.com/Dev-anxit/Quick-Mart)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

**Built with ❤️ by [Ankit Yadav](https://github.com/Dev-anxit)**  
*Giving back to the open-source community, one commit at a time.*

