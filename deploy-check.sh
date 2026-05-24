#!/bin/bash

# Quick-Mart Deployment Setup Script
# This script helps verify your local setup before deployment

echo "🔍 Quick-Mart Deployment Pre-Check"
echo "===================================="
echo ""

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node Version: $NODE_VERSION"

# Check npm
NPM_VERSION=$(npm -v)
echo "✓ NPM Version: $NPM_VERSION"

# Check if git is set up
GIT_REMOTE=$(git remote -v | grep origin | head -1)
echo "✓ Git Remote: $GIT_REMOTE"

# Check backend build
echo ""
echo "🏗️  Building Backend..."
cd backend
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Backend builds successfully"
else
    echo "✗ Backend build failed"
    exit 1
fi
cd ..

# Check frontend build
echo "🏗️  Building Frontend..."
cd frontend
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Frontend builds successfully"
else
    echo "✗ Frontend build failed"
    exit 1
fi
cd ..

# Check GitHub Secrets
echo ""
echo "🔐 Checking GitHub Secrets..."
SECRETS=$(gh secret list 2>/dev/null | grep -E "DATABASE_URL|JWT_SECRET|RAZORPAY" | wc -l)
if [ $SECRETS -ge 3 ]; then
    echo "✓ GitHub secrets configured ($SECRETS found)"
else
    echo "⚠️  GitHub secrets not fully configured"
fi

echo ""
echo "✅ Pre-deployment checks complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Read DEPLOY_NOW.md for step-by-step deployment guide"
echo "2. Deploy backend to Render"
echo "3. Deploy frontend to Vercel"
echo "4. Test the application"
echo "5. Rotate all credentials immediately after deployment"
echo ""
