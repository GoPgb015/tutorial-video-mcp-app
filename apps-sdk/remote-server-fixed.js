import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Tutorial videos
const TUTORIAL_VIDEOS = [
  {
    id: 'Xpg2bnO_-eU',
    title: 'Introduction to Artificial Intelligence | Part 1',
    description: 'Welcome to the first part of our Artificial Intelligence (AI) series! Learn the basics of AI, its history, real-world applications, and how it\'s transforming industries.',
  },
  {
    id: 'p6Yr-DVao3Y',
    title: 'Prompt Engineering - Introduction',
    description: 'Welcome to the first episode of our Prompt Engineering series! Learn what prompt engineering is, why it matters, and how it powers AI tools like ChatGPT, Gemini, and Claude.',
  },
  {
    id: 'PAKfEvJSLWA',
    title: 'Prompt Engineering Part 1 - Key Components',
    description: 'Learn the key components that make a prompt effective when working with AI tools. Topics: context, clarity, role, tone, and constraints.',
  },
  {
    id: 'ng5lAQay4qI',
    title: 'Testing Prompts on Google Gemini',
    description: 'Watch how we test and experiment with different prompts on Google Gemini. See how changing just a few words can completely transform AI responses.',
  },
];

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

app.use(express.json());

// Serve widget assets
app.use('/widgets', express.static(join(__dirname, '..', 'assets'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Gradeless - Tutorial Video MCP Server',
    version: '1.0.0',
    status: 'running',
    mcp: {
      endpoint: `${BASE_URL}/sse`,
      protocol: 'Model Context Protocol',
      transport: 'SSE',
    },
    widgets: {
      endpoint: `${BASE_URL}/widgets`,
      available: ['video-player.html']
    }
  });
});

// SSE endpoint for MCP
app.get('/sse', async (req, res) => {
  console.log('[SSE] New connection attempt');

  try {
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });

    // Send initial comment to establish connection
    res.write(': connected\n\n');

    console.log('[SSE] Headers sent, creating MCP server');

    // Create MCP server instance
    const server = new Server(
      {
        name: 'gradeless-tutorial-videos',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Schema for tools
    const ShowTutorialVideoSchema = z.object({
      videoId: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    });

    // List tools handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.log('[MCP] ListTools called');
      return {
        tools: [
          {
            name: 'show_tutorial_video',
            description: 'Display a YouTube tutorial video inline with a custom widget. Videos cover AI and Prompt Engineering topics.',
            inputSchema: {
              type: 'object',
              properties: {
                videoId: {
                  type: 'string',
                  description: 'YouTube video ID (e.g., "Xpg2bnO_-eU")',
                },
                title: {
                  type: 'string',
                  description: 'Optional title for the video',
                },
                description: {
                  type: 'string',
                  description: 'Optional description',
                },
              },
              required: ['videoId'],
            },
          },
          {
            name: 'list_tutorial_videos',
            description: 'List all available tutorial videos from the playlist',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.log('[MCP] CallTool:', request.params.name);
      const { name, arguments: args } = request.params;

      if (name === 'list_tutorial_videos') {
        return {
          content: [
            {
              type: 'text',
              text: `Available Tutorial Videos:\n\n${TUTORIAL_VIDEOS.map((v, i) =>
                `${i + 1}. ${v.title}\n   Video ID: ${v.id}\n   ${v.description.substring(0, 100)}...`
              ).join('\n\n')}`,
            },
          ],
        };
      }

      if (name === 'show_tutorial_video') {
        const parsed = ShowTutorialVideoSchema.safeParse(args);

        if (!parsed.success) {
          throw new Error(`Invalid arguments: ${parsed.error.message}`);
        }

        const { videoId, title, description } = parsed.data;
        const catalogVideo = TUTORIAL_VIDEOS.find(v => v.id === videoId);
        const finalTitle = title || catalogVideo?.title || 'Tutorial Video';
        const finalDescription = description || catalogVideo?.description || '';

        return {
          content: [
            {
              type: 'text',
              text: `Here's the tutorial video: ${finalTitle}`,
            },
          ],
          _meta: {
            openai: {
              outputTemplate: {
                type: 'html',
                url: `${BASE_URL}/widgets/video-player.html`,
                data: {
                  videoId: videoId,
                  title: finalTitle,
                  description: finalDescription,
                },
              },
            },
          },
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    });

    console.log('[SSE] Creating transport');

    // Create SSE transport
    const transport = new SSEServerTransport('/sse', res);

    console.log('[SSE] Connecting server to transport');

    // Connect server to transport
    await server.connect(transport);

    console.log('[SSE] Server connected successfully');

    // Handle client disconnect
    req.on('close', () => {
      console.log('[SSE] Connection closed');
      try {
        transport.close();
      } catch (err) {
        console.error('[SSE] Error closing transport:', err);
      }
    });

    req.on('error', (err) => {
      console.error('[SSE] Request error:', err);
    });

  } catch (error) {
    console.error('[SSE] Error in SSE endpoint:', error);
    console.error('[SSE] Error stack:', error.stack);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.end();
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Gradeless Tutorial Video MCP Server');
  console.log('=====================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Base URL: ${BASE_URL}`);
  console.log(`\n📡 MCP Connection:`);
  console.log(`   SSE Endpoint: ${BASE_URL}/sse`);
  console.log(`   Protocol: Model Context Protocol (SSE Transport)`);
  console.log(`\n📦 Widgets:`);
  console.log(`   Endpoint: ${BASE_URL}/widgets`);
  console.log(`   Available: video-player.html`);
  console.log(`\n🎬 Videos: ${TUTORIAL_VIDEOS.length} tutorials available`);
  console.log('\n💡 Connect in ChatGPT:');
  console.log(`   Name: Gradeless`);
  console.log(`   MCP Server URL: ${BASE_URL}/sse`);
  console.log(`   Authentication: None`);
  console.log('\n');
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
