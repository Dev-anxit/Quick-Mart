#!/bin/bash

# QuickMart Quick Deployment Script
# This script prepares your project for deployment

echo "🚀 QuickMart Deployment Preparation"
echo "====================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial QuickMart commit - ready for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Backend (Render):"
echo "1. ☐ Go to https://render.com and sign up (free)"
echo "2. ☐ Go to https://mongodb.com/cloud/atlas and create free database"
echo "3. ☐ Copy MongoDB connection string"
echo "4. ☐ Connect GitHub repo to Render"
echo "5. ☐ Deploy backend with these environment variables:"
echo "     - NODE_ENV=production"
echo "     - MONGODB_URI=<your-mongodb-string>"
echo "     - JWT_SECRET=<random-32-char-string>"
echo "     - FRONTEND_URL=https://your-frontend-domain"
echo ""
echo "Frontend (Vercel):"
echo "1. ☐ Go to https://vercel.com and sign up (free)"
echo "2. ☐ Connect GitHub repo to Vercel"
echo "3. ☐ Select 'frontend' as root directory"
echo "4. ☐ Add environment variables with backend URL"
echo "5. ☐ Deploy to Vercel"
echo ""
echo "Post-Deployment:"
echo "1. ☐ Update FRONTEND_URL in backend .env.production"
echo "2. ☐ Update VITE_API_BASE_URL in frontend .env.production"
echo "3. ☐ Test OTP login flow"
echo "4. ☐ Monitor logs in Render and Vercel dashboards"
echo ""
echo "✨ For detailed instructions, see DEPLOYMENT.md"
