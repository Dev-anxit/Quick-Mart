# 🚀 QuickMart Deployment Guide

Complete guide to deploy QuickMart to free hosting services.

## Overview

| Component | Service | Cost | URL |
|-----------|---------|------|-----|
| **Backend API** | Render | FREE | https://quickmart-backend.onrender.com |
| **Frontend App** | Vercel | FREE | https://quickmart.vercel.app |
| **Database** | MongoDB Atlas | FREE (512MB) | mongodb+srv://... |
| **Domain** | Any registrar | $$ (optional) | example.com |

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ GitHub account (https://github.com)
- ✅ This repository pushed to GitHub
- ✅ Code editor (VS Code)
- ✅ Terminal/Command line access
- ✅ Email address for service signups

**Time Required**: ~30-45 minutes

---

## 🔧 Part 1: Backend Deployment to Render

### 1.1 Setup MongoDB Atlas Database

MongoDB Atlas provides free database hosting (512MB).

**Steps**:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with email or GitHub
3. Create a new project (name: "QuickMart")
4. Create a free M0 cluster
5. Set username and password for database user
6. Configure network access:
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Select "Allow from Anywhere" (0.0.0.0/0)
   - Confirm
7. Get connection string:
   - Click "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Should look like: `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce`

**Save this connection string** - you'll need it for Render.

### 1.2 Deploy Backend to Render

Render is a modern PaaS platform with free tier support.

**Steps**:
1. Go to https://render.com
2. Click "Sign up"
3. Choose GitHub authentication
4. Authorize and continue
5. On dashboard, click "New +" → "Web Service"
6. Select your GitHub repository
7. Fill in deployment settings:
   ```
   Name: quickmart-backend
   Environment: Node
   Region: Virginia (US)
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```
8. Click "Create Web Service"
9. Wait for build to complete (~5 minutes)
10. Go to Settings → Environment
11. Add environment variables:
    ```
    NODE_ENV=production
    MONGODB_URI=<your-mongodb-connection-string>
    JWT_SECRET=<generate-random-32-char-string>
    FRONTEND_URL=https://quickmart.vercel.app
    RAZORPAY_KEY_ID=(optional) your_key
    RAZORPAY_KEY_SECRET=(optional) your_secret
    ```
12. Click "Save"
13. Service will redeploy automatically
14. **Copy your backend URL** from the dashboard (e.g., https://quickmart-backend.onrender.com)

**Test your backend**:
```bash
curl https://quickmart-backend.onrender.com/health
# Should return: {"status":"OK","timestamp":"..."}
```

---

## 🌐 Part 2: Frontend Deployment to Vercel

Vercel is optimized for React and Vite applications.

### 2.1 Update Frontend Configuration

Update the backend URL in your frontend:

1. Open `frontend/.env.production`
2. Replace the backend URL:
   ```
   VITE_API_BASE_URL=https://quickmart-backend.onrender.com/api
   VITE_SOCKET_URL=https://quickmart-backend.onrender.com
   ```
3. Save the file
4. Commit and push to GitHub:
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL for production"
   git push
   ```

### 2.2 Deploy to Vercel

**Steps**:
1. Go to https://vercel.com
2. Click "Sign up"
3. Choose GitHub authentication
4. Authorize and continue
5. Click "Add New..." → "Project"
6. Find and select your Quick-Mart repository
7. Configure project:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
8. Click "Environment Variables"
9. Add all variables from `frontend/.env.local`:
   ```
   VITE_API_BASE_URL=https://quickmart-backend.onrender.com/api
   VITE_SOCKET_URL=https://quickmart-backend.onrender.com
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_MAPS_API_KEY=your_key
   VITE_RAZORPAY_KEY=your_key
   ```
10. Click "Deploy"
11. Wait for deployment (~3 minutes)
12. **Copy your frontend URL** (e.g., https://quickmart-abc123.vercel.app)

**Update backend FRONTEND_URL**:
1. Go to Render dashboard
2. Select your backend service
3. Go to Environment
4. Update `FRONTEND_URL` to your Vercel URL
5. Service will redeploy

---

## ✅ Part 3: Verification & Testing

### 3.1 Test the Application

1. **Open your frontend**: https://quickmart-abc123.vercel.app
2. **Test OTP Login**:
   - Enter a phone number (any 10 digits)
   - Check backend logs (Render dashboard):
     - Go to "Service" → "Logs"
     - Look for `📱 OTP for XXXXXXXXXX: XXXXXX`
   - Enter the OTP
   - Click "Verify & Proceed"
   - Should see home page with products

3. **Monitor Logs**:
   - **Backend**: https://dashboard.render.com
   - **Frontend**: https://vercel.com/dashboard
   - **Database**: https://cloud.mongodb.com

### 3.2 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Backend responds slowly | Render free tier has cold starts (~30s), wait and retry |
| MongoDB connection error | Check IP whitelist (allow 0.0.0.0/0) and connection string |
| OTP not received in logs | Check Render logs, verify MongoDB is working |
| Frontend blank page | Check browser console (F12), look for API errors |
| Build failed on Vercel | Check build logs, ensure all dependencies are in package.json |

---

## 🎁 Optional: Add Custom Domain

### For Frontend (Vercel)
1. Buy domain from Namecheap, GoDaddy, or Cloudflare
2. Go to Vercel project settings → Domains
3. Add your domain
4. Update DNS records (instructions provided by Vercel)
5. Wait for DNS propagation (5-48 hours)

### For Backend (Render)
1. Go to Render service settings → Custom Domain
2. Add your domain
3. Update DNS records
4. Click Verify

---

## 📊 Monitoring & Maintenance

### Weekly Checks
- [ ] Test OTP login flow
- [ ] Check error rates in logs
- [ ] Verify database size in MongoDB Atlas
- [ ] Review Render and Vercel dashboards

### Monthly Checks
- [ ] Review application analytics
- [ ] Update dependencies
- [ ] Check for security updates
- [ ] Plan for scaling if needed

### Monthly Costs
- **Render**: $0 (free tier)
- **Vercel**: $0 (free tier)
- **MongoDB**: $0 (free tier, 512MB)
- **Domain**: ~$10-15 (optional)
- **Total**: $0-15/month

---

## 🚀 Deployment Checklist

- [ ] Render account created
- [ ] MongoDB Atlas database created
- [ ] Backend deployed to Render
- [ ] Backend environment variables configured
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] Backend and Frontend URLs updated
- [ ] OTP login tested
- [ ] All systems operational

---

## 🆘 Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Vite Guide**: https://vitejs.dev/guide/static-deploy.html

---

## 📈 Scaling & Upgrades

### When to Upgrade Backend
- Performance degradation
- 100+ concurrent users
- High error rates
- **Options**: 
  - Render Starter Plan ($7/month)
  - Railway (https://railway.app)
  - Fly.io (https://fly.io)

### When to Upgrade Database
- Exceeding 512MB storage
- Need automated backups
- **Options**:
  - MongoDB Shared Tier ($57/month)
  - AWS RDS ($15-30+/month)

### When to Upgrade Frontend
- Need advanced analytics
- Performance optimization
- **Options**:
  - Vercel Pro ($20/month) - includes analytics
  - CloudFlare Pages (alternative)

---

## 📝 Files Created for Deployment

- `Procfile` - Render deployment configuration
- `vercel.json` - Vercel deployment configuration
- `.env.production` - Production environment variables (both backend & frontend)
- `DEPLOYMENT.md` - Detailed deployment guide
- `QUICK_DEPLOY.md` - Quick reference guide
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD workflow

---

## 🎉 Congratulations!

Your QuickMart application is now deployed to production and accessible to the world!

**Next Steps**:
1. Share your live URLs with others
2. Gather user feedback
3. Monitor application performance
4. Plan feature improvements
5. Consider monetization options

---

## 📞 Need Help?

1. Check the documentation files in this repository
2. Review service provider documentation
3. Check browser console for errors (F12)
4. Review backend logs in Render dashboard
5. Check deployment logs in Vercel dashboard

**Happy deploying! 🚀**
