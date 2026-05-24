# 🚀 Quick-Mart Deployment Guide

⚠️ **SECURITY FIRST**: See [SECURITY.md](./SECURITY.md) for protecting sensitive data before deployment!

## 🎯 Deployment Overview

Your Quick-Mart application is ready for production deployment. Follow these steps:

1. **Supabase** - Database (PostgreSQL)
2. **Render** - Backend API (Node.js)
3. **Vercel** - Frontend (React)

---

## STEP 1: Set Up Supabase Database ✅

### 1.1 Create Supabase Project
1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Enter project name: `quickmart`
4. Set password and region
5. Wait 2-3 minutes for initialization

### 1.2 Get Database Connection String
1. Open your Supabase project
2. Go to **Settings → Database**
3. Copy the **Connection string** (looks like):
   ```
   postgresql://postgres:[password]@[host]:5432/postgres
   ```
4. Replace `[password]` with your actual password

### 1.3 Deploy Database Schema
```bash
cd backend

# Create .env.production file
cat > .env.production << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
JWT_SECRET=quickmart-secret-key-12345
PORT=5000
FRONTEND_URL=https://quickmart.vercel.app
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
EOF

# Push schema to Supabase
npx prisma db push

# Seed database (optional)
npm run seed
```

---

## STEP 2: Deploy Backend to Render 🔴

### 2.1 Create Render Account
1. Go to: https://render.com/dashboard
2. Sign up with GitHub
3. Grant access to your repository

### 2.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Select: **Dev-anxit/Quick-Mart**
3. Configure:
   - **Name**: `quickmart-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to you

### 2.3 Add Environment Variables
In Render Dashboard, add these variables:
```
NODE_ENV                = production
DATABASE_URL            = postgresql://postgres:PASSWORD@HOST:5432/postgres
JWT_SECRET              = quickmart-secret-key-12345
FRONTEND_URL            = https://quickmart.vercel.app (update after frontend deployment)
PORT                    = 5000
RAZORPAY_KEY_ID         = rzp_live_xxxxx
RAZORPAY_KEY_SECRET     = xxxxx
```

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait 3-5 minutes for build
3. Once live, you'll get a URL like: `https://quickmart-backend.onrender.com`
4. **Save this URL** - you'll need it for frontend

### 2.5 Verify Deployment
```bash
curl https://quickmart-backend.onrender.com/health
# Should return: {"status":"OK","timestamp":"..."}
```

---

## STEP 3: Deploy Frontend to Vercel 🔵

### 3.1 Create Vercel Account
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Grant access to your repository

### 3.2 Import Project
1. Click **"New Project"**
2. Select: **Dev-anxit/Quick-Mart**
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js / Vite

### 3.3 Add Environment Variables
In Vercel Dashboard, add:
```
VITE_API_BASE_URL = https://quickmart-backend.onrender.com/api
VITE_RAZORPAY_KEY_ID = rzp_live_xxxxx
```

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once live, get your Vercel URL (e.g., `https://quickmart.vercel.app`)

### 3.5 Update Backend FRONTEND_URL
Go back to Render backend settings and update:
```
FRONTEND_URL = https://quickmart.vercel.app
```

---

## STEP 4: Configure GitHub Secrets (Auto-Deployment)

To enable automatic deployment when you push to GitHub:

### 4.1 For Render Backend
1. Go to GitHub: Settings → Secrets and variables → Actions
2. Add secrets:
   - `RENDER_SERVICE_ID`: Your Render Service ID (from URL)
   - `RENDER_API_KEY`: Your Render API key

### 4.2 For Vercel Frontend
1. Go to GitHub: Settings → Secrets and variables → Actions
2. Add secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_PROJECT_ID`: From Vercel dashboard
   - `VERCEL_ORG_ID`: Your Vercel organization ID

---

## ✅ Final Testing

### Test Production Deployment:
```bash
# 1. Frontend loads
curl https://quickmart.vercel.app

# 2. Backend responds
curl https://quickmart-backend.onrender.com/health

# 3. Test OTP login
curl -X POST https://quickmart-backend.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'

# 4. Test products
curl https://quickmart-backend.onrender.com/api/products
```

### In Browser:
1. Open https://quickmart.vercel.app
2. Login with phone: `9876543210`
3. Browse products
4. Add items to cart
5. Complete checkout

---

## 🔑 Useful Commands

```bash
# Test production build locally
cd frontend && npm run build && npm run preview

# Check Render deployment logs
# Go to Render dashboard → your service → Logs tab

# Check Vercel deployment logs
# Go to Vercel dashboard → your project → Deployments tab
```

---

## 📊 Deployment URLs After Setup

- **Frontend**: https://quickmart.vercel.app
- **Backend**: https://quickmart-backend.onrender.com
- **Database**: Supabase (PostgreSQL)

---

## 💡 Tips & Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection fails | Check DATABASE_URL in .env matches Supabase connection string |
| Backend won't start | Check NODE_ENV=production and all env vars are set |
| Frontend can't reach backend | Ensure VITE_API_BASE_URL points to correct Render URL |
| CORS errors | Update FRONTEND_URL in backend environment variables |
| Automatic deployment not working | Configure GitHub secrets (see Step 4) |

---

## 🎉 Done!

Your Quick-Mart application is now deployed! 🚀

- **Frontend**: Live on Vercel
- **Backend**: Live on Render
- **Database**: Live on Supabase
- **Auto-Deployment**: Configured via GitHub Actions

Every time you push to `main`, both frontend and backend will automatically redeploy!
