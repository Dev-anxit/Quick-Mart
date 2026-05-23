#!/bin/bash

# QuickMart Deployment Validation Script
# Tests all deployment requirements and configurations

set -e

echo "🔍 QuickMart Deployment Validation"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TEST_PASSED=0
TEST_FAILED=0

# Test function
test_command() {
  local name=$1
  local command=$2

  echo -n "Testing: $name ... "

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    ((TEST_PASSED++))
  else
    echo -e "${RED}✗${NC}"
    ((TEST_FAILED++))
  fi
}

# Section 1: Backend Build
echo -e "${YELLOW}[1/4] Backend Verification${NC}"
test_command "Backend code exists" "[ -d backend ]"
test_command "Backend package.json" "[ -f backend/package.json ]"
test_command "Backend src/server.ts" "[ -f backend/src/server.ts ]"
test_command "Backend TypeScript compiles" "cd backend && npm run build > /dev/null 2>&1 && cd .."
echo ""

# Section 2: Frontend Build
echo -e "${YELLOW}[2/4] Frontend Verification${NC}"
test_command "Frontend code exists" "[ -d frontend ]"
test_command "Frontend package.json" "[ -f frontend/package.json ]"
test_command "Frontend src/App.tsx" "[ -f frontend/src/App.tsx ]"
test_command "Frontend TypeScript compiles" "cd frontend && npm run build > /dev/null 2>&1 && cd .."
echo ""

# Section 3: Configuration Files
echo -e "${YELLOW}[3/4] Deployment Configuration${NC}"
test_command "Render config exists" "[ -f render.yaml ]"
test_command "Frontend env example" "[ -f frontend/.env.example ]"
test_command "Backend env example" "[ -f backend/.env.example ]"
echo ""

# Section 4: Git & Repository
echo -e "${YELLOW}[4/4] Git & Repository${NC}"
test_command "Git repository" "git rev-parse --git-dir > /dev/null 2>&1"
test_command "Main branch" "[ $(git rev-parse --abbrev-ref HEAD) = 'main' ]"
test_command "GitHub remote configured" "git remote get-url origin | grep -q github.com"
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}Passed: $TEST_PASSED${NC}"
if [ $TEST_FAILED -gt 0 ]; then
  echo -e "${RED}Failed: $TEST_FAILED${NC}"
else
  echo -e "${RED}Failed: $TEST_FAILED${NC}"
fi
echo ""

if [ $TEST_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All validation tests passed!${NC}"
  echo ""
  echo "📋 Next Steps:"
  echo "1. Set up MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
  echo "2. Create Render account: https://render.com"
  echo "3. Deploy backend to Render"
  echo "4. Create Vercel account: https://vercel.com"
  echo "5. Deploy frontend to Vercel"
  echo ""
  echo "👉 Follow DEPLOY_SETUP.md for detailed instructions"
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please check your setup.${NC}"
  exit 1
fi
