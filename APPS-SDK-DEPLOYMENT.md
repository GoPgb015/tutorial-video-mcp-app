# Apps SDK - Production Deployment Guide

## 🎯 Deployment Architecture

**Split Architecture for Production:**

```
┌─────────────────────────────────────────────────┐
│                  ChatGPT                         │
│          (with Developer Mode)                   │
└──────────────────┬──────────────────────────────┘
                   │
                   │ (stdio)
                   ▼
┌─────────────────────────────────────────────────┐
│         MCP Server (Local)                       │
│    apps-sdk/mcp-server.js                       │
│                                                  │
│    Returns widget URLs pointing to Render ──────┼──┐
└──────────────────────────────────────────────────┘  │
                                                      │
                                                      │ (HTTPS)
                                                      ▼
                                ┌─────────────────────────────────┐
                                │   Widget Server (Render)         │
                                │   apps-sdk/widget-server.js     │
                                │                                 │
                                │   Serves: video-player.html     │
                                └─────────────────────────────────┘
```

**Why this architecture?**
- ✅ Widgets always accessible (Render hosts them)
- ✅ No need to keep local server running for widgets
- ✅ MCP connects to ChatGPT locally (stdio transport)
- ✅ Fast and reliable widget loading

---

## 📋 Step-by-Step Deployment

### Step 1: Deploy Widget Server to Render

#### A. Commit and Push Latest Changes

```bash
git add .
git commit -m "Add production widget server for Render deployment"
git push origin main
```

#### B. Create New Render Service

1. Go to: **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Select repository: **`GoPgb015/tutorial-video-mcp-app`**
4. Click **"Connect"**

#### C. Configure Service

**Name:**
```
tutorial-video-widgets
```

**Region:** Oregon (or closest to you)

**Branch:** `main`

**Build Command:**
```
npm install && npm run build:widgets
```

**Start Command:**
```
npm run dev:widget-server
```

**Instance Type:** **Free**

#### D. Deploy

Click **"Create Web Service"**

Wait 2-5 minutes for deployment.

**You'll get a URL like:**
```
https://tutorial-video-widgets.onrender.com
```

**Save this URL!** You'll need it in Step 2.

#### E. Verify Deployment

Once deployed, test:

**Test 1:** Health check
```
https://tutorial-video-widgets.onrender.com
```
Should show: `{"name":"Tutorial Video Widget Server", "status":"running"}`

