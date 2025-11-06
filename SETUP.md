# Setup & Deployment Guide

## ✅ Completed
- Git repository initialized
- All files committed locally

## 📝 Next Steps

### 1. Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `rideokinawa`
3. Choose Public or Private
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

**Option B: Via GitHub CLI (if installed)**
```bash
gh repo create rideokinawa --public --source=. --remote=origin --push
```

### 2. Push to GitHub

After creating the repository, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/rideokinawa.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
# Login to Vercel
npx vercel login

# Deploy
npx vercel

# For production deployment
npx vercel --prod
```

**Option B: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `rideokinawa` repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

**Option C: One-Click Deploy**
After pushing to GitHub, visit:
https://vercel.com/new

Vercel will automatically:
- Detect your Next.js project
- Configure build settings
- Deploy your site

## 🎯 Features Ready for Deployment

- ✅ Landing page with tour overview
- ✅ Daily itinerary with day types (arrival, ride, free & easy, departure)
- ✅ Flight information for arrival/departure days
- ✅ Weather forecast integration (Open-Meteo API)
- ✅ Packing recommendations
- ✅ Important notes section
- ✅ Admin panel for content management
- ✅ Mobile-responsive design
- ✅ API route for saving tour data

## 📝 Notes

- The admin panel saves to localStorage by default
- For production, the API route (`/api/tour-data`) will save to the JSON file
- Consider adding authentication for the admin panel in production
- All tour data is stored in `data/tour-data.json`

## 🔗 After Deployment

Your site will be available at:
- `https://rideokinawa.vercel.app` (or your custom domain)

The admin panel will be accessible at:
- `https://your-domain.vercel.app/admin`




