# Deployment Guide - Tutorial Video API

This guide covers deploying the HTTP API version to Render (free tier) and using it with ChatGPT.

---

## 🚀 Quick Overview

You now have **TWO versions**:

1. **Local MCP Server** (`server/index.js`) - For ChatGPT MCP integration (local only)
2. **HTTP API Server** (`api/server.js`) - For remote deployment to Render

---

## Part 1: Deploy HTTP API to Render

### Step 1: Install New Dependencies

```bash
npm install
```

This will install `express` and `cors` needed for the HTTP API.

### Step 2: Test API Locally (Optional)

```bash
npm run start:api
```

Visit in browser:
- `http://localhost:3000` - API info
- `http://localhost:3000/api/videos` - List all videos
- `http://localhost:3000/api/player/Xpg2bnO_-eU` - Watch first video

### Step 3: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Tutorial Video API with MCP and HTTP support"

# Create a new repository on GitHub (https://github.com/new)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Render

1. **Sign up for Render** (free): https://render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository

3. **Configure Service**:
   - **Name**: `tutorial-video-api` (or any name)
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build:web`
   - **Start Command**: `npm run dev:api`
   - **Instance Type**: `Free`

4. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - You'll get a URL like: `https://tutorial-video-api.onrender.com`

---

## Part 2: Using Your Deployed API

### API Endpoints

Once deployed, your API will be available at:

**Base URL**: `https://YOUR-APP-NAME.onrender.com`

#### 1. Get API Info
```
GET /
```

#### 2. List All Videos
```
GET /api/videos
```

**Response**:
```json
{
  "success": true,
  "count": 4,
  "videos": [...]
}
```

#### 3. Get Specific Video
```
GET /api/videos/:id
```

Example: `GET /api/videos/Xpg2bnO_-eU`

#### 4. Get Embed Code
```
GET /api/embed/:id
```

Returns YouTube embed code for the video.

#### 5. View Video Player
```
GET /api/player/:id
```

Opens a full page with the video player.

---

## Part 3: Using with ChatGPT

### Option A: Use Custom GPT (Recommended)

1. **Create a Custom GPT**:
   - Go to ChatGPT → Explore GPTs → Create
   - Name: "Tutorial Video Assistant"
   - Description: "Shows tutorial videos about AI and Prompt Engineering"

2. **Add Actions**:
   - Click "Configure" → "Actions" → "Create new action"
   - Import this OpenAPI schema:

```yaml
openapi: 3.0.0
info:
  title: Tutorial Video API
  version: 1.0.0
servers:
  - url: https://YOUR-APP-NAME.onrender.com
paths:
  /api/videos:
    get:
      summary: List all tutorial videos
      operationId: listVideos
      responses:
        '200':
          description: Success
  /api/videos/{id}:
    get:
      summary: Get video details
      operationId: getVideo
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
  /api/player/{id}:
    get:
      summary: Get video player URL
      operationId: getPlayer
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
```

3. **Instructions for the GPT**:
```
You are a tutorial video assistant. You help users find and watch tutorial videos about AI and Prompt Engineering.

When users ask about tutorials, use listVideos to show available videos.
When they want to watch a video, provide the player URL using getPlayer.

Available videos:
1. Introduction to Artificial Intelligence
2. Prompt Engineering Introduction
3. Prompt Engineering - Key Components
4. Testing Prompts on Google Gemini
```

4. **Test it**:
   - "Show me available tutorials"
   - "I want to watch the AI introduction video"

### Option B: Direct API Calls

Share your API URL with others who can:
- View videos: `https://YOUR-APP.onrender.com/api/player/VIDEO_ID`
- Get video list: `https://YOUR-APP.onrender.com/api/videos`

---

## Part 4: Local MCP Server (For Advanced Use)

The local MCP server remains available for native ChatGPT integration:

### Configure MCP in ChatGPT Desktop

1. **Start local server**:
```bash
npm run start
```

2. **Add to ChatGPT** (if supported):
```json
{
  "mcpServers": {
    "tutorial-videos": {
      "command": "node",
      "args": ["C:/Users/igour/Downloads/test/server/index.js"]
    }
  }
}
```

---

## 🎯 Summary

### Local MCP Version
- **Use for**: Native ChatGPT MCP integration
- **Run**: `npm run start`
- **Works**: Only on your local machine

### Remote HTTP API Version
- **Use for**: Share with others, always available
- **Deploy**: Render free tier
- **Access**: From anywhere via URL
- **Integrate**: Custom GPT or direct API calls

---

## Troubleshooting

### Render Deployment Issues

**Build fails**:
- Check logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility

**App crashes on start**:
- Check if `web/dist/tutorial-video-player.js` was built
- Verify environment variables

**Free tier limitations**:
- Render free tier apps sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Limited to 750 hours/month

### API Not Working

**CORS errors**:
- CORS is enabled by default in `api/server.js`
- If issues persist, check browser console

**Videos not loading**:
- Verify video IDs are correct
- Check if videos are still unlisted (not private)
- Ensure YouTube embed is enabled

---

## Next Steps

1. ✓ Deploy to Render
2. ✓ Get your API URL
3. ✓ Create Custom GPT with your API
4. ✓ Share the API URL with others
5. ✓ Keep local MCP for personal use

Need help? Check the main README.md for more details.
