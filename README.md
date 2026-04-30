# cineverse1
# 🎬 CineVerse - 3D Movie & Live TV Streaming Website

A creative 3D movie streaming website with Live TV, built with HTML/CSS/JavaScript + Node.js

## ✨ Features
- 🌟 3D Three.js particle background
- 🎭 3D card hover effects
- 🎬 Real movie data from TMDB API
- 📺 Live TV channels
- 🔍 Search functionality
- 📱 Fully responsive
- 🎥 Multiple video servers
- ⭐ Watchlist (localStorage)
- 💬 Comments system

## 🚀 Quick Start

### Step 1: Get Free TMDB API Key
1. Go to https://www.themoviedb.org
2. Sign up (free)
3. Go to Settings > API
4. Copy your API key

### Step 2: Setup
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/cineverse.git
cd cineverse/backend
npm install
\`\`\`

### Step 3: Add API Key
Edit \`js/config.js\` and replace:
\`\`\`javascript
TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE'
\`\`\`

Edit \`backend/.env\`:
\`\`\`
TMDB_API_KEY=your_actual_api_key
\`\`\`

### Step 4: Run Locally
\`\`\`bash
cd backend
npm start
\`\`\`
Open http://localhost:3000

## 🌐 Deploy FREE on Vercel (5 minutes!)

1. Go to https://vercel.com (sign up free)
2. Click "New Project"  
3. Import your GitHub repo
4. Add environment variable: TMDB_API_KEY = your key
5. Click Deploy!
6. Get your live URL like: https://cineverse-xyz.vercel.app

## 📦 Deploy to GitHub Pages (Frontend Only)

1. Push to GitHub
2. Go to Settings > Pages
3. Source: Deploy from branch "main"
4. Done! URL: https://username.github.io/cineverse
