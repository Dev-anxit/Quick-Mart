# QuickMart Deployment Quick Reference

## Free Hosting Services (Recommended)

### Backend Hosting
- **Service**: Render.com (https://render.com)
- **Type**: Node.js Web Service (Free tier)
- **Cost**: FREE (with limitations)
- **Cold Start**: ~30 seconds after inactivity
- **Storage**: Included, no persistent storage
- **Expected URL**: `https://quickmart-backend.onrender.com`

### Database Hosting
- **Service**: MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- **Type**: M0 Free Tier Cluster
- **Cost**: FREE (512MB storage)
- **Plan**: Good for development and small apps
- **Connection**: `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce`

### Frontend Hosting
- **Service**: Vercel (https://vercel.com)
- **Type**: Static Site (Vite Build)
- **Cost**: FREE
- **Features**: Unlimited deployments, custom domain
- **Expected URL**: `https://quickmart.vercel.app`

---

## Step-by-Step Deployment (Estimated 30 minutes)

### Step 1: Prepare Backend for Deployment (5 mins)

```bash
cd backend
npm run build
```

Files already created:
- ✅ `Procfile` - For Render deployment
- ✅ `.env.production` - Environment variables template
- ✅ `vercel.json` - Alternative deployment config

### Step 2: Setup MongoDB Atlas (10 mins)

1. Visit: https://www.mongodb.com/cloud/atlas
2. Sign up with email/Google/GitHub
3. Create free cluster (M0)
4. Whitelist IP: 0.0.0.0/0 (allow all for free tier)
5. Get connection string like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/ecommerce
   ```

### Step 3: Deploy Backend to Render (10 mins)

1. Visit: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill deployment form:
   - **Name**: `quickmart-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
   JWT_SECRET=generate-random-string-min-32-chars
   FRONTEND_URL=https://quickmart.vercel.app
   ```

7. Click Deploy
8. **Copy your backend URL**: `https://quickmart-backend.onrender.com`

### Step 4: Deploy Frontend to Vercel (5 mins)

1. Visit: https://vercel.com
2. Sign up with GitHub (same account as Render)
3. Click "New Project"
4. Import GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://quickmart-backend.onrender.com/api
   VITE_SOCKET_URL=https://quickmart-backend.onrender.com
   VITE_FIREBASE_API_KEY=AIzaSyDummy...
   VITE_FIREBASE_AUTH_DOMAIN=quickmart-dummy.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=quickmart-dummy
   VITE_FIREBASE_STORAGE_BUCKET=quickmart-dummy.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyDummy...
   VITE_RAZORPAY_KEY=rzp_test_dummy
   ```

7. Click Deploy
8. **Your frontend URL**: `https://your-project-name.vercel.app`

---

## Test Your Deployment

1. **Visit Frontend URL**
   ```
   https://your-project-name.vercel.app
   ```

2. **Test OTP Login**
   - Enter any 10-digit phone number
   - Backend will log OTP to console (check Render logs)
   - Enter the OTP from logs
   - Should log in successfully

3. **Check Logs**
   - **Backend**: Render Dashboard → Service → Logs
   - **Frontend**: Vercel Dashboard → Deployments → Logs
   - **Database**: MongoDB Atlas Dashboard

---

## Expected Performance

- Frontend load: < 3 seconds (Vercel CDN)
- Backend first request: ~30 seconds (cold start on Render free)
- Backend subsequent: ~200ms
- Database queries: ~50-100ms

---

## Upgrade When Needed

### When to Upgrade Backend
- App getting 100+ users
- Cold starts becoming problematic
- Need more API rate limits
- **Options**: Railway, Fly.io, or Render Paid

### When to Upgrade Database
- Exceeding 512MB storage
- Need production backup
- **Options**: MongoDB Atlas Paid, AWS, GCP

### When to Upgrade Frontend
- Need advanced analytics
- Custom domain with SSL
- **Options**: Vercel Pro ($20/month), stays great value

---

## Custom Domain Setup (Optional)

### For Backend (Render)
1. In Render dashboard, select service
2. Go to Settings → Custom Domain
3. Add your domain
4. Update DNS records
5. Click Verify

### For Frontend (Vercel)
1. In Vercel project, go to Settings → Domains
2. Add custom domain
3. Update DNS records
4. Automatic SSL certificate

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend 503 error | Render cold start, wait 30 seconds and retry |
| MongoDB connection fails | Check IP whitelist in Atlas, allow 0.0.0.0/0 |
| OTP not working | Check backend logs in Render dashboard |
| Frontend blank page | Check browser console for API errors |
| Build failing | Review build logs in Vercel dashboard |

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## Success Checklist

- ✅ Backend deployed to Render
- ✅ Frontend deployed to Vercel
- ✅ MongoDB Atlas database connected
- ✅ Environment variables configured
- ✅ OTP login tested
- ✅ Logs monitored
- ✅ Custom domains configured (optional)

**You're live! 🎉**
