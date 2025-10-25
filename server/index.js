import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
const server = new Server(
  {
    name: 'tutorial-video-mcp',
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

// Load the bundled web component
let webComponentScript = null;

async function loadWebComponent() {
  try {
    const scriptPath = join(__dirname, '..', 'web', 'dist', 'tutorial-video-player.js');
    webComponentScript = await readFile(scriptPath, 'utf-8');
    console.error('✓ Web component loaded successfully');
  } catch (error) {
    console.error('⚠ Warning: Could not load web component:', error.message);
    console.error('  Make sure to run: npm run build:web');
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'show_tutorial_video',
        description: 'Display a YouTube tutorial video inline in the chat. Provide a video ID from the tutorial playlist.',
        inputSchema: {
          type: 'object',
          properties: {
            videoId: {
              type: 'string',
              description: 'YouTube video ID (e.g., "dQw4w9WgXcQ")',
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
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'list_tutorial_videos') {
    return {
      content: [
        {
          type: 'text',
          text: `Available Tutorial Videos:\n\n${TUTORIAL_VIDEOS.map((v, i) =>
            `${i + 1}. ${v.title}\n   Video ID: ${v.id}\n   ${v.description}`
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

    if (!webComponentScript) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: Web component not loaded. Please run 'npm run build:web' first.`,
          },
        ],
      };
    }

    // Generate the HTML with embedded web component
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Tutorial Video'}</title>
</head>
<body>
  <tutorial-video-player
    video-id="${videoId}"
    ${title ? `title="${title.replace(/"/g, '&quot;')}"` : ''}
    ${description ? `description="${description.replace(/"/g, '&quot;')}"` : ''}
  ></tutorial-video-player>

  <script type="module">
${webComponentScript}
  </script>
</body>
</html>
    `.trim();

    return {
      content: [
        {
          type: 'text',
          text: `Displaying tutorial video: ${title || videoId}`,
        },
        {
          type: 'resource',
          resource: {
            uri: `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
            mimeType: 'text/html',
            title: title || 'Tutorial Video',
          },
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  console.error('Starting Tutorial Video MCP Server...');

  // Load the web component
  await loadWebComponent();

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await server.connect(transport);

  console.error('✓ Server started successfully!');
  console.error('  Available tools: show_tutorial_video, list_tutorial_videos');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
