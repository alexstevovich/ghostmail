import { build } from 'esbuild';
import fs from 'fs/promises';

async function buildProject() {
    console.log('🚀 Building project...');

    // Build CJS version (CJS)
    await build({
        entryPoints: ['src/index.js'],
        outfile: 'gen/index.cjs',
        format: 'cjs',
        platform: 'node',
        sourcemap: false,
    });

    console.log('✅ CJS Build Complete: gen/index.cjs');
}

buildProject().catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
