import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Tutorial videos from the playlist
const TUTORIAL_VIDEOS = [
  {
    id: 'Xpg2bnO_-eU',
    title: 'Introduction to Artificial Intelligence | Part 1',
    description: 'Welcome to the first part of our Artificial Intelligence (AI) series! Learn the basics of AI, its history, real-world applications, and how it\'s transforming industries. Topics: What is AI, History and evolution, Types of AI (Narrow, General & Super), Applications in everyday life, Future scope and career opportunities.',
    url: 'https://youtu.be/Xpg2bnO_-eU',
  },
  {
    id: 'p6Yr-DVao3Y',
    title: 'Prompt Engineering - Introduction',
    description: 'Welcome to the first episode of our Prompt Engineering series! Learn what prompt engineering is, why it matters, and how it powers AI tools like ChatGPT, Gemini, and Claude. Topics: What is Prompt Engineering, Importance in AI and LLMs, How AI interprets input, Examples of effective prompts, Careers in Prompt Engineering.',
    url: 'https://youtu.be/p6Yr-DVao3Y',
  },
  {
    id: 'PAKfEvJSLWA',
    title: 'Prompt Engineering Part 1 - Key Components',
    description: 'Learn the key components that make a prompt effective when working with AI tools. Topics: What makes a prompt effective, Key components (context, clarity, role, tone, constraints), Examples of good vs. bad prompts, Tips for improving AI responses, Common mistakes to avoid.',
    url: 'https://youtu.be/PAKfEvJSLWA',
  },
  {
    id: 'ng5lAQay4qI',
    title: 'Testing Prompts on Google Gemini',
    description: 'Watch how we test and experiment with different prompts on Google Gemini. See how changing just a few words can completely transform AI responses. Topics: How Gemini interprets prompts, Tips for writing clear prompts, Creative vs. structured prompt styles, Real examples and live testing.',
    url: 'https://youtu.be/ng5lAQay4qI',
  },
];

// Load web component script
let webComponentScript = null;

async function loadWebComponent() {
  try {
    const scriptPath = join(__dirname, '..', 'web', 'dist', 'tutorial-video-player.js');
    webComponentScript = await readFile(scriptPath, 'utf-8');
    console.log('✓ Web component loaded successfully');
  } catch (error) {
    console.warn('⚠ Warning: Could not load web component:', error.message);
    console.warn('  Run: npm run build:web');
  }
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Tutorial Video API',
    version: '1.0.0',
    description: 'API for displaying tutorial videos',
    endpoints: {
      videos: '/api/videos',
      videoById: '/api/videos/:id',
      embed: '/api/embed/:id',
      player: '/api/player/:id',
    },
  });
});

// Get all videos
app.get('/api/videos', (req, res) => {
  res.json({
    success: true,
    count: TUTORIAL_VIDEOS.length,
    videos: TUTORIAL_VIDEOS,
  });
});

// Get specific video by ID
app.get('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  const video = TUTORIAL_VIDEOS.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({
      success: false,
      error: 'Video not found',
      availableIds: TUTORIAL_VIDEOS.map(v => v.id),
    });
  }

  res.json({
    success: true,
    video,
  });
});

// Get embed code for a video
app.get('/api/embed/:id', (req, res) => {
  const { id } = req.params;
  const video = TUTORIAL_VIDEOS.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({
      success: false,
      error: 'Video not found',
    });
  }

  const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  res.json({
    success: true,
    video,
    embedCode,
    embedUrl: `https://www.youtube.com/embed/${id}`,
  });
});

// Get full HTML player page
app.get('/api/player/:id', async (req, res) => {
  const { id } = req.params;
  const video = TUTORIAL_VIDEOS.find(v => v.id === id);

  if (!video) {
    return res.status(404).send(`
      <html>
        <body>
          <h1>Video not found</h1>
          <p>Video ID: ${id}</p>
          <a href="/">Back to home</a>
        </body>
      </html>
    `);
  }

  if (!webComponentScript) {
    return res.status(500).send(`
      <html>
        <body>
          <h1>Error: Web component not loaded</h1>
          <p>Please run: npm run build:web</p>
        </body>
      </html>
    `);
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${video.title}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <tutorial-video-player
      video-id="${video.id}"
      title="${video.title.replace(/"/g, '&quot;')}"
      description="${video.description.replace(/"/g, '&quot;')}"
    ></tutorial-video-player>
  </div>

  <script type="module">
${webComponentScript}
  </script>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Start server
async function startServer() {
  await loadWebComponent();

  app.listen(PORT, () => {
    console.log(`\n✓ Tutorial Video API Server running on port ${PORT}`);
    console.log(`\n  Available endpoints:`);
    console.log(`  • GET  /                    - API info`);
    console.log(`  • GET  /api/videos          - List all videos`);
    console.log(`  • GET  /api/videos/:id      - Get video details`);
    console.log(`  • GET  /api/embed/:id       - Get embed code`);
    console.log(`  • GET  /api/player/:id      - View video player\n`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
