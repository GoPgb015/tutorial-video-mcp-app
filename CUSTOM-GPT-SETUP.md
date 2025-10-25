# Custom GPT Setup Guide

Your API is live and ready to integrate with ChatGPT!

🔗 **Your API URL:** https://tutorial-video-mcp-app.onrender.com

---

## ✅ API Testing Results

All endpoints tested and working:

- ✅ **Root**: Returns API info
- ✅ **`/api/videos`**: Lists all 4 tutorial videos
- ✅ **`/api/videos/:id`**: Returns specific video details
- ✅ **`/api/player/:id`**: Shows video player with custom UI
- ✅ **Web component**: Loads and displays YouTube videos

**Your 4 Videos:**
1. Introduction to Artificial Intelligence | Part 1 (`Xpg2bnO_-eU`)
2. Prompt Engineering - Introduction (`p6Yr-DVao3Y`)
3. Prompt Engineering Part 1 - Key Components (`PAKfEvJSLWA`)
4. Testing Prompts on Google Gemini (`ng5lAQay4qI`)

---

## 🎯 Create a Custom GPT with Your API

### Step 1: Access Custom GPT Builder

**Note:** You need ChatGPT Plus or ChatGPT Team to create Custom GPTs.

1. Go to: **https://chatgpt.com**
2. Click on your name (bottom left)
3. Select **"My GPTs"**
4. Click **"Create a GPT"**

---

### Step 2: Configure Your GPT

#### **Create Tab**

Have a conversation with the GPT Builder. You can say:

```
Create a GPT that helps users find and watch tutorial videos about AI and Prompt Engineering. The GPT should be friendly, educational, and able to show videos inline when users ask about specific topics.
```

Or configure manually:

**Name:** Tutorial Video Assistant

**Description:**
```
Your AI tutor for learning about Artificial Intelligence and Prompt Engineering. I can show you tutorial videos inline and help you understand key concepts.
```

**Instructions:**
```
You are a helpful AI tutor specializing in Artificial Intelligence and Prompt Engineering. You have access to a collection of 4 tutorial videos:

1. Introduction to Artificial Intelligence | Part 1 - Covers AI basics, history, types of AI, and applications
2. Prompt Engineering - Introduction - Explains what prompt engineering is and why it matters
3. Prompt Engineering Part 1 - Key Components - Teaches effective prompt structure
4. Testing Prompts on Google Gemini - Demonstrates live prompt testing

When users ask about these topics:
1. First, use listVideos to show available videos
2. When they want to watch a video, use getPlayer to get the video URL
3. Always provide the player URL in a clickable link format like: [Watch Video](URL)
4. After sharing a video, ask if they have questions or want to see another video

Be encouraging, patient, and explain concepts in simple terms. If users ask about topics not covered in the videos, provide general information and offer to show related videos.
```

**Conversation Starters:**
```
- Show me available tutorials
- I want to learn about AI
- Teach me prompt engineering
- What videos do you have?
```

---

### Step 3: Configure Actions (API Integration)

Click on the **"Configure"** tab, then scroll down to **"Actions"**:

1. Click **"Create new action"**

2. **Authentication:** Select **"None"** (your API is public)

3. **Schema:** Click **"Import from URL"** and enter:
   ```
   https://tutorial-video-mcp-app.onrender.com/openapi.yaml
   ```

   **If that doesn't work**, manually paste this OpenAPI schema:

```yaml
openapi: 3.1.0
info:
  title: Tutorial Video API
  description: API for displaying YouTube tutorial videos inline
  version: 1.0.0
servers:
  - url: https://tutorial-video-mcp-app.onrender.com

paths:
  /api/videos:
    get:
      operationId: listVideos
      summary: List all tutorial videos
      description: Returns all available tutorial videos
      responses:
        '200':
          description: Successful response

  /api/videos/{id}:
    get:
      operationId: getVideo
      summary: Get video details
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful response

  /api/player/{id}:
    get:
      operationId: getPlayer
      summary: Get video player URL
      description: Returns URL to view video in player
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: HTML page with video player
```

4. Click **"Save"** (or the checkmark)

5. **Test the action:**
   - Click the ▶️ play button next to `listVideos`
   - You should see the 4 videos returned
   - If it works, you're all set! ✅

---

### Step 4: Configure Settings

In the **"Configure"** tab:

**Capabilities:**
- ✅ Web Browsing (optional, but useful)
- ✅ Code Interpreter (optional)

**Additional Settings:**
- **Profile Picture:** Upload an image (optional)
- **Category:** Education

---

### Step 5: Save and Test

1. Click **"Save"** (top right)
2. Choose **"Only me"** to test privately, or **"Anyone with a link"** to share
3. Click **"Confirm"**

---

## 🧪 Test Your Custom GPT

After creating, test it:

### Test 1: List Videos
```
Show me available tutorials
```

**Expected:** GPT calls `listVideos` and shows all 4 videos

### Test 2: Watch a Video
```
I want to watch the AI introduction video
```

**Expected:** GPT calls `getPlayer` with the video ID and provides a link like:
`https://tutorial-video-mcp-app.onrender.com/api/player/Xpg2bnO_-eU`

### Test 3: Specific Topic
```
Teach me about prompt engineering
```

**Expected:** GPT suggests relevant videos and offers to show them

---

## 🔗 Share Your Custom GPT

Once it's working:

1. Click **"Share"** (top right in your GPT)
2. Choose:
   - **"Only me"** - Private
   - **"Anyone with a link"** - Shareable link
   - **"Public"** - Listed in GPT store (if approved)
3. Copy the link
4. Share with others!

---

## 🎬 How Videos Will Appear

When users click the video player link:
- Opens in a new tab/window
- Shows your custom video player UI
- YouTube video embedded and ready to play
- Clean, professional interface with title and description

---

## 📊 Monitor Usage

**Check Render Dashboard:**
- Go to: https://dashboard.render.com
- Select your service: `tutorial-video-mcp-app`
- View logs and metrics
- Monitor requests

**Free Tier Notes:**
- App sleeps after 15 min inactivity
- First request takes ~30 sec to wake
- 750 hours/month included

---

## 🛠️ Troubleshooting

### GPT can't connect to API
- Verify API is awake: Visit https://tutorial-video-mcp-app.onrender.com
- Check Render logs for errors
- Ensure OpenAPI schema is correct

### Videos not loading
- Check video IDs are correct
- Verify videos are still unlisted (not private)
- Test direct URL: https://tutorial-video-mcp-app.onrender.com/api/player/VIDEO_ID

### Action returns error
- Test endpoint directly in browser first
- Check Render logs for server errors
- Verify OpenAPI schema matches actual endpoints

---

## 🎯 Next Steps

✅ API is live and working
✅ OpenAPI schema ready
✅ Custom GPT instructions prepared

**Now you can:**
1. Create your Custom GPT following the steps above
2. Test it thoroughly
3. Share with others
4. Use it to learn and teach AI/Prompt Engineering!

---

## 📚 Quick Reference

**API Base URL:** https://tutorial-video-mcp-app.onrender.com

**Key Endpoints:**
- List videos: `/api/videos`
- Video details: `/api/videos/{id}`
- Watch video: `/api/player/{id}`

**Video IDs:**
- AI Intro: `Xpg2bnO_-eU`
- PE Intro: `p6Yr-DVao3Y`
- PE Components: `PAKfEvJSLWA`
- Gemini Testing: `ng5lAQay4qI`

---

Need help? Check the main documentation or test the API directly in your browser!
