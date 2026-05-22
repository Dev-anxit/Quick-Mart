# QuickMart Deployment Guide

This guide helps you deploy QuickMart backend and frontend to free hosting services.

## Backend Deployment to Render

Render is a free platform perfect for deploying Node.js applications.

### Prerequisites
- GitHub account (to connect your repository)
- Render account (free at https://render.com)
- MongoDB Atlas account (free tier at https://www.mongodb.com/cloud/atlas)

### Steps to Deploy Backend:

1. **Create MongoDB Atlas Database**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new project and cluster (M0 free tier)
   - Get your connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce`

2. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Quick-Mart.git
   git push -u origin main
   ```

3. **Deploy to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `quickmart-backend`
     - Runtime: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Instance Type: **Free**

4. **Set Environment Variables on Render**
   - In Render dashboard, go to Environment
   - Add the following variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
     JWT_SECRET=generate-a-random-string-32-chars-minimum
     FRONTEND_URL=https://your-frontend.vercel.app
     RAZORPAY_KEY_ID=your_key_id (optional)
     RAZORPAY_KEY_SECRET=your_key_secret (optional)
     ```

5. **Deploy**
   - Render will automatically deploy when you push to main
   - Backend URL: `https://quickmart-backend.onrender.com`

---

## Frontend Deployment to Vercel

Vercel is optimized for React and Vite applications.

### Prerequisites
- GitHub account (already created from backend)
- Vercel account (free at https://vercel.com)

### Steps to Deploy Frontend:

1. **Update Backend URL in Frontend**
   - Open `frontend/.env.production`
   - Change `VITE_API_BASE_URL` to your Render backend URL
   - Change `VITE_SOCKET_URL` to your Render backend URL

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory
   - Build Settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
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

3. **Deploy**
   - Vercel will automatically build and deploy
   - Frontend URL: `https://your-project.vercel.app`

---

## Post-Deployment Steps

1. **Test the Application**
   - Visit your Vercel frontend URL
   - Try OTP login with any 10-digit phone number
   - Check backend logs in Render dashboard

2. **Monitor Application**
   - Backend logs: Render dashboard
   - Frontend logs: Vercel deployment logs
   - MongoDB: Atlas dashboard

3. **Custom Domain (Optional)**
   - Vercel: Add custom domain in project settings
   - Render: Add custom domain in service settings
   - Update DNS records at your domain provider

---

## Common Issues & Solutions

### Backend Not Connecting
- Check `FRONTEND_URL` environment variable includes https://
- Verify CORS settings in backend code
- Check MongoDB connection string is correct

### Frontend Not Loading Data
- Verify `VITE_API_BASE_URL` in environment variables
- Check backend is running (test health endpoint)
- Open browser console for error messages

### OTP Not Working
- Backend needs to connect to MongoDB
- Verify MongoDB Atlas IP whitelist includes Render IP
- Check backend logs for errors

### Build Failing
- Ensure all dependencies are installed locally first
- Check Node.js version compatibility
- Review build logs in Render/Vercel dashboard

---

## Free Tier Limitations

**Render (Backend)**
- Free tier sleeps after 15 minutes of inactivity
- No custom domain without paid plan
- Limited to 1 web service
- Cold starts may take 30+ seconds

**Vercel (Frontend)**
- Free tier includes custom domain
- Unlimited deployments
- Serverless functions available
- Good for static sites

**MongoDB Atlas (Database)**
- Free M0 cluster: 512MB storage
- Good for development/testing
- Can upgrade to paid later

---

## Upgrade Path

When ready to scale:
- **Backend**: Upgrade Render to paid plan or use Railway/Fly.io
- **Frontend**: Vercel free tier is excellent, consider Pro for analytics
- **Database**: MongoDB Atlas paid tiers for more storage
- **Domain**: Buy domain from Namecheap, GoDaddy, or Cloudflare

---

## Support

For issues:
1. Check service status pages
2. Review deployment logs
3. Verify environment variables
4. Test locally before deploying
