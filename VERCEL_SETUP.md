# Vercel Deployment Setup

## Important: Environment Variables

Before deploying to Vercel, you need to set the `NEXT_PUBLIC_API_URL` environment variable.

### Steps:

1. **Deploy your backend first** (Railway, Render, etc.)

   - Get your backend URL (e.g., `https://your-app.up.railway.app`)
   - Your API will be at: `https://your-app.up.railway.app/api`

2. **Set Environment Variable in Vercel**:

   - Go to your Vercel project
   - Settings → Environment Variables
   - Add:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-backend-url.com/api` (your actual backend URL + `/api`)
     - **Environment**: Production, Preview, Development (select all)

3. **Redeploy**:
   - After setting the environment variable, Vercel will automatically trigger a new deployment
   - Or manually click "Redeploy" in the Deployments tab

## Build Errors

If you see build errors about `ECONNREFUSED` to `localhost:3001`:

- This happens when `NEXT_PUBLIC_API_URL` is not set
- The app will still build successfully (errors are handled gracefully)
- But you must set the environment variable for the app to work properly

## Temporary Workaround

If you need to deploy before your backend is ready:

1. Set `NEXT_PUBLIC_API_URL` to a placeholder (e.g., `https://placeholder.com/api`)
2. The build will succeed
3. Update it to your real backend URL once ready
4. Redeploy

The app is designed to handle API errors gracefully, so it will still render even if the API is unavailable.
