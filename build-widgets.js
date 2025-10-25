import { mkdir, copyFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = join(__dirname, 'src', 'widgets');
const ASSETS_DIR = join(__dirname, 'assets');

async function buildWidgets() {
  try {
    console.log('Building widgets...');

    // Create assets directory if it doesn't exist
    await mkdir(ASSETS_DIR, { recursive: true });
    console.log('✓ Assets directory created/verified');

    // Read all files from src/widgets
    const files = await readdir(SRC_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    console.log(`Found ${htmlFiles.length} widget(s) to build`);

    // Copy each widget to assets
    for (const file of htmlFiles) {
      const srcPath = join(SRC_DIR, file);
      const destPath = join(ASSETS_DIR, file);

      await copyFile(srcPath, destPath);
      console.log(`  ✓ Built: ${file}`);
    }

    console.log('\n✅ All widgets built successfully!');
    console.log(`   Output: assets/`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildWidgets();
