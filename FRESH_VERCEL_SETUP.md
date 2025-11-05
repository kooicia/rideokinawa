# Fresh Vercel Setup - Step by Step

## Step 1: Delete Current Project (Optional but Recommended)

1. Go to https://vercel.com/dashboard
2. Click on the `rideokinawa` project
3. Go to **Settings** → Scroll to the bottom
4. Click **Delete Project**
5. Confirm deletion

## Step 2: Import from GitHub

1. In your Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. You should see your repositories listed. Select **`kooicia/rideokinawa`**
   - If you don't see it, click **"Adjust GitHub App Permissions"** and grant access
4. Click **"Import"** on the repository

## Step 3: Configure Project Settings (CRITICAL!)

When the import page loads, configure these settings:

### Framework Preset
- Should auto-detect as **Next.js**
- If not, select **Next.js** from the dropdown

### Root Directory
- Leave as **`./`** (default) or empty

### Build and Output Settings
- **Build Command:** Leave empty (Vercel auto-detects `npm run build` for Next.js)
- **Output Directory:** ⚠️ **LEAVE EMPTY** - This is critical! Do NOT set it to `.next` or anything else
- **Install Command:** Leave empty (defaults to `npm install`)

### Environment Variables
- None needed for this project

### Project Name
- Should be `rideokinawa` (or whatever you prefer)

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (1-3 minutes)
3. Watch the build logs - they should show:
   - ✅ Cloning repository
   - ✅ Installing dependencies
   - ✅ Running build
   - ✅ Build completed successfully

## Step 5: Verify Deployment

1. Once deployment shows **"Ready"**, click on it
2. You'll see your deployment URL (e.g., `https://rideokinawa-xxxxx.vercel.app`)
3. Click the URL or visit it in your browser
4. Your site should now be working! 🎉

## If You Still See 404

1. Check the build logs for any errors
2. Verify in Settings → General that:
   - Output Directory is **empty**
   - Framework is set to **Next.js**
3. Try redeploying from the Deployments tab

## Your Repository Info

- **GitHub:** https://github.com/kooicia/rideokinawa
- **Branch:** main
- **Latest Commit:** Should be the latest one (check in GitHub)

