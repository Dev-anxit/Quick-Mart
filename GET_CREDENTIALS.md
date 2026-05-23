# 🔑 Getting Your Deployment Credentials

This guide shows you where to get each credential needed for automated deployment.

## 1. MongoDB Atlas Connection String

**Steps:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click **Build a Database** → Choose **Free (M0)**
4. Wait for cluster to be created
5. Click **Connect** → **Drivers** → **NodeJS**
6. Copy the connection string (looks like: `mongodb+srv://user:pass@cluster.xxx.mongodb.net/dbname?retryWrites=true&w=majority`)
7. Replace `<password>` with your database user password

**Example:**
```
mongodb+srv://quickmart_user:MyPassword123@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 2. GitHub Personal Access Token

**Steps:**
1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in:
   - Token name: `QuickMart Deployment`
   - Expiration: `90 days`
   - Scopes: Check `repo` (full control) and `read:user`
4. Click **Generate token**
5. Copy the token (you'll only see it once!)

**Example:**
```
ghp_abcd1234efgh5678ijkl9012mnop3456qrst
```

---

## 3. Render API Token

**Steps:**
1. Go to https://dashboard.render.com/account/api-tokens
2. Click **Create API Token**
3. Name: `QuickMart Deployment`
4. Click **Create**
5. Copy the token

**Example:**
```
rnd_abcd1234efgh5678ijkl9012mnopqrst
```

---

## 4. Vercel Token

**Steps:**
1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Token name: `QuickMart Deployment`
4. Scope: Personal Account
5. Click **Create**
6. Copy the token

**Example:**
```
ver_abcd1234efgh5678ijkl9012mnopqrst
```

---

## Using the Deployment Script

Once you have all 4 tokens, run:

```bash
cd /Users/ankityadav/Quick-Mart
chmod +x deploy-auto.sh
./deploy-auto.sh
```

Then paste each token when prompted.

---

## ⚠️ Security Notes

- **Never commit tokens** to git
- **Never share tokens** publicly
- Tokens are stored in memory only during script execution
- You can revoke tokens anytime from their respective dashboards

---

## 🆘 Troubleshooting

**"curl: command not found"**
- macOS: Already has curl, might need Command Line Tools: `xcode-select --install`

**"openssl: command not found"**
- macOS: Already installed, check with `which openssl`

**API calls failing**
- Verify tokens are correct (no extra spaces)
- Check internet connection
- Try manually creating services on dashboards first

**Still stuck?**
- Review DEPLOY_NOW.md for manual deployment steps
