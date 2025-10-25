# Tutorial Video App

Display YouTube tutorial videos inline in ChatGPT and via HTTP API.

## 🎯 Three Versions Available

1. **Local MCP Server** - Native ChatGPT integration (runs locally)
2. **HTTP API Server** - Deploy to Render, use anywhere (remote)
3. **Apps SDK** - Videos display inline in ChatGPT with custom widgets ⭐ **NEW!**

📘 **Guides:** [Deployment](DEPLOYMENT.md) | [Apps SDK Setup](APPS-SDK-GUIDE.md) | [Apps SDK Summary](APPS-SDK-SUMMARY.md)

## Your Tutorial Playlist

This app includes 4 tutorial videos:

1. **Introduction to Artificial Intelligence | Part 1** (Xpg2bnO_-eU)
   - Basics of AI, history, applications, and career opportunities

2. **Prompt Engineering - Introduction** (p6Yr-DVao3Y)
   - What prompt engineering is and why it matters for AI tools

3. **Prompt Engineering Part 1 - Key Components** (PAKfEvJSLWA)
   - Key components of effective prompts (context, clarity, role, tone)

4. **Testing Prompts on Google Gemini** (ng5lAQay4qI)
   - Live testing and experimentation with prompts on Gemini

## Quick Start

### Option 1: Local MCP Server

**Best for**: Native ChatGPT MCP integration

### 1. Start the MCP Server

```bash
npm run start
```

Or run separately:
```bash
npm run build:web  # Build web component first
npm run dev        # Then start the server
```

### 2. Configure in ChatGPT

To use this MCP server with ChatGPT, you need to configure it in your ChatGPT settings:

1. Open ChatGPT settings
2. Navigate to **Beta Features** or **Integrations**
3. Add MCP Server with the following configuration:

```json
{
  "mcpServers": {
    "tutorial-videos": {
      "command": "node",
      "args": ["C:/Users/igour/Downloads/test/server/index.js"],
      "cwd": "C:/Users/igour/Downloads/test"
    }
  }
}
```

**Note:** Adjust the paths according to your actual installation directory.

### 3. Using the Tools in ChatGPT

Once configured, you can use these tools in ChatGPT:

#### List Available Videos
```
Use the list_tutorial_videos tool to show me available tutorials
```

#### Display a Video
```
Show me the AI introduction video using show_tutorial_video
```

Or specify any video by ID:
```
Display video Xpg2bnO_-eU with show_tutorial_video
```

---

### Option 2: Apps SDK (Inline Widgets in ChatGPT) ⭐ **NEW!**

**Best for**: Videos displaying inline inside ChatGPT with custom UI

#### 1. Build and start
```bash
npm run start:apps-sdk
```

#### 2. Connect to ChatGPT
1. Enable **Developer Mode** in ChatGPT settings
2. Add MCP server in ChatGPT
3. Ask: "Show me tutorial videos"

**Videos display inline!** 🎉

**See** `APPS-SDK-GUIDE.md` for complete setup instructions.

---

### Option 3: HTTP API Server

**Best for**: Remote deployment, Custom GPTs, sharing with others

#### 1. Install dependencies
```bash
npm install
```

#### 2. Test locally (optional)
```bash
npm run start:api
# Visit http://localhost:3000
```

#### 3. Deploy to Render
See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment instructions including:
- Pushing to GitHub
- Deploying to Render (free tier)
- Creating Custom GPT with your API
- API endpoints and usage

**Quick API endpoints** (after deployment):
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get video details
- `GET /api/player/:id` - View video player

---

## Available Tools (MCP Version)

### `list_tutorial_videos`
Lists all 4 tutorial videos with their IDs and descriptions.

**Example:**
```
list_tutorial_videos()
```

### `show_tutorial_video`
Displays a YouTube video inline in the chat.

**Parameters:**
- `videoId` (required): YouTube video ID
- `title` (optional): Custom title for the video
- `description` (optional): Custom description

**Example:**
```
show_tutorial_video({
  videoId: "Xpg2bnO_-eU",
  title: "AI Introduction",
  description: "Learn the basics of AI"
})
```

## Project Structure

```
.
├── server/
│   └── index.js              # MCP server (local)
├── api/
│   └── server.js             # HTTP API server (for deployment)
├── web/
│   ├── src/
│   │   └── index.js          # Web component source
│   ├── dist/
│   │   └── tutorial-video-player.js  # Built web component
│   └── build.js              # Build script
├── package.json
├── render.yaml               # Render deployment config
├── README.md                 # This file
└── DEPLOYMENT.md             # Full deployment guide
```

## Development

### Rebuild Web Component

If you modify the web component:
```bash
npm run build:web
```

### Add More Videos

Edit `server/index.js` and update the `TUTORIAL_VIDEOS` array:

```javascript
const TUTORIAL_VIDEOS = [
  {
    id: 'YOUR_VIDEO_ID',
    title: 'Your Video Title',
    description: 'Your video description',
  },
  // ... more videos
];
```

Then rebuild:
```bash
npm run build:web
npm run dev
```

## Troubleshooting

### Server won't start
- Make sure you ran `npm install` first
- Check that Node.js is installed: `node --version`

### Videos not displaying
- Verify the build was successful: check `web/dist/tutorial-video-player.js` exists
- Make sure video IDs are correct (11 characters from YouTube URL)

### ChatGPT can't connect
- Verify the MCP server is running
- Check the path in ChatGPT MCP configuration matches your installation
- Restart ChatGPT after adding the MCP server

## License

ISC
