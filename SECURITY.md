# 🔒 Security Guide - Protecting Sensitive Data

## ⚠️ CRITICAL: Never Commit Sensitive Data

This document outlines best practices for keeping your Quick-Mart application secure.

---

## 🛡️ What NOT to Commit to GitHub

❌ **NEVER commit these files:**
- `.env` files with real credentials
- `.env.production` with actual keys
- `firebase-service-account.json`
- `secrets.json` or any secret files
- API keys, tokens, or passwords
- Database connection strings
- Private keys or certificates

✅ **Safe to commit:**
- `.env.example` (template with placeholder values)
- Code files (*.ts, *.tsx, *.js)
- Configuration files without secrets
- Documentation and guides

---

## 📋 Project Security Status

### ✅ What We've Done
- `.env` files are in `.gitignore` - safe!
- `.env.example` files provided as templates
- No hardcoded secrets in source code
- Database URLs not exposed in repo
- API keys not in documentation

### ✅ Current Protection
- All sensitive environment variables use placeholders
- Documentation shows examples with "YOUR_" prefix
- Deployment guides use placeholder values
- No actual credentials in git history

---

## 🚀 Deployment Security Checklist

### Before Deploying to Render/Vercel:

#### ✅ Backend Environment Variables (Render)
```
NODE_ENV=production          ← Set to production
DATABASE_URL=postgresql://...  ← Real Supabase URL
JWT_SECRET=xxx              ← Strong random secret
RAZORPAY_KEY_ID=xxx         ← Live API key
RAZORPAY_KEY_SECRET=xxx     ← Live secret key
FRONTEND_URL=https://...    ← Your Vercel URL
```

#### ✅ Frontend Environment Variables (Vercel)
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api  ← Backend URL
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx                      ← Live key
```

#### ✅ GitHub Secrets (for auto-deployment)
```
RENDER_SERVICE_ID=xxx       ← For Render auto-deploy
RENDER_API_KEY=xxx          ← For Render auto-deploy
VERCEL_TOKEN=xxx            ← For Vercel auto-deploy
VERCEL_PROJECT_ID=xxx       ← For Vercel auto-deploy
VERCEL_ORG_ID=xxx           ← For Vercel auto-deploy
```

---

## 📖 How to Properly Set Environment Variables

### Local Development

1. **Copy the example file:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Fill in your actual values:**
   ```bash
   # Edit backend/.env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
   JWT_SECRET=your-unique-secret-key-here
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

3. **Verify .gitignore has .env:**
   ```bash
   cat .gitignore | grep "\.env"
   ```

### Production Deployment

**NEVER put secrets in .env files for production!**

Instead, use the deployment platform's secret management:

#### For Render Backend:
1. Go to Service Dashboard
2. Settings → Environment Variables
3. Add each variable:
   - `NODE_ENV=production`
   - `DATABASE_URL=your-real-db-url`
   - etc.

#### For Vercel Frontend:
1. Go to Project Settings
2. Environment Variables
3. Add each variable:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
   - etc.

#### For GitHub Secrets:
1. Go to Repository Settings
2. Secrets and variables → Actions
3. Create new secrets for auto-deployment

---

## 🔐 Security Best Practices

### 1. Strong Secrets
```javascript
// ❌ BAD
JWT_SECRET=secret123

// ✅ GOOD
JWT_SECRET=aB7$kL9!mN2@xQ5%pZ8&vW3^cR6*tY1!uI4$jF0&lK9@nM3$oP6%

// Generate with:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. API Key Rotation
- Regularly rotate API keys
- Use separate keys for development and production
- Never share keys via email or chat
- Delete old keys when switching

### 3. Access Control
- Only developers need access to secrets
- Use service accounts with limited permissions
- Enable 2FA on all platforms
- Review access regularly

### 4. Monitoring
- Enable audit logs on Render and Vercel
- Watch for unauthorized deployments
- Monitor API usage
- Set up email alerts

---

## 🚨 If You Accidentally Exposed Secrets

### Immediate Actions:

1. **Rotate all exposed credentials:**
   ```bash
   # Create new secrets in Render/Vercel
   # Update in all environments
   ```

2. **Check git history:**
   ```bash
   # See if secrets were committed
   git log --all -p --grep="SECRET\|PASSWORD\|KEY"
   ```

3. **Revoke exposed keys:**
   - Razorpay dashboard
   - Supabase dashboard
   - Firebase console

4. **Notify your team:**
   - Inform all developers
   - Update security practices

### If Secrets Were in Git History:

```bash
# Using git-filter-branch (advanced)
# Consult git documentation before using

# Alternative: Create fresh clone from main
git clone https://github.com/Dev-anxit/Quick-Mart.git fresh-clone
```

---

## 🔍 Verification Checklist

Run these commands to verify security:

```bash
# Check if .env is ignored
git check-ignore -v backend/.env

# Search for common secret patterns
grep -r "password=" . --include="*.ts" --include="*.tsx"
grep -r "key=" . --include="*.ts" --include="*.tsx"
grep -r "secret=" . --include="*.ts" --include="*.tsx"

# Look for hardcoded URLs
grep -r "postgresql://" . --exclude-dir=node_modules

# Verify .env.example doesn't have real values
grep -r "rzp_live_" . --exclude-dir=node_modules
```

---

## 📱 Environment Variables by Platform

### Supabase
- **Type**: Database credentials
- **Protection**: Keep DATABASE_URL private
- **Rotation**: Change password regularly
- **Where to store**: Render environment variables

### Razorpay
- **Type**: Payment API keys
- **Protection**: Different keys for test/live
- **Rotation**: Available in dashboard
- **Where to store**: Both Render and Vercel

### Firebase
- **Type**: Authentication service
- **Protection**: Public keys can be in client code
- **Rotation**: Not needed for public keys
- **Private keys**: Store in Render only

### GitHub Secrets
- **Type**: Deployment credentials
- **Protection**: Encrypted, only visible to actions
- **Rotation**: Update periodically
- **Where to store**: GitHub repository settings

---

## 🎓 References

- [GitHub Secret Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Render Security](https://render.com/docs/environment-variables)
- [Supabase Auth Best Practices](https://supabase.com/docs/guides/auth/security)
- [OWASP Security Practices](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## ✅ You're Secure If:

- ✅ No `.env` files in git
- ✅ `.env.example` uses placeholders only
- ✅ No hardcoded secrets in code
- ✅ Secrets in platform environment variables
- ✅ GitHub Actions uses encrypted secrets
- ✅ Regular key rotation policy
- ✅ Team trained on security practices

---

**Questions?** Review deployment guides or consult the security documentation above.
