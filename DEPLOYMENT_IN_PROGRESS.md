# 🚀 DEPLOYMENT IN PROGRESS

## ✅ MongoDB Setup Complete

**Connection String Configured:**
```
mongodb+srv://ankitkryadav6672:<Ankit@20>@cluster0.lhomkp4.mongodb.net/?appName=Cluster0
```

**Status:** ✅ Ready to use

---

## 📋 DEPLOYMENT CHECKLIST

### ✅ STEP 1: MongoDB Atlas - COMPLETE
- [x] MongoDB Atlas database configured
- [x] Connection string obtained
- [x] Database user created (ankitkryadav6672)
- [x] Ready to connect from Render

### STEP 2: Deploy Backend to Render (NEXT)

**Instructions:**

1. **Go to Render Dashboard:** https://render.com/dashboard

2. **Create New Web Service:**
   - Click: "New +" → "Web Service"
   - Connect your GitHub: `Dev-anxit/Quick-Mart`
   - Authorize if prompted

3. **Configure Service:**
   ```
   Name: quickmart-backend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Root Directory: backend (optional)
   ```

4. **Set Environment Variables** (Click "Advanced" if needed):
   
   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://ankitkryadav6672:<Ankit@20>@cluster0.lhomkp4.mongodb.net/?appName=Cluster0` |
   | `JWT_SECRET` | Generate random string: `your-secret-key-32-chars-min` |
   | `FRONTEND_URL` | `https://quickmart.vercel.app` |
   | `PORT` | `5000` |

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for build (3-5 minutes)
   - Check logs for errors
   - **Save the URL when deployment completes**
   - Example: `https://quickmart-backend-xxxxx.onrender.com`

6. **Test Backend:**
   ```
   curl https://quickmart-backend-xxxxx.onrender.com/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

**After Backend Deployment:**
- [ ] Backend URL: `https://quickmart-backend-xxxxx.onrender.com`
- [ ] Health check working

---

### STEP 3: Deploy Frontend to Vercel

**Instructions:**

1. **Go to Vercel:** https://vercel.com/dashboard

2. **Add New Project:**
   - Click "Add New Project"
   - Import: `Dev-anxit/Quick-Mart`
   - Authorize GitHub if needed

3. **Configure Project:**
   ```
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build
   Install Command: npm install
   Output Directory: dist
   ```

4. **Set Environment Variables:**
   
   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | `https://quickmart-backend-xxxxx.onrender.com/api` |
   | `VITE_SOCKET_URL` | `https://quickmart-backend-xxxxx.onrender.com` |
   | `VITE_FIREBASE_API_KEY` | (optional - for Firebase features) |
   | `VITE_FIREBASE_AUTH_DOMAIN` | (optional) |
   | `VITE_FIREBASE_PROJECT_ID` | (optional) |
   | `VITE_FIREBASE_STORAGE_BUCKET` | (optional) |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | (optional) |
   | `VITE_FIREBASE_APP_ID` | (optional) |
   | `VITE_GOOGLE_MAPS_API_KEY` | (optional) |
   | `VITE_RAZORPAY_KEY` | (optional) |

5. **Deploy:**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - **Save the URL when deployment completes**
   - Example: `https://quickmart-xxxxx.vercel.app`

6. **Test Frontend:**
   - Open URL in browser
   - Should load the login page

**After Frontend Deployment:**
- [ ] Frontend URL: `https://quickmart-xxxxx.vercel.app`
- [ ] Page loads in browser

---

### STEP 4: Test Live Application

**Login Test:**
1. Open: `https://quickmart-xxxxx.vercel.app`
2. Enter phone: `9876543210`
3. Click: "Continue"
4. **Check backend logs** for OTP:
   - Render Dashboard → quickmart-backend → Logs
   - Look for: `"OTP sent to 9876543210: XXXXXX"`
5. Enter the 6-digit OTP
6. Click: "Verify & Proceed"
7. Should see home page with products

**Feature Testing:**
- [ ] OTP login works
- [ ] Home page loads with products
- [ ] Search functionality works
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Order confirmation received
- [ ] Order tracking displays

---

## 🔧 TROUBLESHOOTING

### Backend Deploy Fails
**Error:** Build fails on Render

**Solution:**
1. Check Render logs for specific error
2. Verify MONGODB_URI format is correct
3. Ensure all environment variables are set
4. Try manual build locally:
   ```bash
   cd backend
   npm install
   npm run build
   ```

### MongoDB Connection Error
**Error:** `MongoNetworkError` or connection timeout

**Solution:**
1. Verify connection string is correct
2. Check MongoDB IP whitelist:
   - MongoDB Atlas → Security → Network Access
   - Should have `0.0.0.0/0` whitelisted
3. Test connection string locally

### Frontend Can't Connect to Backend
**Error:** 404 errors on API calls or "Cannot reach backend"

**Solution:**
1. Verify `VITE_API_BASE_URL` matches backend URL
2. Add `/api` suffix to backend URL
3. Test backend directly:
   ```
   curl https://quickmart-backend-xxxxx.onrender.com/health
   ```
4. Check CORS settings in backend logs

### OTP Not Appearing in Logs
**Error:** OTP not generated or logs don't show OTP

**Solution:**
1. Check MongoDB is connected
2. Verify MONGODB_URI in Render env vars
3. Check Node.js version (should be 18+)
4. Look for error messages in backend logs
5. Manually check MongoDB collections:
   - MongoDB Atlas → Collections → Check for OTP records

---

## 📊 DEPLOYMENT URLS

Once deployed, save these:

**Backend API:**
```
https://quickmart-backend-xxxxx.onrender.com/api
```

**Frontend App:**
```
https://quickmart-xxxxx.vercel.app
```

**MongoDB:**
```
Connected via MongoDB Atlas
```

---

## ✅ FINAL CHECKLIST

- [ ] MongoDB connection string working
- [ ] Backend deployed to Render
- [ ] Backend health check working
- [ ] Frontend deployed to Vercel
- [ ] Frontend page loads
- [ ] OTP login working
- [ ] Products display on home page
- [ ] Cart functionality working
- [ ] Order creation working
- [ ] Order tracking working

---

## 📞 QUICK REFERENCE

**Repository:**
https://github.com/Dev-anxit/Quick-Mart.git

**MongoDB Connection String:**
```
mongodb+srv://ankitkryadav6672:<Ankit@20>@cluster0.lhomkp4.mongodb.net/?appName=Cluster0
```

**Deployment Services:**
- Backend: https://render.com
- Frontend: https://vercel.com
- Database: MongoDB Atlas

---

**Status: In Progress** ⏳

Next: Deploy to Render backend →

