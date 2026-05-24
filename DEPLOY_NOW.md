# 🚀 Quick-Mart Deployment - Manual Steps Required

## ✅ Completed
- GitHub Secrets configured with all credentials
- Backend and frontend builds verified ✓
- GitHub Actions workflows ready ✓

## 📋 Next Steps

### STEP 1: Deploy Backend to Render

1. **Go to:** https://dashboard.render.com
2. **Click:** "New +" → "Web Service"
3. **Select:** `Dev-anxit/Quick-Mart` repository
4. **Configure:**
   - Name: `quickmart-backend`
   - Environment: `Node`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. **Add Environment Variables** (use these names EXACTLY):
   ```
   NODE_ENV = production
   PORT = 5000
   FRONTEND_URL = https://quickmart.vercel.app
   ```
   
   These will be auto-populated from GitHub Secrets (don't type manually):
   - DATABASE_URL → (will auto-fill from secret)
   - JWT_SECRET → (will auto-fill from secret)
   - RAZORPAY_KEY_ID → (will auto-fill from secret)
   - RAZORPAY_KEY_SECRET → (will auto-fill from secret)

6. **Click "Create Web Service"**
7. **Wait 5-10 minutes** for deployment
8. **Copy your Render URL** (looks like: `https://quickmart-backend.onrender.com`)

---

### STEP 2: Deploy Frontend to Vercel

1. **Go to:** https://vercel.com/dashboard
2. **Click:** "Add New..." → "Project"
3. **Select:** `Dev-anxit/Quick-Mart` repository
4. **Framework Preset:** React
5. **Configure:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variables:**
   ```
   VITE_API_BASE_URL = https://quickmart-backend.onrender.com/api
   VITE_RAZORPAY_KEY_ID = rzp_test_St6WcZtpZLg93a
   ```

7. **Click "Deploy"**
8. **Wait 3-5 minutes** for build and deployment
9. **Your frontend URL** will be displayed (copy it)

---

### STEP 3: Update Render with Vercel URL

1. **Go back to Render dashboard**
2. **Open** `quickmart-backend` service
3. **Go to "Environment"**
4. **Update** `FRONTEND_URL` to your Vercel URL (from Step 2)
5. **Click "Deploy"** to redeploy with new CORS settings

---

### STEP 4: Test Everything

```bash
# Backend health check
curl https://your-render-url/health

# Frontend should load
# Visit: https://your-vercel-url

# Test API connection
curl https://your-render-url/api/categories
```

---

## 🔐 SECURITY - POST DEPLOYMENT

**IMMEDIATELY after deployment completes:**

1. **Rotate Supabase Password:**
   - Go to: https://app.supabase.com → Database → Password
   - Generate new password
   - Update in Render environment variables

2. **Rotate Razorpay Keys:**
   - Go to: https://razorpay.com/dashboard → Settings → API Keys
   - Generate new keys
   - Update in GitHub Secrets and Render

3. **Rotate GitHub Token:**
   - Go to: https://github.com/settings/tokens
   - Delete old token
   - Generate new token
   - Update GitHub access (logout/login)

---

## 📊 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Render and Vercel URLs obtained
- [ ] Frontend can access backend API
- [ ] Products load on homepage
- [ ] Cart functionality works
- [ ] Authentication works
- [ ] Payment gateway responsive
- [ ] All credentials rotated
- [ ] No .env files committed to git

---

## ⚠️ If Something Fails

**Render build fails:**
- Check logs: Render Dashboard → Service → Logs
- Verify DATABASE_URL is set
- Verify Node version is 20+

**Vercel build fails:**
- Check logs: Vercel Dashboard → Project → Deployments
- Verify VITE_API_BASE_URL is correct
- Verify npm install succeeds

**API Connection fails:**
- Check CORS: Backend FRONTEND_URL must match Vercel URL exactly
- Check if Render service is "Live" (green status)
- Check firewall/network settings

---

## 📞 Support Links

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Actions: https://docs.github.com/en/actions
