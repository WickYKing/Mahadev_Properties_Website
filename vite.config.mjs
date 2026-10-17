import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const htmlFiles = readdirSync(root).filter((file) => file.endsWith('.html'));
const input = Object.fromEntries(
  htmlFiles.map((file) => [basename(file, '.html'), resolve(root, file)]),
);

export default defineConfig(({ command }) => {
  const leadEndpoint = process.env.LEAD_ENDPOINT || '';

  if (
    command === 'build' &&
    !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(leadEndpoint)
  ) {
    throw new Error('LEAD_ENDPOINT must be a valid Google Apps Script Web App /exec URL.');
  }

  return {
    // Relative asset URLs work on the custom domain and on GitHub preview URLs.
    base: './',
    publicDir: 'public',
    define: {
      __LEAD_ENDPOINT__: JSON.stringify(leadEndpoint),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: true,
      cssMinify: true,
      rollupOptions: {
        input,
      },
    },
  };
});
