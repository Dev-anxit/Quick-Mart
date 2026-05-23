# 🚀 QUICK DEPLOYMENT REFERENCE

## ✅ PRE-DEPLOYMENT CHECKLIST

```
[✓] Backend builds successfully
[✓] Frontend builds successfully
[✓] All TypeScript errors fixed
[✓] Code pushed to GitHub
[✓] Render.yaml configured
[✓] Environment templates created
```

---

## 📝 STEP-BY-STEP DEPLOYMENT

### STEP 1: MongoDB Atlas Setup (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with GitHub → Login
3. Create Organization → Create Project → Create Cluster
   - Select: **Free M0 Cluster**
   - Cloud Provider: AWS
   - Region: Choose closest to you (e.g., ap-south-1 for India)
4. Create Database User:
   - Database Access → Add New User
   - Username: `quickmart_admin`
   - Password: Generate secure password (save it!)
   - Built-in Role: `readWriteAnyDatabase`
5. Allow Network Access:
   - Network Access → Add IP Address
   - IP: `0.0.0.0/0` (Allow anywhere)
   - Add to Whitelist
6. Get Connection String:
   - Databases → Connect → Drivers
   - Copy: `mongodb+srv://quickmart_admin:PASSWORD@cluster.mongodb.net/quickmart`

**📌 SAVE:**
```
MONGODB_URI=mongodb+srv://quickmart_admin:PASSWORD@cluster.mongodb.net/quickmart
```

---

### STEP 2: Deploy Backend to Render (5 minutes)

1. Go to: https://render.com
2. Sign up with GitHub → Authorize
3. Create New Web Service:
   - Click: "New +" → "Web Service"
   - Connect Repository: `Dev-anxit/Quick-Mart`
   - Authorize GitHub
4. Configure Service:
   ```
   Name: quickmart-backend
   Environment: Node
   Region: Choose closest to you
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
5. Set Environment Variables:
   | Key | Value |
   |-----|-------|
   | NODE_ENV | production |
   | MONGODB_URI | (from Step 1) |
   | JWT_SECRET | generate-random-32-char-string |
   | FRONTEND_URL | https://quickmart.vercel.app |
   | PORT | 5000 |

6. Deploy:
   - Click "Deploy Web Service"
   - Wait for deployment (3-5 minutes)
   - Check logs for errors
   - When ready, test: `https://quickmart-backend-XXX.onrender.com/health`

**📌 SAVE:**
```
BACKEND_URL=https://quickmart-backend-XXX.onrender.com
VITE_API_BASE_URL=https://quickmart-backend-XXX.onrender.com/api
VITE_SOCKET_URL=https://quickmart-backend-XXX.onrender.com
```

---

### STEP 3: Deploy Frontend to Vercel (5 minutes)

1. Go to: https://vercel.com
2. Sign up with GitHub → Authorize
3. Add New Project:
   - Click: "Add New Project"
   - Import: `Dev-anxit/Quick-Mart`
   - Authorize GitHub
4. Configure:
   ```
   Project Name: quickmart
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build
   Install Command: npm install
   Output Directory: dist
   ```
5. Set Environment Variables:
   ```
   VITE_API_BASE_URL = https://quickmart-backend-XXX.onrender.com/api
   VITE_SOCKET_URL = https://quickmart-backend-XXX.onrender.com
   ```
   (Add Firebase/Google Maps keys if needed)

6. Deploy:
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Get URL: `https://quickmart-XXXX.vercel.app`

**📌 SAVE:**
```
FRONTEND_URL=https://quickmart-XXXX.vercel.app
```

---

## 🧪 TEST DEPLOYED APP

```bash
# 1. Open in browser
https://quickmart-XXXX.vercel.app

# 2. Try login with OTP
Phone: 9876543210
Click: "Continue"

# 3. Get OTP from backend logs
Render Dashboard → Backend Service → Logs
Look for: "OTP sent to 9876543210: XXXXXX"

# 4. Enter OTP and verify
Paste the 6-digit OTP
Click: "Verify & Proceed"

# 5. See home page
Browse products, add to cart, checkout
```

---

## 🔧 TROUBLESHOOTING

### Backend Deploy Fails
```bash
# Check local build
cd backend
npm install
npm run build

# If errors:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### MongoDB Connection Error
```
Error: MongoNetworkError
→ Check username/password in MONGODB_URI
→ Go to MongoDB Atlas → Security → Check IP whitelist
→ Add: 0.0.0.0/0
```

### Frontend Can't Connect
```
Error: 404 on /api requests
→ Check VITE_API_BASE_URL on Vercel
→ Test: curl https://backend-url/health
→ Check CORS in backend/src/app.ts
```

### OTP Not Showing
```
→ Backend logs: Render → Logs tab
→ Look for: "OTP sent to..."
→ If not there: Check MONGODB_URI is correct
```

---

## 📊 FINAL CHECKLIST

```
[✓] MongoDB Atlas running
[✓] Backend deployed on Render
[✓] Frontend deployed on Vercel
[✓] OTP login working
[✓] Products showing on home page
[✓] Cart functionality working
[✓] Checkout process working
```

---

## 💡 POST-DEPLOYMENT

1. **Monitor Logs**: Check Render & Vercel dashboards daily
2. **Test Features**: Try OTP, cart, checkout, orders
3. **Collect Feedback**: See if users face issues
4. **Plan Upgrades**: When you need more resources

---

**Total Time: 15-20 minutes**  
**Cost: $0 (completely free tier)**  
**Live at: Your URLs above!**
