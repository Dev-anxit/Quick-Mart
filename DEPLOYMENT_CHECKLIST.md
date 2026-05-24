# Quick-Mart Deployment Checklist

## Pre-Deployment
- [x] All code committed to GitHub
- [x] Application tested locally
- [x] Database schema ready (Prisma)
- [x] Environment variables documented

## Phase 1: Supabase (Database)
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new PostgreSQL project
- [ ] Get DATABASE_URL from Settings → Database
- [ ] Save connection string for next steps

## Phase 2: Render (Backend)
- [ ] Create Render account at https://render.com
- [ ] Connect GitHub repository
- [ ] Create Web Service (backend directory)
- [ ] Set environment variables:
  - [ ] NODE_ENV = production
  - [ ] DATABASE_URL = (from Supabase)
  - [ ] JWT_SECRET
  - [ ] FRONTEND_URL
  - [ ] RAZORPAY_KEY_ID
  - [ ] RAZORPAY_KEY_SECRET
- [ ] Deploy and wait 3-5 minutes
- [ ] Verify: curl https://your-backend.onrender.com/health
- [ ] Save backend URL

## Phase 3: Vercel (Frontend)
- [ ] Create Vercel account at https://vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory: frontend
- [ ] Set environment variables:
  - [ ] VITE_API_BASE_URL = (your Render backend URL)
  - [ ] VITE_RAZORPAY_KEY_ID
- [ ] Deploy and wait 2-3 minutes
- [ ] Verify frontend loads
- [ ] Save frontend URL

## Phase 4: Update Backend
- [ ] Go back to Render dashboard
- [ ] Update FRONTEND_URL with your Vercel URL
- [ ] Redeploy

## Phase 5: GitHub Automation (Optional)
- [ ] Go to GitHub Settings → Secrets and variables → Actions
- [ ] Add Render secrets:
  - [ ] RENDER_SERVICE_ID
  - [ ] RENDER_API_KEY
- [ ] Add Vercel secrets:
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_PROJECT_ID
  - [ ] VERCEL_ORG_ID

## Testing
- [ ] Frontend loads at https://quickmart.vercel.app
- [ ] Backend responds at https://your-backend.onrender.com/health
- [ ] OTP login works
- [ ] Products load
- [ ] Cart functionality works
- [ ] Checkout completes

## Monitoring
- [ ] Set up Render email notifications
- [ ] Set up Vercel email notifications
- [ ] Monitor application logs
- [ ] Track usage and errors

---

## 📞 Need Help?

1. **Render Docs**: https://render.com/docs
2. **Vercel Docs**: https://vercel.com/docs
3. **Supabase Docs**: https://supabase.com/docs
4. **Prisma Docs**: https://www.prisma.io/docs

---

## 🚀 Production URLs (After Deployment)

- Frontend: https://quickmart.vercel.app
- Backend: https://quickmart-backend.onrender.com
- Database: Supabase PostgreSQL
