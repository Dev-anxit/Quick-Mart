# 🚀 Backend Deployment to Render - Step by Step

Your code is ready and committed to GitHub. Follow these simple steps to deploy your backend to Render.

## ✅ Prerequisites Checklist
- ✅ Code pushed to GitHub (https://github.com/Dev-anxit/Quick-Mart.git)
- ✅ Backend builds successfully (`npm run build` passes)
- ✅ Procfile configured for Render

## 📋 Step 1: Create MongoDB Database (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** or Sign In with GitHub
3. Create a free cluster (M0)
4. Click **Build a Database** → Choose **Free** (M0)
5. Accept default settings and click **Create Cluster**
6. Wait 3-5 minutes for cluster to be created
7. Go to **Security** → **Database Access** → **Create Database User**
   - Username: `quickmart_user`
   - Password: `GenerateSecurePassword123!` (save this)
   - Click **Create User**
8. Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
9. Go to **Clusters** → Click **Connect** → **Drivers** → **NodeJS**
10. Copy the connection string that looks like:
    ```
    mongodb+srv://quickmart_user:GenerateSecurePassword123!@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
    ```
    **Save this as your MONGODB_URI**

---

## 📋 Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Click **Sign Up** → **Continue with GitHub** (authorize if prompted)
3. Click **New +** → **Web Service**
4. Under "Connect a repository":
   - Select **Dev-anxit/Quick-Mart** from the dropdown
   - If not visible, click **Connect account** and authorize GitHub
5. Fill in deployment settings:
   ```
   Name: quickmart-backend
   Environment: Node
   Region: Oregon (Default)
   Branch: main
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
6. Click **Create Web Service** (you'll see a loading screen)
7. Once service is created, go to **Environment** tab
8. Add these environment variables:
   ```
   NODE_ENV                    production
   MONGODB_URI                 [Paste your MongoDB connection string from Step 1]
   JWT_SECRET                  your-super-secret-jwt-key-change-this-12345
   FRONTEND_URL                https://quickmart.vercel.app
   PORT                        3000
   ```
9. Click **Save Changes**
10. Render will automatically redeploy
11. Wait for the build to complete (green checkmark)
12. You'll see your backend URL like: **https://quickmart-backend.onrender.com**
    **Save this URL for Step 3**

### Expected Build Output:
```
=== Building project...
npm WARN lifecycle The node_modules bin directory may not be in your PATH
> npm run build
> tsc
✓ Backend built successfully
```

---

## 📋 Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **Sign Up** → **Continue with GitHub**
3. Click **Add New...** → **Project**
4. Select **Dev-anxit/Quick-Mart** repository
5. Configure project:
   ```
   Framework Preset: Vite
   Root Directory: ./frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. Under **Environment Variables**, add:
   ```
   VITE_API_BASE_URL    [Your Render backend URL]/api
   VITE_SOCKET_URL      [Your Render backend URL]
   ```
   Example:
   ```
   VITE_API_BASE_URL    https://quickmart-backend.onrender.com/api
   VITE_SOCKET_URL      https://quickmart-backend.onrender.com
   ```
7. Click **Deploy**
8. Wait for deployment to complete
9. You'll see your frontend URL like: **https://quickmart.vercel.app**

---

## 🧪 Step 4: Test Your Deployment

1. Open your frontend URL: `https://quickmart.vercel.app`
2. Try the OTP login flow:
   - Enter phone number: `9988776655`
   - Click "Continue"
   - Check Render logs for generated OTP (backend logs it)
   - Enter the OTP code
   - Click "Verify & Proceed"
3. You should see the home page with products

### View Render Logs:
- Go to your Render dashboard
- Click **quickmart-backend**
- Go to **Logs** tab
- Look for: `📱 OTP for 9988776655: XXXXXX`

---

## 🔑 Important Notes

- **MongoDB free tier**: 512MB storage (enough for development)
- **Render free tier**: Auto-sleeps after 15 minutes of inactivity (adds 30s cold start)
- **Vercel free tier**: No cold starts, instant deployment
- **Environment Variables**: Don't commit `.env` files - always set them on the hosting platform
- **JWT_SECRET**: Change this to a secure random string in production

---

## ✅ Summary of URLs

| Service | URL |
|---------|-----|
| Backend API | `https://quickmart-backend.onrender.com/api` |
| Frontend | `https://quickmart.vercel.app` |
| MongoDB | Atlas dashboard |

---

## ⚡ Quick Commands (if needed)

**View backend logs:**
```bash
# On Render dashboard → Logs tab
```

**Redeploy without code changes:**
```bash
# On Render → Click "Manual Deploy" → "Deploy latest commit"
```

**Update environment variables:**
```bash
# Render → Environment tab → Edit → Save
```

---

**You're all set! 🎉 Your e-commerce app is now live!**
