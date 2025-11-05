#!/bin/bash

# Deployment script for rideokinawa project

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run: git init"
    exit 1
fi

# Check if we have commits
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "❌ No commits found. Please commit your changes first."
    exit 1
fi

echo "✅ Git repository is ready"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: rideokinawa"
echo "   - Choose Public or Private"
echo "   - DO NOT initialize with README/.gitignore"
echo "   - Click 'Create repository'"
echo ""
echo "2. After creating the repo, run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/rideokinawa.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   Option A: Via Dashboard (recommended)"
echo "   - Go to https://vercel.com"
echo "   - Sign in with GitHub"
echo "   - Click 'Add New Project'"
echo "   - Import your rideokinawa repository"
echo ""
echo "   Option B: Via CLI"
echo "   npx vercel login"
echo "   npx vercel --prod"
echo ""

