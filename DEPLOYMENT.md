# Deployment Guide

This guide will help you deploy the Legal Pets app to production.

## Frontend Deployment (Vercel)

### Prerequisites

- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push your code to GitHub** (if not already done):

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Next.js
     - **Build Command**: `yarn build` (or leave default)
     - **Output Directory**: `.next` (or leave default)
     - **Install Command**: `yarn install` (or leave default)

3. **Set Environment Variables** in Vercel:

   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`
   - Add any other environment variables your frontend needs

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend
   - You'll get a URL like `https://your-app.vercel.app`

## Backend Deployment Options (Free Tier)

### Option 1: Railway (Recommended - Easiest)

**Why Railway:**

- Free $5 credit per month (usually enough for small apps)
- Easy PostgreSQL database setup
- Simple deployment process
- Auto-deploys from GitHub

**Steps:**

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub

2. **Create a new project**:

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**:

   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create a `DATABASE_URL` environment variable

4. **Configure the Backend Service**:

   - Click "New" → "GitHub Repo" → Select your repo
   - Set **Root Directory**: `backend`
   - Railway will auto-detect Node.js

5. **Set Environment Variables**:

   - Go to your backend service → Variables
   - Add:
     ```
     DATABASE_URL=<automatically set from PostgreSQL>
     PORT=3001
     FRONTEND_URL=https://your-frontend.vercel.app
     JWT_SECRET=your-secret-key-here
     JWT_REFRESH_SECRET=your-refresh-secret-here
     NODE_ENV=production
     ```

6. **Run Database Migrations**:

   - Go to your backend service → Deployments
   - Click on the latest deployment → View Logs
   - Or use Railway CLI:
     ```bash
     railway run yarn prisma migrate deploy
     railway run yarn prisma:seed
     ```

7. **Get your backend URL**:
   - Railway will provide a URL like `https://your-app.up.railway.app`
   - Update your Vercel `NEXT_PUBLIC_API_URL` to this URL + `/api`

### Option 2: Render

**Why Render:**

- Free tier available (with limitations)
- Easy PostgreSQL setup
- Auto-deploy from GitHub

**Limitations:**

- Free tier services spin down after 15 minutes of inactivity
- Slower cold starts

**Steps:**

1. **Sign up**: Go to [render.com](https://render.com) and sign up

2. **Create PostgreSQL Database**:

   - Click "New" → "PostgreSQL"
   - Name it (e.g., "legal-pets-db")
   - Copy the Internal Database URL

3. **Create Web Service**:

   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: legal-pets-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `yarn install && yarn prisma:generate && yarn build`
     - **Start Command**: `yarn start:prod`

4. **Set Environment Variables**:

   ```
   DATABASE_URL=<from PostgreSQL database>
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   NODE_ENV=production
   ```

5. **Deploy**:

   - Click "Create Web Service"
   - Render will build and deploy
   - Get your URL (e.g., `https://legal-pets-backend.onrender.com`)

6. **Run Migrations**:
   - Use Render Shell or SSH:
     ```bash
     yarn prisma migrate deploy
     yarn prisma:seed
     ```

### Option 3: Fly.io

**Why Fly.io:**

- Generous free tier
- Good performance
- Global edge network

**Steps:**

1. **Install Fly CLI**:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up**: `fly auth signup`

3. **Create app**:

   ```bash
   cd backend
   fly launch
   ```

4. **Add PostgreSQL**:

   ```bash
   fly postgres create
   fly postgres attach <postgres-app-name>
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

## Post-Deployment Checklist

### Backend

- [ ] Database migrations run successfully
- [ ] Database seeded with initial data
- [ ] Environment variables set correctly
- [ ] CORS configured to allow frontend domain
- [ ] Health check endpoint working (`/api/health` - you may need to add this)

### Frontend

- [ ] `NEXT_PUBLIC_API_URL` points to your backend
- [ ] Images loading correctly
- [ ] API calls working
- [ ] Authentication working

### Security

- [ ] Strong JWT secrets set
- [ ] CORS properly configured
- [ ] Environment variables not exposed in frontend
- [ ] HTTPS enabled (automatic on Vercel/Railway/Render)

## Adding a Health Check Endpoint

Create `backend/src/health/health.controller.ts`:

```typescript
import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
```

Then add to `app.module.ts`:

```typescript
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
  // ... rest of module
})
```

## Troubleshooting

### Backend won't start

- Check logs in your hosting platform
- Verify all environment variables are set
- Ensure database is accessible
- Check PORT is set correctly

### Database connection errors

- Verify DATABASE_URL is correct
- Check if database is accessible from your hosting platform
- Ensure migrations have run

### CORS errors

- Verify FRONTEND_URL matches your actual frontend URL
- Check CORS configuration in `main.ts`

### Frontend can't reach backend

- Verify NEXT_PUBLIC_API_URL is set correctly
- Check backend is running and accessible
- Verify CORS allows your frontend domain

## Recommended Setup

**For Production:**

- Frontend: Vercel (free tier)
- Backend: Railway (free $5/month credit)
- Database: Railway PostgreSQL (included)
- Total Cost: **$0/month**

This setup gives you:

- Fast, global CDN for frontend
- Reliable backend hosting
- Managed PostgreSQL database
- Automatic deployments from GitHub
- HTTPS/SSL certificates
- Custom domains support
