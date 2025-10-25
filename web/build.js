import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
  try {
    console.log('Building web component...');

    await esbuild.build({
      entryPoints: [join(__dirname, 'src', 'index.js')],
      bundle: true,
      minify: true,
      format: 'esm',
      target: 'es2020',
      outfile: join(__dirname, 'dist', 'tutorial-video-player.js'),
      sourcemap: true,
    });

    console.log('✓ Web component built successfully!');
    console.log('  Output: web/dist/tutorial-video-player.js');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
