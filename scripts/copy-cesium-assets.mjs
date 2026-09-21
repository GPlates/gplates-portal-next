// Copies Cesium's static runtime assets (Workers, Assets, Widgets, ThirdParty)
// out of node_modules into public/cesium, where CESIUM_BASE_URL points.
// Next.js has no webpack-asset-copy step of its own (unlike craco-cesium for CRA),
// so this has to be done as an explicit pre-dev/pre-build step.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'node_modules', 'cesium', 'Build', 'Cesium');
const dest = join(__dirname, '..', 'public', 'cesium');

if (!existsSync(src)) {
  console.error(`[copy-cesium-assets] cesium package not found at ${src}`);
  process.exit(1);
}

for (const folder of ['Assets', 'ThirdParty', 'Widgets', 'Workers']) {
  const from = join(src, folder);
  const to = join(dest, folder);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

console.log(`[copy-cesium-assets] copied Cesium static assets to ${dest}`);
