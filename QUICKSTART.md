# Quick Start Guide

## ✅ Setup Complete!

Your tutorial video app is ready with **both versions**:

### 📍 What You Have

1. **Local MCP Server** - For ChatGPT native integration
2. **HTTP API Server** - Ready to deploy to Render

### 🎬 Your 4 Tutorial Videos

All videos tested and working ✓
- Introduction to Artificial Intelligence | Part 1
- Prompt Engineering - Introduction
- Prompt Engineering Part 1 - Key Components
- Testing Prompts on Google Gemini

---

## 🚀 Next Steps

### Want to use it LOCALLY with ChatGPT?

```bash
npm run start
```

Then configure in ChatGPT settings (see README.md).

---

### Want to DEPLOY to Render (free)?

**Step 1: Create GitHub repo**
```bash
git init
git add .
git commit -m "Initial commit"
```

Create repo at https://github.com/new, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Step 2: Deploy to Render**
1. Go to https://render.com
2. New + → Web Service
3. Connect your GitHub repo
4. Use these settings:
   - Build: `npm install && npm run build:web`
   - Start: `npm run dev:api`
   - Instance: Free

**Step 3: Create Custom GPT**
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

### Want to TEST the API locally first?

```bash
npm run start:api
```

Then visit:
- http://localhost:3000 - API info
- http://localhost:3000/api/videos - List videos
- http://localhost:3000/api/player/Xpg2bnO_-eU - Watch first video

---

## 📚 Documentation

- **README.md** - General overview and MCP setup
- **DEPLOYMENT.md** - Complete deployment guide with API details
- **test-videos.html** - Test if all video embeds work

---

## 🎯 Recommended Path

1. ✅ Test API locally: `npm run start:api`
2. ✅ Push to GitHub
3. ✅ Deploy to Render
4. ✅ Create Custom GPT with your deployed API
5. ✅ Share with others!

**Need help?** Check DEPLOYMENT.md for troubleshooting.
