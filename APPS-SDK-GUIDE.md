# OpenAI Apps SDK Implementation Guide

Your tutorial video app has been converted to **OpenAI Apps SDK** format! 🎉

Videos now display **inline inside ChatGPT** using custom widgets.

---

## 📁 Project Structure

```
tutorial-video-mcp-app/
├── apps-sdk/
│   └── server.js              # Apps SDK MCP server with widget support
├── src/
│   └── widgets/
│       └── video-player.html  # Widget source code
├── assets/
│   └── video-player.html      # Built widget (generated)
├── build-widgets.js           # Widget build script
├── package.json               # Updated with Apps SDK scripts
└── (other existing files...)
```

---

## 🎯 What's Different from Before?

### Before (Custom GPT):
- ❌ Videos opened in external links
- ❌ User left ChatGPT to watch videos
- ✅ Simple setup

### Now (Apps SDK):
- ✅ **Videos display inline** inside ChatGPT
- ✅ **Custom widget UI** with your branding
- ✅ **Native ChatGPT integration**
- ✅ **Better user experience**
- 🔧 Slightly more complex setup

---

## 🚀 Quick Start - Testing Locally

### Step 1: Build Widgets

```bash
npm run build:widgets
```

This copies widgets from `src/widgets/` to `assets/`

### Step 2: Start Apps SDK Server

```bash
npm run start:apps-sdk
```

This will:
1. Build widgets
2. Start widget asset server (port 3001)
3. Start MCP server with stdio transport

You should see:
```
✓ Widget server running on port 3001
  Widget URL: http://localhost:3001/widgets
✓ MCP server started successfully!
  Available tools: show_tutorial_video, list_tutorial_videos
```

---

## 🧪 Testing in ChatGPT Developer Mode

### Step 1: Enable Developer Mode

1. Open **ChatGPT** (web or desktop app)
2. Click your **profile** (bottom left)
3. Go to **Settings** → **Beta features**
4. Enable **"Developer Mode"** or **"Apps SDK"**

### Step 2: Add Your MCP Server

1. In ChatGPT, look for **"Developer"** or **"Apps"** section
2. Click **"Add MCP Server"** or **"+"**
3. Fill in:
   - **Name**: `Tutorial Videos`
   - **Command**: `node`
   - **Args**: `["C:/Users/igour/Downloads/test/apps-sdk/server.js"]`
   - **Working Directory**: `C:/Users/igour/Downloads/test`

**Adjust paths to match your actual location!**

### Step 3: Test Your App

In ChatGPT, try:

**Test 1:** List videos
```
Show me available tutorial videos
```
**Expected:** List of 4 videos

**Test 2:** Watch inline video
```
I want to watch the AI introduction video
```
**Expected:** Video displays inline with custom widget!

**Test 3:** Specific topic
```
Teach me about prompt engineering
```
**Expected:** ChatGPT suggests videos and shows them inline

---

## 🌐 Deploying to Production

For production use, you need to host your widgets publicly so ChatGPT can load them.

### Option 1: Deploy Widget Server to Render

#### Update `apps-sdk/server.js`:

Change this line:
```javascript
const WIDGET_BASE_URL = process.env.WIDGET_URL || `http://localhost:${WIDGET_SERVER_PORT}`;
```

Set environment variable on Render:
- Key: `WIDGET_URL`
- Value: `https://your-app.onrender.com`

#### Deploy to Render:

