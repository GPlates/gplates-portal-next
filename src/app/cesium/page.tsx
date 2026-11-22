import Link from 'next/link';
import { CesiumRasterTerrainViewer } from './CesiumRasterTerrainViewer';
import { DEFAULT_VIEW, resolveViewName } from './viewConfigs';
import './page.css';

// Cesium's package.json "exports" map blocks importing
// "cesium/Build/Cesium/Widgets/widgets.css" directly, so this is served from
// the copy scripts/copy-cesium-assets.mjs places in public/cesium instead.
const CESIUM_WIDGETS_CSS = '/cesium/Widgets/widgets.css';

export default async function CesiumPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const requested = view ?? DEFAULT_VIEW;
  // old links use some keys that are now aliases, ?view=rift among them
  const viewName = resolveViewName(requested);

  if (!viewName) {
    return (
      <main className="cesium-view-fallback">
        <p>The &quot;{requested}&quot; 3D view is not available yet.</p>
        <Link href="/">Back to the portal</Link>
      </main>
    );
  }

  return (
    <>
      <link rel="stylesheet" href={CESIUM_WIDGETS_CSS} />
      <CesiumRasterTerrainViewer initialView={viewName} />
    </>
  );
}
