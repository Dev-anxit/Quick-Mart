# 🛒 QuickMart: Next-Gen Instant Grocery Platform
### *Modern. Fast. Reliable. Full-Stack.*

[![Status](https://img.shields.io/badge/Status-Production--Ready-00E676?style=for-the-badge&logo=statuspage)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-MERN%20+%20Redis-61DAFB?style=for-the-badge&logo=react)](https://github.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

QuickMart is a high-fidelity, production-grade quick-commerce platform inspired by industry leaders like Zepto and Blinkit. Delivering sub-10-minute grocery convenience through a robust MERN stack architecture, optimized with Redis caching and real-time Socket.io communication.

---

## 🎯 Quick Start

```bash
# Setup Environment
git clone https://github.com/ankityadav/E-commerce.git && cd E-commerce

# Install & Launch (Parallel)
sh -c "cd frontend && npm install && npm run dev" & 
sh -c "cd backend && npm install && npm run dev"
```

---

## ✨ Premium Features

### 👤 User Experience
- **Lightning Search**: Full-text search with category filters and instant suggestions.
- **Micro-Interactions**: Smooth animations powered by Framer Motion.
- **Smart Cart**: Persistent shopping experience with Redis-backed speed.
- **Real-Time Tracking**: Live order status and rider movement via Socket.io.
- **Secure Checkout**: Multi-step flow with Razorpay payment integration.

### 🏪 Admin & Logistics
- **Dynamic Dashboard**: Real-time sales analytics and inventory metrics.
- **Inventory Control**: Comprehensive product, category, and promo management.
- **Smart Dispatch**: Intelligent rider assignment and automated order workflows.

---

## 🛠️ Tech Stack

| Frontend | Backend | Infrastructure |
|---|---|---|
| **React 18** (Vite) | **Node.js** (Express) | **MongoDB Atlas** |
| **TypeScript** | **TypeScript** | **Redis Cloud** |
| **Tailwind CSS** | **Mongoose** (ODM) | **Firebase Auth** |
| **Zustand** | **Socket.io** | **Cloudinary** |
| **Framer Motion** | **Razorpay SDK** | **Vercel / Railway** |

---

## 🏗️ Architecture & Structure

```bash
E-commerce/
├── 📂 frontend/               # React Production Client
│   ├── 📂 src/components/     # Atomic UI (Layout, Product, Cart, Admin)
│   ├── 📂 src/store/          # Zustand State (Auth, Cart, Orders)
│   ├── 📂 src/services/       # API Clients & Socket Logic
│   └── 📄 package.json
├── 📂 backend/                # Express REST API
│   ├── 📂 src/models/         # MongoDB Schemas (User, Product, Order)
│   ├── 📂 src/controllers/    # Route Logic & Business Operations
│   └── 📄 server.ts           # Entry point
└── 📄 README.md               # You are here
```

---

## 📡 API Reference Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | `POST` | User authentication & JWT issuance |
| `/api/products` | `GET` | Paginated product retrieval |
| `/api/cart/add` | `POST` | Add/Update items in Redis-backed cart |
| `/api/orders` | `POST` | Create order and initiate payment |
| `/api/admin/dashboard` | `GET` | Real-time administrative metrics |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js 18+**, **MongoDB**, **Redis**, and **Firebase Account**.

### Setup Environment
1. **Frontend**: Copy `frontend/.env.example` to `.env.local`
2. **Backend**: Copy `backend/.env.example` to `.env`
3. Fill in your credentials (Razorpay, Firebase, Cloudinary).

### Seed Database
```bash
cd backend && npm run seed
```

---

## 📈 Roadmap & Future

- [x] **Phase 1**: Core MERN Infrastructure & Auth.
- [x] **Phase 2**: Real-time Tracking & Redis Integration.
- [ ] **Phase 3**: AI-powered personalized product recommendations.
- [ ] **Phase 4**: Native Mobile Extensions (React Native).
- [ ] **Phase 5**: Multi-vendor marketplace support.

---

## 🤝 Contributing

We welcome contributions! Please fork the repo, create a feature branch, and submit a PR. 

- **Issues**: [Report bugs here](https://github.com/ankityadav/issues)
- **Discord**: [Join the community](https://discord.gg)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

**Built with ❤️ by [Ankit Yadav](https://github.com/ankityadav)**  
*Giving back to the open-source community, one commit at a time.*

