import { CesiumTopo15Viewer } from './CesiumTopo15Viewer';
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

  if (view !== 'topo15') {
    return (
      <main className="cesium-topo15-fallback">
        <p>
          {view ? `The "${view}" 3D view is not available yet.` : 'No view was specified.'}
        </p>
        <a href="/">Back to the portal</a>
      </main>
    );
  }

  return (
    <>
      <link rel="stylesheet" href={CESIUM_WIDGETS_CSS} />
      <CesiumTopo15Viewer />
    </>
  );
}
