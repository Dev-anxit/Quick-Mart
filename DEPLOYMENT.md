# 🚀 QuickMart - Complete Deployment Guide

**Status:** ✅ Ready for Production Deployment

---

## 📋 Deployment Checklist

### Phase 1: Supabase Setup (Database)
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new PostgreSQL project
- [ ] Get connection string from Settings → Database
- [ ] Create `.env.production` with DATABASE_URL
- [ ] Run: `npx prisma db push`
- [ ] Run: `npm run seed` (optional)

### Phase 2: Backend Deployment (Render)
- [ ] Create account at https://render.com
- [ ] Connect GitHub repository
- [ ] Create Web Service from Dev-anxit/Quick-Mart
- [ ] Configure environment variables
- [ ] Deploy and test health endpoint
- [ ] Save backend URL

### Phase 3: Frontend Deployment (Vercel)
- [ ] Create account at https://vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory: `frontend`
- [ ] Add backend URL to environment variables
- [ ] Deploy and verify page loads

### Phase 4: Testing
- [ ] Test OTP login (phone: 9876543210)
- [ ] Browse products
- [ ] Add items to cart
- [ ] Complete checkout
- [ ] Verify order appears in database

---

## 🔧 Detailed Setup Steps

### STEP 1: Supabase Database

**1.1 Create Supabase Project**
```
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Enter project details
4. Wait for initialization (2-3 minutes)
```

**1.2 Get Connection String**
```
1. Click "Settings" in left sidebar
2. Click "Database"
3. Copy the "Connection string"
4. Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

**1.3 Local Setup**
```bash
cd backend

# Create .env.local file
cat > .env.local << 'EOF'
NODE_ENV=development
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
JWT_SECRET=quickmart-secret-key-12345
FRONTEND_URL=http://localhost:5173
PORT=5000
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
EOF

# Install & setup
npm install
npx prisma generate
npx prisma db push
npm run seed  # Optional: adds sample data
```

**1.4 Test Local Connection**
```bash
npm run dev
# Should see: ✅ Prisma/PostgreSQL connected successfully
```

---

### STEP 2: Deploy Backend to Render

**2.1 Create Render Account**
- Go to https://render.com/dashboard
- Sign up with GitHub account

**2.2 Create Web Service**
```
1. Click "New +"
2. Select "Web Service"
3. Connect GitHub repository "Dev-anxit/Quick-Mart"
4. Configure:
   - Name: quickmart-backend
   - Runtime: Node
   - Build Command: npm install && npm run build && npx prisma db push
   - Start Command: npm start
   - Region: Choose closest to you
```

**2.3 Add Environment Variables**
```
Click "Environment" tab and add:

NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@host:5432/postgres
JWT_SECRET=quickmart-secret-key-12345
FRONTEND_URL=https://quickmart.vercel.app
PORT=5000
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

**2.4 Deploy**
```
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Note the URL: https://quickmart-backend-XXXXX.onrender.com
4. Test: https://quickmart-backend-XXXXX.onrender.com/health
```

---

### STEP 3: Deploy Frontend to Vercel

**3.1 Create Vercel Account**
- Go to https://vercel.com/dashboard
- Sign up with GitHub account

**3.2 Import Project**
```
1. Click "Add New..."
2. Select "Project"
3. Select "Dev-anxit/Quick-Mart" from GitHub
4. Configure:
   - Framework: Vite
   - Root Directory: frontend
```

**3.3 Add Environment Variables**
```
VITE_API_BASE_URL=https://quickmart-backend-XXXXX.onrender.com/api
VITE_SOCKET_URL=https://quickmart-backend-XXXXX.onrender.com
```

**3.4 Deploy**
```
1. Click "Deploy"
2. Wait 3-5 minutes
3. Note the URL: https://quickmart.vercel.app
4. Test: Open URL in browser
```

---

### STEP 4: Testing

**4.1 Test OTP Login**
```
1. Go to https://quickmart.vercel.app
2. Click "Login with OTP"
3. Enter phone: 9876543210
4. Enter OTP: 123456 (test code)
5. Should login successfully
```

**4.2 Test Shopping**
```
1. Browse products on home page
2. Click on a product to see details
3. Click "Add to Cart"
4. Go to cart (click cart icon)
5. Proceed to checkout
6. Enter delivery address
7. Select payment method
8. Click "Place Order"
9. Verify order appears
```

**4.3 Check Database**
```bash
# In backend terminal
npx prisma studio
# Opens visual database editor at localhost:5555
# Can see all orders, users, products
```

---

## 📊 Cost Breakdown

| Service | Tier | Cost/Month |
|---------|------|-----------|
| Supabase | Free | $0 (500MB DB) |
| Render | Free | $0 (750 hrs/month) |
| Vercel | Free | $0 (unlimited) |
| **Total** | | **$0** |

---

## 🔑 Environment Variables Reference

### Backend (.env.production)
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@host:port/database
JWT_SECRET=your-secret-key
FRONTEND_URL=https://quickmart.vercel.app
PORT=5000
RAZORPAY_KEY_ID=your-id
RAZORPAY_KEY_SECRET=your-secret
FIREBASE_PROJECT_ID=your-project
```

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://quickmart-backend.onrender.com/api
VITE_SOCKET_URL=https://quickmart-backend.onrender.com
```

---

## 🐛 Troubleshooting

### "Database connection failed"
```
✓ Check DATABASE_URL is correct
✓ Verify Supabase project is running
✓ Check IP whitelist (in Supabase settings)
```

### "Build failed on Render"
```
✓ Check Render logs for errors
✓ Verify package.json scripts exist
✓ Ensure .env variables are set
✓ Try: npm run build locally to debug
```

### "Frontend won't load"
```
✓ Check VITE_API_BASE_URL is correct
✓ Verify backend is running
✓ Check CORS settings in backend
✓ Open browser console for errors
```

### "OTP login not working"
```
✓ Check backend logs: npm run dev
✓ Verify database connection
✓ Test with phone: 9876543210
```

---

## 📞 Quick Commands

```bash
# Backend
npm run dev           # Start dev server
npm run build         # Build for production
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes

# Frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

---

## ✨ After Deployment

### Monitor Your App
- Render Logs: https://dashboard.render.com
- Vercel Logs: https://vercel.com/dashboard
- Database: `npx prisma studio`

### Make Changes
```bash
# Make code changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render & Vercel automatically redeploy!
```

---

## 🎉 Success Checklist

- ✅ Supabase database is running
- ✅ Backend API responds to requests
- ✅ Frontend page loads without errors
- ✅ OTP login works
- ✅ Can browse products
- ✅ Can add items to cart
- ✅ Can place orders
- ✅ Orders appear in database

---

## 📚 Documentation

- **Supabase:** https://supabase.com/docs
- **Prisma:** https://www.prisma.io/docs
- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs

---

**Your QuickMart app is now LIVE! 🚀**
