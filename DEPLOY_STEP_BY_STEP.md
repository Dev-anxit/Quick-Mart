# 🚀 STEP-BY-STEP DEPLOYMENT GUIDE

## Your MongoDB Connection Ready ✅

```
MONGODB_URI=mongodb+srv://ankitkryadav6672:<Ankit@20>@cluster0.lhomkp4.mongodb.net/?appName=Cluster0
```

---

## 📋 DEPLOYMENT STEPS

### STEP 1️⃣: Deploy Backend to Render

**Time: ~5-10 minutes**

#### 1.1 Go to Render Dashboard
```
Open: https://render.com/dashboard
(Sign in with GitHub if not already)
```

#### 1.2 Create Web Service
```
Click: "+ New" button
Select: "Web Service"
Choose: "Connect Repository"
Find: "Dev-anxit/Quick-Mart"
Click: "Connect"
```

#### 1.3 Configure Service Settings
```
Fill in these fields:

Name:                    quickmart-backend
Environment:             Node
Region:                  Singapore (or closest to you)
Build Command:           npm install && npm run build
Start Command:           npm start
Instance Type:           Free
```

#### 1.4 Add Environment Variables
```
Click: "Environment" section
Add these variables:

KEY                  VALUE
────────────────────────────────────────────────────────────
NODE_ENV             production
MONGODB_URI          mongodb+srv://ankitkryadav6672:<Ankit@20>@cluster0.lhomkp4.mongodb.net/?appName=Cluster0
JWT_SECRET           quickmart-secret-key-12345-change-this
FRONTEND_URL         https://quickmart.vercel.app
PORT                 5000
```

#### 1.5 Deploy
```
Click: "Create Web Service"
Wait for build to complete (3-5 minutes)
Check: Logs tab for any errors
Success: Page will show "Live" status
```

#### 1.6 Get Backend URL
```
When deployment completes:
Copy the URL shown (looks like):
https://quickmart-backend-xxxxx.onrender.com

SAVE THIS URL - you need it for frontend!
```

#### 1.7 Test Backend
```
Open in browser:
https://quickmart-backend-xxxxx.onrender.com/health

Should show:
{"status":"OK","timestamp":"..."}
```

---

### STEP 2️⃣: Deploy Frontend to Vercel

**Time: ~5-10 minutes**

#### 2.1 Go to Vercel Dashboard
```
Open: https://vercel.com/dashboard
(Sign in with GitHub if not already)
```

#### 2.2 Add New Project
```
Click: "Add New..."
Select: "Project"
Click: "Continue with GitHub"
Find: "Dev-anxit/Quick-Mart"
Click: "Import"
```

#### 2.3 Configure Project Settings
```
Fill in these fields:

Project Name:            quickmart
Framework Preset:        Vite
Root Directory:          frontend (click pencil to edit)
Build Command:           npm run build
Install Command:         npm install
Output Directory:        dist
```

#### 2.4 Add Environment Variables
```
Click: "Environment Variables"
Add these:

VARIABLE NAME                    VALUE
─────────────────────────────────────────────────────────
VITE_API_BASE_URL               https://quickmart-backend-xxxxx.onrender.com/api
VITE_SOCKET_URL                 https://quickmart-backend-xxxxx.onrender.com
```

**Note:** Replace `xxxxx` with your actual backend URL!

#### 2.5 Deploy
```
Click: "Deploy"
Wait for build to complete (2-3 minutes)
Check: Deployments tab for status
Success: Shows "Ready"
```

#### 2.6 Get Frontend URL
```
When deployment completes:
Copy the URL shown (looks like):
https://quickmart-XXXXX.vercel.app

SAVE THIS URL - this is your live app!
```

---

### STEP 3️⃣: Test Live Application

**Time: ~5 minutes**

#### 3.1 Open Frontend
```
Open in browser:
https://quickmart-XXXXX.vercel.app

You should see:
✓ Login page loaded
✓ Phone number input field
✓ "Continue" button
```

#### 3.2 Test OTP Login
```
Enter: 9876543210 (test phone number)
Click: "Continue"

Wait for OTP to be generated...
```

#### 3.3 Get OTP from Backend Logs
```
Go to: https://render.com/dashboard
Select: quickmart-backend service
Click: "Logs" tab

Look for message like:
"OTP sent to 9876543210: 123456"

Copy the 6-digit OTP code
```

#### 3.4 Verify OTP
```
Go back to frontend
Paste the OTP code
Click: "Verify & Proceed"

You should see:
✓ Home page with products
✓ Product list loaded
✓ Shopping cart button visible
```