1. Push to GitHub (we'll do this next)
2. Create new Web Service on Render
3. Build command: `npm install && npm run build:all`
4. Start command: `npm run dev:apps-sdk`
5. Add environment variable: `WIDGET_URL=https://your-app.onrender.com`

### Option 2: Use GitHub Pages for Widgets Only

**Simpler approach:** Host widgets on GitHub Pages, keep MCP server local.

1. Copy `assets/` folder to a separate repo
2. Enable GitHub Pages
3. Update `apps-sdk/server.js`:
   ```javascript
   const WIDGET_BASE_URL = 'https://YOUR_USERNAME.github.io/YOUR_REPO';
   ```
4. Keep MCP server running locally

---

## 📝 Widget Development

### Creating New Widgets

1. Add widget HTML in `src/widgets/your-widget.html`
2. Build: `npm run build:widgets`
3. Reference in MCP server response:
   ```javascript
   _meta: {
     openai: {
       outputTemplate: {
         type: 'html',
         url: `${WIDGET_BASE_URL}/widgets/your-widget.html`,
         data: { /* your data */ }
       }
     }
   }
   ```

### Widget Data Injection

Widgets receive data via `window.widgetData`:

```javascript
const widgetData = window.widgetData || {};
const { videoId, title, description } = widgetData;
```

### Widget Best Practices

- ✅ Keep widgets self-contained (inline CSS/JS)
- ✅ Handle loading states
- ✅ Escape user input (XSS prevention)
- ✅ Responsive design
- ✅ Minimal dependencies
- ❌ Don't use external libraries (increases load time)
- ❌ Don't make external API calls from widget

---

## 🔧 Configuration

### Environment Variables

**`WIDGET_PORT`** (default: 3001)
- Port for widget asset server

**`WIDGET_URL`** (default: `http://localhost:3001`)
- Base URL where widgets are hosted
- **Important for production!**

### Example Production Config

```bash
export WIDGET_URL=https://tutorial-video-mcp-app.onrender.com
export WIDGET_PORT=3000
npm run start:apps-sdk
```

---

## 🐛 Troubleshooting

### Widget Not Loading in ChatGPT

**Issue:** Widget shows loading but never displays

**Solutions:**
1. Check widget URL is accessible: Open `http://localhost:3001/widgets/video-player.html` in browser
2. Verify CORS is enabled (already done in server.js)
3. Check browser console for errors
4. Ensure widget server is running (port 3001)

### MCP Server Won't Connect

**Issue:** ChatGPT can't connect to MCP server

**Solutions:**
1. Verify server is running: Check terminal for startup messages
2. Check path in ChatGPT config is correct
3. Try absolute paths instead of relative
4. Check permissions (Windows may block Node.js)

### Videos Not Playing

**Issue:** Widget loads but video doesn't play

**Solutions:**
1. Check video IDs are correct
2. Verify videos are still unlisted (not private)
3. Test video URL directly: `https://youtube.com/watch?v=VIDEO_ID`
4. Check browser console for iframe errors

### Widget Shows Old Version

**Issue:** Updated widget but changes don't appear

**Solutions:**
1. Rebuild widgets: `npm run build:widgets`
2. Restart Apps SDK server: `npm run start:apps-sdk`
3. Hard refresh in ChatGPT (Ctrl+Shift+R)
4. Clear browser cache

---

## 📊 Comparison: All Three Approaches

| Feature | Local MCP | HTTP API | Apps SDK |
|---------|-----------|----------|----------|
| **Video Display** | External links | External links | **Inline widgets** |
| **User Experience** | Opens new tab | Opens new tab | **Native in chat** |
| **Custom UI** | Limited | Full control | **Full control inline** |
| **Deployment** | Local only | Remote (Render) | Hybrid |
| **ChatGPT Integration** | Native MCP | Custom GPT | **Native Apps SDK** |
| **Setup Complexity** | Simple | Medium | **Medium-High** |
| **Best For** | Quick testing | Public sharing | **Production apps** |

---

## 🎬 Demo Videos

Your 4 tutorial videos work perfectly with Apps SDK:

1. **Introduction to Artificial Intelligence | Part 1** (`Xpg2bnO_-eU`)
   - AI basics, history, types, applications

2. **Prompt Engineering - Introduction** (`p6Yr-DVao3Y`)
   - What is prompt engineering, why it matters

3. **Prompt Engineering Part 1 - Key Components** (`PAKfEvJSLWA`)
   - Context, clarity, role, tone, constraints

4. **Testing Prompts on Google Gemini** (`ng5lAQay4qI`)
   - Live testing, experimentation with prompts

---

## 📚 Additional Resources

- **OpenAI Apps SDK Docs**: https://developers.openai.com/apps-sdk/
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Example Apps**: https://github.com/openai/openai-apps-sdk-examples

---

## ✅ Next Steps

1. **Test locally** with ChatGPT Developer Mode
2. **Refine widget UI** based on feedback
3. **Deploy to production** (Render or GitHub Pages)
4. **Share with your team**
5. **Add more videos** as needed

---

## 💡 Tips

- **Widget performance**: Keep widgets lightweight (< 50KB)
- **Testing**: Use browser DevTools to debug widgets
- **Updates**: Rebuild widgets after any changes
- **Security**: Always escape user input in widgets
- **Accessibility**: Add ARIA labels for screen readers

---

**Your Apps SDK implementation is ready! Test it locally first, then deploy to production when ready.** 🚀
