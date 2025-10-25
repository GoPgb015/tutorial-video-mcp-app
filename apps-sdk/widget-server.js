import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();

// Enable CORS for ChatGPT to load widgets
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve widget assets
app.use('/widgets', express.static(join(__dirname, '..', 'assets'), {
  setHeaders: (res, path) => {
    // Set headers for widget loading
    res.set('Access-Control-Allow-Origin', '*');
    res.set('X-Content-Type-Options', 'nosniff');
    if (path.endsWith('.html')) {
      res.set('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Tutorial Video Widget Server',
    version: '1.0.0',
    status: 'running',
    widgetUrl: `${req.protocol}://${req.get('host')}/widgets`,
    availableWidgets: [
      'video-player.html'
    ]
  });
});

// Widget info endpoint
app.get('/widgets', (req, res) => {
  res.json({
    widgets: [
      {
        name: 'video-player',
        url: `${req.protocol}://${req.get('host')}/widgets/video-player.html`,
        description: 'YouTube video player widget'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n✓ Widget server running on port ${PORT}`);
  console.log(`  Access at: http://localhost:${PORT}`);
  console.log(`  Widgets: http://localhost:${PORT}/widgets`);
  console.log(`\n📦 Available widgets:`);
  console.log(`  - video-player.html`);
});