#### 3.5 Test Features
```
Test these to ensure everything works:

✓ Browse Products
  - Click on a product
  - Should show product details

✓ Add to Cart
  - Click "Add to Cart" button
  - Cart count should increase

✓ Search
  - Use search bar
  - Should filter products

✓ View Cart
  - Click cart icon
  - Should show items

✓ Checkout
  - Proceed to checkout
  - Should show order form
```

---

## 🎯 EXPECTED RESULTS

### Backend Deployment
```
Status:       ✅ Live
URL:          https://quickmart-backend-xxxxx.onrender.com
Health:       /health endpoint returns {"status":"OK"}
Database:     Connected to MongoDB
```

### Frontend Deployment
```
Status:       ✅ Live
URL:          https://quickmart-XXXXX.vercel.app
Page Load:    Fast (CDN delivered)
API:          Connected to backend
```

### Application
```
Authentication:    ✅ OTP login works
Products:          ✅ Load from database
Cart:              ✅ Add/remove items
Orders:            ✅ Create orders
Real-time:         ✅ Socket.io working
```

---

## 📊 YOUR DEPLOYMENT DETAILS

### MongoDB
```
Database:      Cluster0
Collection:    quickmart
Status:        ✅ Connected
```

### Backend (Render)
```
Service:       quickmart-backend
Runtime:       Node.js
Build:         npm run build
Start:         npm start
Status:        Pending deployment
```

### Frontend (Vercel)
```
Project:       quickmart
Framework:     Vite
Build:         npm run build
Status:        Pending deployment
```

---

## ✅ DEPLOYMENT CHECKLIST

### Before Deployment
- [x] Code built successfully
- [x] TypeScript errors fixed
- [x] MongoDB connection string ready
- [x] Code pushed to GitHub

### Backend Deployment
- [ ] Go to Render
- [ ] Create Web Service
- [ ] Add environment variables
- [ ] Deploy (wait 3-5 min)
- [ ] Test health endpoint
- [ ] Save backend URL

### Frontend Deployment
- [ ] Go to Vercel
- [ ] Create project
- [ ] Add environment variables (use backend URL)
- [ ] Deploy (wait 2-3 min)
- [ ] Save frontend URL

### Testing
- [ ] Frontend loads
- [ ] OTP login works
- [ ] Products display
- [ ] Add to cart works
- [ ] Checkout works

---

## 🔍 MONITORING

### Monitor Backend (Render)
```
1. Go to: https://render.com/dashboard
2. Click: quickmart-backend service
3. Check: Logs tab for real-time logs
4. Watch for: Any errors or warnings
5. Look for: "OTP sent to..." messages
```

### Monitor Frontend (Vercel)
```
1. Go to: https://vercel.com/dashboard
2. Click: quickmart project
3. Check: Recent Deployments
4. Click: Latest deployment
5. View: Build logs & runtime logs
```

### Monitor Database (MongoDB)
```
1. Go to: https://cloud.mongodb.com
2. Login with: ankitkryadav6672
3. Select: Cluster0
4. View: Collections & documents
5. Check: Data is being stored
```

---

## 🆘 TROUBLESHOOTING

### Backend Build Fails
**Error:** `npm install` or `build` fails

**Fix:**
1. Check Node version (need 16+)
2. View full logs in Render
3. Common issues:
   - Missing dependencies
   - Port already in use
   - Environment variables not set

### MongoDB Connection Error
**Error:** Cannot connect to MongoDB

**Fix:**
1. Verify connection string spelling
2. Check MongoDB whitelist (0.0.0.0/0)
3. Ensure database exists
4. Test locally: `npm start` with same URI

### Frontend Not Loading
**Error:** Blank page or 404

**Fix:**
1. Check Vercel build logs
2. Verify environment variables set
3. Make sure backend URL is correct
4. Clear browser cache & reload

### OTP Not Working
**Error:** OTP not appearing, verification fails

**Fix:**
1. Check backend logs for errors
2. Verify MongoDB is connected
3. Ensure NODE_ENV=production
4. Check for console errors in frontend

---

## 📞 SUPPORT

**Documentation:**
- `QUICK_REFERENCE.md` - Quick guide
- `DEPLOY_SETUP.md` - Detailed guide
- `DEPLOYMENT_IN_PROGRESS.md` - This guide

**Services:**
- Render Help: https://render.com/docs
- Vercel Help: https://vercel.com/docs
- MongoDB Help: https://docs.mongodb.com

---

**Your QuickMart app is ready to launch! 🚀**

Next Step: Go to https://render.com/dashboard and create the backend service

