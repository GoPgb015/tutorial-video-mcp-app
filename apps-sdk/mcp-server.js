import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// IMPORTANT: Set this to your deployed Render URL
// Example: https://tutorial-video-apps-sdk.onrender.com
const WIDGET_BASE_URL = process.env.WIDGET_URL || 'http://localhost:3001';

// Tutorial videos from the playlist
const TUTORIAL_VIDEOS = [
  {
    id: 'Xpg2bnO_-eU',
    title: 'Introduction to Artificial Intelligence | Part 1',
    description: 'Welcome to the first part of our Artificial Intelligence (AI) series! Learn the basics of AI, its history, real-world applications, and how it\'s transforming industries. Topics: What is AI, History and evolution, Types of AI (Narrow, General & Super), Applications in everyday life, Future scope and career opportunities.',
  },
  {
    id: 'p6Yr-DVao3Y',
    title: 'Prompt Engineering - Introduction',
    description: 'Welcome to the first episode of our Prompt Engineering series! Learn what prompt engineering is, why it matters, and how it powers AI tools like ChatGPT, Gemini, and Claude. Topics: What is Prompt Engineering, Importance in AI and LLMs, How AI interprets input, Examples of effective prompts, Careers in Prompt Engineering.',
  },
  {
    id: 'PAKfEvJSLWA',
    title: 'Prompt Engineering Part 1 - Key Components',
    description: 'Learn the key components that make a prompt effective when working with AI tools. Topics: What makes a prompt effective, Key components (context, clarity, role, tone, constraints), Examples of good vs. bad prompts, Tips for improving AI responses, Common mistakes to avoid.',
  },
  {
    id: 'ng5lAQay4qI',
    title: 'Testing Prompts on Google Gemini',
    description: 'Watch how we test and experiment with different prompts on Google Gemini. See how changing just a few words can completely transform AI responses. Topics: How Gemini interprets prompts, Tips for writing clear prompts, Creative vs. structured prompt styles, Real examples and live testing.',
  },
];

// Create MCP server
const mcpServer = new Server(
  {
    name: 'tutorial-video-apps-sdk',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Schema for the show_tutorial_video tool
const ShowTutorialVideoSchema = z.object({
  videoId: z.string().describe('YouTube video ID to display'),
  title: z.string().optional().describe('Optional title for the video'),
  description: z.string().optional().describe('Optional description for the video'),
});

// List available tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'show_tutorial_video',
        description: 'Display a YouTube tutorial video inline in the chat with a custom widget. Provide a video ID from the tutorial playlist.',
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
              description: 'Optional description for the video',
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
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
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

    // Find video in catalog for default values
    const catalogVideo = TUTORIAL_VIDEOS.find(v => v.id === videoId);
    const finalTitle = title || catalogVideo?.title || 'Tutorial Video';
    const finalDescription = description || catalogVideo?.description || '';

    // Return response with widget metadata (Apps SDK format)
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
            url: `${WIDGET_BASE_URL}/widgets/video-player.html`,
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

// Start MCP server
async function startMCPServer() {
  console.error('\n🚀 Starting Tutorial Video Apps SDK MCP Server...\n');
  console.error('📋 Configuration:');
  console.error(`   Widget URL: ${WIDGET_BASE_URL}`);
  console.error(`   Videos: ${TUTORIAL_VIDEOS.length} tutorials available\n`);

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await mcpServer.connect(transport);

  console.error('✅ MCP server started successfully!');
  console.error('   Available tools: show_tutorial_video, list_tutorial_videos\n');
  console.error('💡 To use in ChatGPT:');
  console.error('   1. Enable Developer Mode in ChatGPT');
  console.error('   2. Add this MCP server (see APPS-SDK-GUIDE.md)');
  console.error('   3. Ask: "Show me tutorial videos"\n');
  console.error('🌐 Widget server must be accessible at:');
  console.error(`   ${WIDGET_BASE_URL}/widgets/video-player.html\n`);
}

startMCPServer().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
