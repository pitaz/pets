# Railway Deployment Troubleshooting

## Error: Cannot find module '/app/dist/main'

This error means the build step didn't run or failed. Here's how to fix it:

### Solution 1: Check Build Logs

1. Go to your Railway project
2. Click on your backend service
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Check the build logs - you should see:
   - `yarn install` running
   - `yarn prisma generate` running
   - `yarn build` running
   - `dist/main.js` being created

### Solution 2: Manual Build Command

If Railway isn't running the build automatically:

1. Go to your backend service → Settings
2. Under "Build & Deploy", check "Build Command"
3. Set it to: `yarn install && yarn prisma generate && yarn build`
4. Set "Start Command" to: `yarn start:prod`
5. Redeploy

### Solution 3: Use Railway CLI

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Run build manually:
   ```bash
   cd backend
   railway run yarn install
   railway run yarn prisma generate
   railway run yarn build
   ```
5. Then deploy: `railway up`

### Solution 4: Check nixpacks.toml

The `nixpacks.toml` file should be in the `backend` directory. Railway should automatically use it. If not:

1. Make sure the file is committed to git
2. Make sure Railway is pointing to the `backend` directory
3. Try redeploying

### Solution 5: Verify Build Output

After a successful build, you should see in the logs:

- `dist/main.js` file created
- No build errors
- Build completes successfully

If you see build errors, fix them and redeploy.

### Common Issues

**Issue**: Prisma generate fails

- **Fix**: Make sure `DATABASE_URL` is set (even if database isn't ready, Prisma needs it for generate)

**Issue**: TypeScript compilation errors

- **Fix**: Fix TypeScript errors locally first, then redeploy

**Issue**: Build succeeds but dist/main.js missing

- **Fix**: Check `nest-cli.json` - make sure `deleteOutDir` is not causing issues
- **Fix**: Check if build is actually running (look for "nest build" in logs)

### Quick Fix

If nothing works, try this in Railway:

1. Go to Settings → Build & Deploy
2. Set Build Command: `yarn install && yarn prisma generate && yarn build`
3. Set Start Command: `yarn start:prod`
4. Save and redeploy
