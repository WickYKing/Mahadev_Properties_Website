import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
if (!existsSync(dist)) throw new Error('dist/ does not exist. Run npm run build first.');

const forbiddenFiles = new Set([
  'style.css',
  'script.js',
  'config.js',
  'lead-capture.gs',
  'CONNECT-GOOGLE-SHEET.txt',
  'CONNECTION-STATUS.txt',
  'OPEN-WEBSITE.cmd',
  'README.txt',
  'START-HERE.txt',
]);
const forbiddenReferences = [
  'src="config.js"',
  'src="script.js"',
  'href="style.css"',
  'sourceMappingURL=',
];

const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(dist);

for (const file of files) {
  const rel = relative(dist, file).replaceAll('\\', '/');
  const base = rel.split('/').at(-1);
  if (forbiddenFiles.has(rel) || forbiddenFiles.has(base)) {
    throw new Error(`Forbidden source file was published: ${rel}`);
  }

  if (/\.(html|js|css|map|txt)$/i.test(file)) {
    const content = readFileSync(file, 'utf8');
    for (const token of forbiddenReferences) {
      if (content.includes(token)) {
        throw new Error(`Forbidden source reference ${token} found in ${rel}`);
      }
    }
  }
}

const maps = files.filter((file) => file.endsWith('.map'));
if (maps.length) throw new Error(`Source maps must not be published: ${maps.join(', ')}`);

const html = files.filter((file) => file.endsWith('.html'));
const js = files.filter((file) => /\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.js$/.test(file));
const css = files.filter((file) => /\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.css$/.test(file));

if (html.length !== 10) throw new Error(`Expected 10 HTML pages, found ${html.length}.`);
if (js.length < 1) throw new Error('No hashed production JavaScript bundle found.');
if (css.length < 1) throw new Error('No hashed production CSS bundle found.');

console.log(
  `Build verification passed: ${html.length} HTML pages, ${js.length} hashed JS bundle(s), ${css.length} hashed CSS bundle(s), no source maps or original source filenames.`,
);
