# Deployment Instructions

## GitHub Repository Setup

Since GitHub CLI is not available, please follow these steps:

1. Go to https://github.com/new
2. Create a new repository named `rideokinawa`
3. Choose Public or Private
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

Then run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/rideokinawa.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Vercel Deployment

The project is ready to deploy to Vercel. Run:

```bash
npx vercel
```

Or deploy via the Vercel dashboard:
1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will automatically detect Next.js and deploy

