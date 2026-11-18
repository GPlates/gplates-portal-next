import { D3DemoMap, type DemoView } from './D3DemoMap';
import './page.css';

const VIEWS: DemoView[] = ['coastlines', 'points', 'feature_collection'];

const isView = (value: string): value is DemoView => (VIEWS as string[]).includes(value);

/**
 * Port of service/views.py::d3_demo + service/templates/d3_map.html.
 *
 * Same `?view=` contract as the old page (`coastlines` by default), read here
 * the way /cesium reads its own, so the three demos stay one route. An
 * unrecognised view falls back to `coastlines`; the old page left such a value
 * in a half-configured state instead.
 */
export default async function D3DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const viewName = view && isView(view) ? view : 'coastlines';

  return <D3DemoMap view={viewName} />;
}