**Test 2:** Widget loads
```
https://tutorial-video-widgets.onrender.com/widgets/video-player.html
```
Should load the widget HTML (may show error about missing data - that's OK!)

**✅ Widget server deployed!**

---

### Step 2: Configure Local MCP Server

#### A. Set Widget URL Environment Variable

**Windows (PowerShell):**
```powershell
$env:WIDGET_URL="https://tutorial-video-widgets.onrender.com"
```

**Windows (CMD):**
```cmd
set WIDGET_URL=https://tutorial-video-widgets.onrender.com
```

**Mac/Linux:**
```bash
export WIDGET_URL=https://tutorial-video-widgets.onrender.com
```

**Or create a `.env` file:**
```bash
WIDGET_URL=https://tutorial-video-widgets.onrender.com
```

#### B. Start MCP Server

```bash
npm run start:mcp
```

**Expected output:**
```
🚀 Starting Tutorial Video Apps SDK MCP Server...

📋 Configuration:
   Widget URL: https://tutorial-video-widgets.onrender.com
   Videos: 4 tutorials available

✅ MCP server started successfully!
   Available tools: show_tutorial_video, list_tutorial_videos

💡 To use in ChatGPT:
   1. Enable Developer Mode in ChatGPT
   2. Add this MCP server
   3. Ask: "Show me tutorial videos"

🌐 Widget server must be accessible at:
   https://tutorial-video-widgets.onrender.com/widgets/video-player.html
```

**Keep this terminal open!**

---

### Step 3: Connect to ChatGPT

#### A. Enable Developer Mode

1. Open **ChatGPT** (https://chatgpt.com or desktop app)
2. Go to **Settings** → **Beta features**
3. Enable **"Developer Mode"** or **"Model Context Protocol"**

#### B. Add MCP Server

In ChatGPT, add new MCP server:

**Name:**
```
Tutorial Videos
```

**Command:**
```
node
```

**Arguments:**
```json
["C:/Users/igour/Downloads/test/apps-sdk/mcp-server.js"]
```

**Working Directory:**
```
C:/Users/igour/Downloads/test
```

**Environment Variables:**
```
WIDGET_URL=https://tutorial-video-widgets.onrender.com
```

#### C. Test in ChatGPT

Start a new chat and try:

**Test 1:**
```
Show me available tutorial videos
```
Expected: List of 4 videos

**Test 2:**
```
I want to watch the AI introduction video
```
Expected: Video displays inline with widget from Render!

**Test 3:**
```
Teach me about prompt engineering
```
Expected: Video shows inline in ChatGPT

---

## 🎉 Success Criteria

When everything is working:

- ✅ Render widget server shows "Live" status
- ✅ Widget URL loads in browser
- ✅ Local MCP server shows widget URL in startup logs
- ✅ ChatGPT shows "Tutorial Videos" server connected
- ✅ Videos display inline when requested
- ✅ No errors in ChatGPT or terminal

---

## 🔧 Configuration Files

### For Render Deployment

**render-widgets.yaml** (already created)
- Deploys only the widget server
- No MCP server on Render (runs locally)

### For Local MCP Server

**apps-sdk/mcp-server.js**
- Connects to ChatGPT via stdio
- Returns widget URLs pointing to Render
- Reads `WIDGET_URL` from environment

### Widget Assets

**assets/video-player.html**
- Built from `src/widgets/video-player.html`
- Served by Render widget server
- Loaded by ChatGPT when displaying videos

---

## 📊 Comparison: Deployment Options

| Component | Local Only | Render (Permanent) |
|-----------|------------|-------------------|
| **Widget Server** | localhost:3001 | Render (always on) |
| **MCP Server** | Local | Local |
| **ChatGPT Connection** | stdio | stdio |
| **Widget Availability** | Only when local running | ✅ Always available |
| **Best For** | Testing | **Production** |

---

## 🐛 Troubleshooting

### Widget Server Issues

**Problem:** Render deployment fails

**Solutions:**
1. Check build logs in Render dashboard
2. Verify `package.json` scripts are correct
3. Ensure `assets/video-player.html` exists (run `npm run build:widgets` locally first)

**Problem:** Widget URL returns 404

**Solutions:**
1. Check Render service is "Live" (not sleeping)
2. Verify path: `/widgets/video-player.html`
3. Check assets folder was deployed

### MCP Server Issues

**Problem:** MCP server doesn't use Render URL

**Solutions:**
1. Verify `WIDGET_URL` environment variable is set
2. Check MCP server startup logs show correct URL
3. Restart MCP server after setting environment variable

**Problem:** ChatGPT can't load widget

**Solutions:**
1. Test widget URL directly in browser first
2. Check CORS headers (should be enabled)
3. Verify Render service is accessible publicly
4. Check browser console for errors

### ChatGPT Connection Issues

**Problem:** MCP server won't connect

**Solutions:**
1. Verify paths are absolute and correct
2. Check MCP server is running (terminal should show startup messages)
3. Try restarting ChatGPT
4. Check Developer Mode is enabled

**Problem:** Widget shows but video doesn't load

**Solutions:**
1. Check video IDs are correct
2. Verify videos are still unlisted (not private)
3. Test YouTube video directly: `https://youtube.com/watch?v=VIDEO_ID`
4. Check browser console for iframe errors

---

## 🔄 Updating Widgets

When you update widget code:

### Step 1: Update Source
Edit `src/widgets/video-player.html`

### Step 2: Build Locally
```bash
npm run build:widgets
```

### Step 3: Commit and Push
```bash
git add .
git commit -m "Update video player widget"
git push origin main
```

### Step 4: Redeploy on Render
- Render auto-deploys on git push (if enabled)
- Or manually trigger deploy in Render dashboard

### Step 5: Test
- Widget URL should show new version
- Restart local MCP server (optional)
- Test in ChatGPT

---

## 💰 Cost Breakdown

**Render Free Tier:**
- ✅ Widget server: FREE
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity
- ✅ 30 sec wake-up time (first request)
- ✅ Perfect for this use case!

**Local MCP Server:**
- ✅ FREE (runs on your machine)
- ✅ Only runs when you use ChatGPT
- ✅ No hosting costs

**Total Cost: $0/month** 🎉

---

## 🚀 Quick Commands Reference

### Deployment
```bash
# Deploy to Render (after git push)
# Just configure in Render dashboard

# Start local MCP server
export WIDGET_URL=https://tutorial-video-widgets.onrender.com
npm run start:mcp
```

### Development
```bash
# Test widget server locally
npm run start:widgets

# Test MCP server locally (with local widgets)
npm run start:apps-sdk

# Build widgets only
npm run build:widgets
```

### Testing
```bash
# Test widget loads
curl https://tutorial-video-widgets.onrender.com/widgets/video-player.html

# Test widget server health
curl https://tutorial-video-widgets.onrender.com
```

---

## 📞 Need Help?

**Check these:**
- Widget server logs in Render dashboard
- MCP server output in terminal
- Browser console when testing widget URL
- ChatGPT error messages

**Common issues:**
- Forgot to set `WIDGET_URL` environment variable
- Widget server sleeping (wait 30 sec for wake-up)
- Wrong paths in ChatGPT MCP configuration
- CORS errors (check widget-server.js has CORS enabled)

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] Widgets built: `npm run build:widgets`
- [ ] Committed and pushed to GitHub
- [ ] Render service created and deployed
- [ ] Widget URL accessible: `https://YOUR-APP.onrender.com/widgets/video-player.html`
- [ ] Environment variable set: `WIDGET_URL=https://YOUR-APP.onrender.com`
- [ ] Local MCP server starts without errors
- [ ] MCP server shows correct widget URL in logs
- [ ] ChatGPT Developer Mode enabled
- [ ] MCP server added in ChatGPT settings
- [ ] Test video displays inline in ChatGPT

---

## 🎊 You're Ready!

Your permanent Apps SDK deployment is now complete:

1. ✅ Widget server on Render (always available)
2. ✅ Local MCP server (connects to ChatGPT)
3. ✅ Videos display inline in ChatGPT
4. ✅ No ongoing costs
5. ✅ Production-ready

**Start using it:**
```bash
export WIDGET_URL=https://tutorial-video-widgets.onrender.com
npm run start:mcp
```

Then connect ChatGPT and enjoy inline tutorial videos! 🚀
