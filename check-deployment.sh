#!/bin/bash

# QuickMart Deployment Helper
# This script validates your setup before deployment

set -e

echo "🚀 QuickMart Deployment Checker"
echo "=================================="
echo ""

# Check 1: Verify code is in GitHub
echo "✓ Checking GitHub connection..."
if git remote -v | grep -q "github.com"; then
    echo "✓ GitHub remote found"
    echo "  Repository: $(git config --get remote.origin.url)"
else
    echo "✗ GitHub remote not found. Please initialize git."
    exit 1
fi

# Check 2: Verify latest code is pushed
echo ""
echo "✓ Checking if code is pushed..."
if git diff --quiet origin/main; then
    echo "✓ All code is pushed to GitHub"
else
    echo "✗ You have unpushed commits. Run: git push origin main"
    exit 1
fi

# Check 3: Verify backend builds
echo ""
echo "✓ Building backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    echo "✓ Backend builds successfully"
else
    echo "✗ Backend build failed. Check errors above."
    exit 1
fi
cd ..

# Check 4: Verify environment files exist
echo ""
echo "✓ Checking configuration files..."
if [ -f "backend/Procfile" ]; then
    echo "✓ Procfile found"
else
    echo "✗ Procfile not found"
    exit 1
fi

if [ -f "render.yaml" ]; then
    echo "✓ render.yaml found"
else
    echo "✗ render.yaml not found"
    exit 1
fi

# All checks passed
echo ""
echo "✅ Everything is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Create MongoDB Atlas free cluster"
echo "   → https://www.mongodb.com/cloud/atlas"
echo ""
echo "2. Deploy to Render"
echo "   → https://render.com → Sign up with GitHub"
echo "   → Create new Web Service from Dev-anxit/Quick-Mart"
echo "   → Set environment variables (see DEPLOY_NOW.md)"
echo ""
echo "3. Deploy to Vercel"
echo "   → https://vercel.com → Sign up with GitHub"
echo "   → Add new project from Dev-anxit/Quick-Mart"
echo "   → Set VITE_API_BASE_URL and VITE_SOCKET_URL"
echo ""
echo "📖 For detailed instructions, see: DEPLOY_NOW.md"
echo ""

exit 0
