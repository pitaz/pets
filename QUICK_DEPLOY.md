# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (Recommended)

### Frontend → Vercel (5 minutes)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - **Root Directory**: `frontend`
   - Click "Deploy"
   - **Don't set environment variables yet** (we'll do that after backend is deployed)

### Backend → Railway (10 minutes)

1. **Sign up**: [railway.app](https://railway.app) (use GitHub login)

2. **Create Project**:

   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL**:

   - Click "New" → "Database" → "PostgreSQL"
   - Wait for it to provision (takes ~1 minute)

4. **Deploy Backend**:

   - Click "New" → "GitHub Repo" → Select your repo
   - Railway auto-detects it's Node.js
   - **Set Root Directory**: `backend`
   - **Important**: Make sure the build completes successfully
   - Check the build logs to ensure `yarn build` runs and creates `dist/main.js`
   - Railway will start building automatically

5. **Set Environment Variables** (in your backend service):

   ```
   PORT=3001
   FRONTEND_URL=https://your-frontend.vercel.app
   JWT_SECRET=generate-a-random-string-here
   JWT_REFRESH_SECRET=generate-another-random-string-here
   NODE_ENV=production
   ```

   (DATABASE_URL is automatically set by Railway)

6. **Run Migrations**:

   - Go to your backend service → "Deployments" tab
   - Click the three dots on latest deployment → "View Logs"
   - Or use Railway CLI:
     ```bash
     railway login
     railway link
     railway run yarn prisma migrate deploy
     railway run yarn prisma:seed
     ```

7. **Get Backend URL**:

   - Railway gives you a URL like: `https://your-app.up.railway.app`
   - Your API will be at: `https://your-app.up.railway.app/api`

8. **Update Frontend**:
   - Go back to Vercel → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-app.up.railway.app/api`
   - Redeploy (Vercel will auto-redeploy or click "Redeploy")

## ✅ That's it! Your app is live!

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.up.railway.app/api`
- Health Check: `https://your-app.up.railway.app/api/health`

## 🔧 Alternative: Render (Free but slower)

If Railway doesn't work for you:

1. Go to [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service (point to `backend` folder)
4. Set environment variables
5. Deploy

See `DEPLOYMENT.md` for detailed Render instructions.

## 💰 Cost

**Total: $0/month** (both services have free tiers)

- Vercel: Free forever for personal projects
- Railway: $5 free credit/month (usually enough for small apps)
