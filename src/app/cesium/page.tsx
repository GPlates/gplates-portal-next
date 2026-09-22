import { CesiumRasterTerrainViewer } from './CesiumRasterTerrainViewer';
import { DEFAULT_VIEW, isViewName } from './viewConfigs';
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
  const viewName = view ?? DEFAULT_VIEW;

  if (!isViewName(viewName)) {
    return (
      <main className="cesium-view-fallback">
        <p>The &quot;{viewName}&quot; 3D view is not available yet.</p>
        <a href="/">Back to the portal</a>
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
