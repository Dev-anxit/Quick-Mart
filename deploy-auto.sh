#!/bin/bash

# QuickMart - One-Click Deployment Script
# This script automates the entire deployment process

set -e

echo "🚀 QuickMart - One-Click Deployment"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check required tools
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}✗ Git is not installed${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ npm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies found${NC}"
}

# Get user inputs
get_credentials() {
    echo ""
    echo "📝 Please provide your deployment credentials"
    echo "(These are kept local and only used for this script)"
    echo ""
    
    # MongoDB Atlas
    read -p "🍃 MongoDB Atlas Connection String: " MONGODB_URI
    if [ -z "$MONGODB_URI" ]; then
        echo -e "${RED}✗ MongoDB URI is required${NC}"
        exit 1
    fi
    
    # JWT Secret
    read -p "🔐 JWT Secret (or press Enter for auto-generated): " JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -base64 32)
        echo -e "${GREEN}Generated JWT_SECRET: $JWT_SECRET${NC}"
    fi
    
    # Render API Token
    read -p "🎨 Render API Token (from https://dashboard.render.com/account/api-tokens): " RENDER_API_TOKEN
    if [ -z "$RENDER_API_TOKEN" ]; then
        echo -e "${RED}✗ Render API Token is required${NC}"
        echo "Get it from: https://dashboard.render.com/account/api-tokens"
        exit 1
    fi
    
    # GitHub Token (for Render to access repo)
    read -p "🔑 GitHub Personal Access Token (for Render to access your repo): " GITHUB_TOKEN
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${RED}✗ GitHub Token is required${NC}"
        echo "Create one at: https://github.com/settings/tokens"
        exit 1
    fi
    
    # Vercel Token
    read -p "⚡ Vercel Token (from https://vercel.com/account/tokens): " VERCEL_TOKEN
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${RED}✗ Vercel Token is required${NC}"
        exit 1
    fi
}

# Deploy to Render
deploy_render() {
    echo ""
    echo "🎨 Deploying backend to Render..."
    
    # Create service using Render API
    SERVICE_RESPONSE=$(curl -s -X POST https://api.render.com/v1/services \
        -H "Authorization: Bearer $RENDER_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "type": "web",
            "name": "quickmart-backend",
            "ownerId": "tea_'$(date +%s)'",
            "repo": "https://github.com/Dev-anxit/Quick-Mart.git",
            "branch": "main",
            "rootDir": "backend",
            "buildCommand": "npm install && npm run build",
            "startCommand": "npm start",
            "envVars": [
                {
                    "key": "NODE_ENV",
                    "value": "production"
                },
                {
                    "key": "MONGODB_URI",
                    "value": "'$MONGODB_URI'"
                },
                {
                    "key": "JWT_SECRET",
                    "value": "'$JWT_SECRET'"
                },
                {
                    "key": "FRONTEND_URL",
                    "value": "https://quickmart.vercel.app"
                }
            ],
            "autoDeploy": true
        }')
    
    RENDER_SERVICE_ID=$(echo $SERVICE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$RENDER_SERVICE_ID" ]; then
        echo -e "${RED}✗ Failed to create Render service${NC}"
        echo "Response: $SERVICE_RESPONSE"
        exit 1
    fi
    
    BACKEND_URL="https://quickmart-backend.onrender.com"
    echo -e "${GREEN}✓ Backend deployed to Render${NC}"
    echo -e "${YELLOW}  Service ID: $RENDER_SERVICE_ID${NC}"
    echo -e "${YELLOW}  URL: $BACKEND_URL${NC}"
}

# Deploy to Vercel
deploy_vercel() {
    echo ""
    echo "⚡ Deploying frontend to Vercel..."
    
    # Create project on Vercel
    VERCEL_RESPONSE=$(curl -s -X POST https://api.vercel.com/v9/projects \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "quickmart",
            "gitRepository": {
                "type": "github",
                "repo": "Dev-anxit/Quick-Mart"
            },
            "rootDirectory": "frontend",
            "framework": "vite",
            "buildCommand": "npm run build",
            "outputDirectory": "dist",
            "installCommand": "npm install",
            "env": [
                {
                    "key": "VITE_API_BASE_URL",
                    "value": "https://quickmart-backend.onrender.com/api"
                },
                {
                    "key": "VITE_SOCKET_URL",
                    "value": "https://quickmart-backend.onrender.com"
                }
            ]
        }')
    
    VERCEL_PROJECT_ID=$(echo $VERCEL_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$VERCEL_PROJECT_ID" ]; then
        echo -e "${RED}✗ Failed to create Vercel project${NC}"
        echo "Response: $VERCEL_RESPONSE"
        exit 1
    fi
    
    FRONTEND_URL="https://quickmart.vercel.app"
    echo -e "${GREEN}✓ Frontend deployed to Vercel${NC}"
    echo -e "${YELLOW}  Project ID: $VERCEL_PROJECT_ID${NC}"
    echo -e "${YELLOW}  URL: $FRONTEND_URL${NC}"
}

# Summary
show_summary() {
    echo ""
    echo "=================================================="
    echo -e "${GREEN}✅ Deployment Complete!${NC}"
    echo "=================================================="
    echo ""
    echo "📊 Your Services:"
    echo ""
    echo -e "${GREEN}Backend API${NC}"
    echo "  URL: https://quickmart-backend.onrender.com/api"
    echo "  Status: Deploying (check Render dashboard)"
    echo ""
    echo -e "${GREEN}Frontend App${NC}"
    echo "  URL: https://quickmart.vercel.app"
    echo "  Status: Deploying (check Vercel dashboard)"
    echo ""
    echo -e "${GREEN}Database${NC}"
    echo "  MongoDB Atlas (Free Tier)"
    echo ""
    echo "=================================================="
    echo ""
    echo "🧪 Testing:"
    echo "1. Wait 2-5 minutes for both services to build and deploy"
    echo "2. Open: https://quickmart.vercel.app"
    echo "3. Test OTP login with any phone number"
    echo ""
    echo "📖 Dashboards:"
    echo "  Render: https://dashboard.render.com"
    echo "  Vercel: https://vercel.com/dashboard"
    echo ""
}

# Main execution
main() {
    check_dependencies
    get_credentials
    deploy_render
    deploy_vercel
    show_summary
}

main
