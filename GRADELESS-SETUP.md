# Gradeless - Remote MCP Server Setup

Connect your tutorial video MCP server to ChatGPT via URL (no local setup needed!)

---

## 🎯 What is This?

**Gradeless** is your remote MCP server that:
- ✅ Runs on Render (always available)
- ✅ Connects to ChatGPT via URL
- ✅ Displays YouTube tutorial videos inline
- ✅ No local server needed!

---

## 🚀 Deployment to Render

### Step 1: Create New Render Service

1. Go to: **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Connect repository: **`GoPgb015/tutorial-video-mcp-app`**
4. Click **"Connect"**

### Step 2: Configure Service

Fill in these settings:

**Name:**
```
gradeless-mcp
```

**Region:**
```
Oregon
```
(or closest: Frankfurt, Singapore, etc.)

**Branch:**
```
main
```

**Build Command:**
```
npm install && npm run build:widgets
```

**Start Command:**
```
npm run dev:remote
```

**Instance Type:**
```
Free
```

### Step 3: Set Environment Variable

Click **"Advanced"** and add:

**Environment Variable:**
- Key: `BASE_URL`
- Value: (Leave empty for now, will update after deployment)

### Step 4: Deploy

Click **"Create Web Service"** and wait 2-5 minutes.

You'll get a URL like:
```
https://gradeless-mcp.onrender.com
```

### Step 5: Update BASE_URL

After deployment:

1. Go to your service in Render dashboard
2. Click **"Environment"** tab
3. Edit `BASE_URL` variable
4. Set to: `https://gradeless-mcp.onrender.com` (your actual URL)
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## ✅ Verify Deployment

Test your deployment:

**Test 1: Health Check**
```
https://gradeless-mcp.onrender.com
```

Should return:
```json
{
  "name": "Gradeless - Tutorial Video MCP Server",
  "status": "running",
  "mcp": {
    "endpoint": "https://gradeless-mcp.onrender.com/sse",
    "protocol": "Model Context Protocol",
    "transport": "SSE"
  }
}
```

**Test 2: Widget**
```
https://gradeless-mcp.onrender.com/widgets/video-player.html
```

Should load the widget HTML.

✅ Deployment successful!

---

## 🔗 Connect to ChatGPT

### Step 1: Open ChatGPT

Go to: **https://chatgpt.com**

### Step 2: Add MCP Server

Look for **"Apps and Connectors"** or **"Integrations"** in settings.

Click **"Add MCP Server"** or **"+"**

### Step 3: Fill in the Form

**Icon:** (Optional - skip or upload image)

**Name:**
```
Gradeless
```

**Description:** (Optional)
```
Tutorial videos for AI and Prompt Engineering
```

**MCP Server URL:**
```
https://gradeless-mcp.onrender.com/sse
```

**Important:** Use `/sse` at the end!

**Authentication:**
```
None (No authentication)
```

Click **"I understand and want to continue"** if prompted about risks.

### Step 4: Create/Save

Click **"Create"** or **"Save"**

You should see "Gradeless" added to your connectors!

---

## 🎬 Test in ChatGPT

### Start New Chat

Click **"New Chat"** in ChatGPT

### Test Commands

**Test 1:**
```
Show me available tutorial videos
```

Expected: List of 4 videos about AI and Prompt Engineering

**Test 2:**
```
I want to watch the AI introduction video
```

Expected: Video displays inline with custom widget! 🎉

**Test 3:**
```
Teach me about prompt engineering
```

Expected: ChatGPT suggests videos and shows them inline

---

## 📊 Your Tutorial Videos

All 4 videos ready to display:

1. **Introduction to Artificial Intelligence | Part 1**
   - Video ID: `Xpg2bnO_-eU`
   - Learn AI basics, history, and applications

2. **Prompt Engineering - Introduction**
   - Video ID: `p6Yr-DVao3Y`
   - Understand what prompt engineering is

3. **Prompt Engineering Part 1 - Key Components**
   - Video ID: `PAKfEvJSLWA`
   - Learn effective prompt structure

4. **Testing Prompts on Google Gemini**
   - Video ID: `ng5lAQay4qI`
   - Watch live prompt testing demos

---

## 🐛 Troubleshooting

### Deployment Issues

**Build fails:**
- Check Render logs in dashboard
- Verify `package.json` has all dependencies
- Ensure Node.js version is compatible

**Service won't start:**
- Check `BASE_URL` environment variable is set correctly
- View logs in Render dashboard
- Verify widgets were built (check `/widgets` endpoint)

### Connection Issues

**ChatGPT can't connect:**
- Verify URL ends with `/sse`: `https://gradeless-mcp.onrender.com/sse`
- Check Render service is "Live" (not sleeping)
- First request takes ~30 seconds (free tier wake-up)
- Try manually visiting the URL in browser first

**Widget not loading:**
- Test widget URL directly
- Check CORS is enabled (it is in the code)
- Verify Render service is accessible
- Check browser console for errors

### Video Issues

**Video won't play:**
- Check video IDs are correct
- Verify videos are still unlisted (not private)
- Test YouTube URL directly: `https://youtube.com/watch?v=VIDEO_ID`
- Check iframe permissions

---

## 🔄 Updating

### Update Server Code

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update Gradeless server"
   git push origin main
   ```
3. Render auto-deploys (if enabled)
4. Or manually trigger deploy in Render dashboard

### Update Widgets

1. Edit `src/widgets/video-player.html`
2. Rebuild: `npm run build:widgets`
3. Commit and push
4. Render redeploys automatically

---

## 💰 Cost

**FREE!** 🎉

- Render free tier: 750 hours/month
- Sleeps after 15 min inactivity
- 30 sec wake-up time on first request
- Perfect for this use case

---

## 📋 Quick Reference

**Render URL:**
```
https://gradeless-mcp.onrender.com
```

**ChatGPT Connection:**
- Name: **Gradeless**
- URL: **https://gradeless-mcp.onrender.com/sse**
- Auth: **None**

**Endpoints:**
- Health: `https://gradeless-mcp.onrender.com`
- MCP SSE: `https://gradeless-mcp.onrender.com/sse`
- Widgets: `https://gradeless-mcp.onrender.com/widgets`

---

## ✨ Features

✅ **Remote MCP Server** - No local setup needed
✅ **SSE Transport** - Direct ChatGPT connection
✅ **Inline Videos** - Display YouTube videos in chat
✅ **Custom Widgets** - Beautiful video player UI
✅ **4 Tutorial Videos** - AI & Prompt Engineering content
✅ **Always Available** - Hosted on Render
✅ **Free Tier** - No costs

---

## 🎊 Success!

Once connected:
- Videos display inline in ChatGPT
- No local server to run
- Works from anywhere
- Share with your team easily

**Your manager will love it!** 🚀

---

## 📞 Need Help?

**Check:**
- Render dashboard logs
- ChatGPT connection status
- Browser console when testing
- URLs are correct (especially `/sse` endpoint)

**Common fixes:**
- Wait 30 seconds for Render wake-up
- Verify `BASE_URL` environment variable
- Check service is "Live" in Render
- Try clearing ChatGPT cache

---

## 🎯 Next Steps

1. ✅ Deploy to Render
2. ✅ Set BASE_URL environment variable
3. ✅ Connect in ChatGPT
4. ✅ Test videos inline
5. ✅ Show your manager!

**Let's make learning AI and Prompt Engineering easy!** 📚
