# 🚀 GitHub Actions Auto-Deployment Setup

Your application now has automatic deployment workflows! Every time you push to `main`, it will automatically deploy to Render (backend) and Vercel (frontend).

---

## ⚙️ SETUP STEPS (One-time only)

### Step 1: Go to GitHub Repository Settings
1. Open: https://github.com/Dev-anxit/Quick-Mart
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions** (left sidebar)

---

### Step 2: Create Render Secrets

#### Get Render API Key:
1. Go to https://render.com/account/api-tokens
2. Create new API token
3. Copy the token

#### Get Render Service ID:
1. Go to https://render.com/dashboard
2. Create a new Web Service from GitHub (Dev-anxit/Quick-Mart)
3. Name: `quickmart-backend`
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. After creating, note the Service ID from the URL (look like `srv-xxxxx`)

#### Add Secrets to GitHub:
- **New secret:** `RENDER_API_KEY` → paste your API key
- **New secret:** `RENDER_SERVICE_ID` → paste your service ID (without `srv-`)

---

### Step 3: Create Vercel Secrets

#### Get Vercel Token:
1. Go to https://vercel.com/account/tokens
2. Create new token with access to all scopes
3. Copy the token

#### Get Vercel Project IDs:
1. Go to https://vercel.com/dashboard
2. Import project from GitHub (Dev-anxit/Quick-Mart)
3. Root directory: `frontend`
4. After importing, you'll see:
   - **Project ID** - copy this
   - **Team ID** - usually in settings (if personal, use org ID)

#### Add Secrets to GitHub:
- **New secret:** `VERCEL_TOKEN` → paste your Vercel token
- **New secret:** `VERCEL_PROJECT_ID` → paste your project ID
- **New secret:** `VERCEL_ORG_ID` → paste your org/team ID

---

### Step 4: Configure Environment Variables in Render

In Render dashboard for `quickmart-backend` service, add these environment variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://ankitkryadav6672:<Ankit@20>@cluster0.lhomkp4.mongodb.net/?appName=Cluster0
JWT_SECRET=quickmart-secret-key-12345
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
PORT=5000
```

---

### Step 5: Configure Environment Variables in Vercel

In Vercel dashboard for the frontend project, add these environment variables:
```
VITE_API_BASE_URL=https://quickmart-backend-XXXXX.onrender.com/api
VITE_SOCKET_URL=https://quickmart-backend-XXXXX.onrender.com
```
(Replace `XXXXX` with your actual Render backend URL once it deploys)

---

## 🎯 How It Works

1. **You push to main** - e.g., `git push origin main`
2. **GitHub Actions trigger automatically**
3. **Backend workflow:**
   - Checks code
   - Calls Render API to deploy
   - Render rebuilds and starts service (2-3 minutes)
4. **Frontend workflow:**
   - Checks code
   - Uses Vercel CLI to deploy
   - Vercel rebuilds and publishes (2-3 minutes)

---

## ✅ Testing Auto-Deployment

### Test 1: Make a small change
```bash
# Edit any file in backend/
echo "// test" >> backend/src/index.ts

# Commit and push
git add backend/
git commit -m "Test auto-deployment"
git push origin main
```

### Test 2: Check GitHub Actions
1. Go to https://github.com/Dev-anxit/Quick-Mart
2. Click **Actions** tab
3. Watch workflows run in real-time
4. See deployment status and logs

### Test 3: Verify Deployment
- **Backend:** Visit https://quickmart-backend-XXXXX.onrender.com/health
- **Frontend:** Visit https://quickmart.vercel.app

---

## 🔄 Workflow Files

Two new workflows created in `.github/workflows/`:

**1. deploy-backend.yml**
- Triggers on: changes to `backend/` folder or this workflow file
- Action: Calls Render API to redeploy
- Time: ~2-3 minutes

**2. deploy-frontend.yml**
- Triggers on: changes to `frontend/` folder or this workflow file
- Action: Uses Vercel CLI to redeploy
- Time: ~2-3 minutes

---

## 📊 Deployment Timeline

```
0 min   → You: git push origin main
0-1 min → GitHub: Actions triggered
1-3 min → Backend: Render rebuilds & deploys
1-3 min → Frontend: Vercel rebuilds & deploys
3+ min  → Your app is LIVE with new changes!
```

---

## 🐛 Troubleshooting

### Workflow won't trigger
- [ ] Pushed to `main` branch (not another branch)
- [ ] Changes are in `backend/` or `frontend/` folders
- [ ] Check Actions tab for error logs

### Backend deployment fails
- [ ] Check Render service logs
- [ ] Verify MongoDB connection string is correct
- [ ] Make sure backend builds locally: `npm run build --prefix backend`

### Frontend deployment fails
- [ ] Check Vercel deployment logs
- [ ] Verify VITE_API_BASE_URL is correct
- [ ] Make sure frontend builds locally: `npm run build --prefix frontend`

### Secrets not working
- [ ] Double-check secret names match workflow file exactly
- [ ] Regenerate tokens if they look wrong
- [ ] Test by viewing Actions run logs (won't show secret values)

---

## 🎉 You're All Set!

From now on, your deployment is **fully automated**:
- Push code → GitHub Actions detects changes
- Workflows run → Render & Vercel get notified
- Services redeploy → Your app is live!

**No more manual deployment steps needed!** 🚀
