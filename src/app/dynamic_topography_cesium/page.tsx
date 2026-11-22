import type { Metadata } from 'next';
import { MODELS, MODEL_ENTRIES } from '../../lib/dynamicTopography/service';
import { DynamicTopographyViewer } from './DynamicTopographyViewer';
import '../cesium/page.css';
import './page.css';

// served from the copy scripts/copy-cesium-assets.mjs places in public/cesium
const CESIUM_WIDGETS_CSS = '/cesium/Widgets/widgets.css';

export const metadata: Metadata = { title: 'Dynamic Topography - GPlates Portal' };

/**
 * Same URL as the old portal, /dynamic_topography_cesium/?model=gld21&name=...,
 * so existing links and bookmarks keep working.
 */
export default async function DynamicTopographyViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; name?: string }>;
}) {
  const { model, name } = await searchParams;

  if (!model || !MODELS[model]) {
    return (
      <main className="cesium-view-fallback">
        <p>
          {model
            ? `The dynamic topography model "${model}" is not available here.`
            : 'No dynamic topography model was given.'}
        </p>
        <a href="/portal/dt/">See the available models</a>
      </main>
    );
  }

  // the old page took the display name from ?name= when given, since one model
  // is listed under different names in different papers
  const title = name || MODEL_ENTRIES.find((e) => e.id === model)?.name || model;

  return (
    <>
      <link rel="stylesheet" href={CESIUM_WIDGETS_CSS} />
      <DynamicTopographyViewer modelId={model} name={title} />
    </>
  );
}
