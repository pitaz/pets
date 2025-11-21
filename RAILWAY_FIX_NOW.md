# 🚨 IMMEDIATE FIX for Railway Build Error

## The Problem

Railway is trying to start your app without building it first. The `dist/main.js` file doesn't exist because the build step isn't running.

## Quick Fix (2 minutes)

### Step 1: Go to Railway Dashboard

1. Open [railway.app](https://railway.app)
2. Go to your project
3. Click on your **backend service**

### Step 2: Set Build Command

1. Click the **Settings** tab
2. Scroll down to **"Build & Deploy"** section
3. Find **"Build Command"** field
4. Enter: `yarn install && yarn prisma generate && yarn build`
5. Find **"Start Command"** field
6. Enter: `yarn start:prod`
7. Click **Save** (top right)

### Step 3: Redeploy

- Railway will automatically trigger a new deployment
- Or manually click **"Redeploy"** in the Deployments tab

### Step 4: Verify

Check the deployment logs. You should now see:

1. ✅ `yarn install` running
2. ✅ `yarn prisma generate` running
3. ✅ `yarn build` running (creates `dist/main.js`)
4. ✅ `yarn start:prod` starting the app
5. ✅ Server running successfully

## Alternative: Use Combined Start Command

If setting Build Command doesn't work:

1. In Railway Settings → Build & Deploy
2. Leave **Build Command** empty
3. Set **Start Command** to: `yarn start`
4. Save and redeploy

This uses the new `yarn start` script that builds first, then starts.

## Why This Happens

Railway's auto-detection sometimes misses the build step for NestJS apps. Setting it explicitly ensures the build always runs.

## After Fixing

Once it's working, you can:

- Run migrations: `railway run yarn prisma migrate deploy`
- Seed database: `railway run yarn prisma:seed`
- Check health: Visit `https://your-app.up.railway.app/api/health`
