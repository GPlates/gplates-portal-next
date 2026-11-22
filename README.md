# GPlates Portal Next.js

A separate frontend app for gradually migrating the legacy Django portal to a modern Next.js interface.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Notes

- This project is intentionally isolated from the legacy Django repo.
- Keep it as a frontend shell while old pages are migrated one by one.
- Connect it to the GPlates web service API as endpoints are extracted.

## Paleomap Maker (`/map`)

The new Paleomap Maker (previously the separate `michaelchin/new-paleomap-maker` repo) now lives under `src/app/map`, merged with its full git history:

- `/map` – paleomap maker
- `/map/r12ntree` – reconstruction tree
- `/map/timescale` – geological timescale

These pages use Tailwind CSS (config in `tailwind.config.js`, scoped to `src/app/map`), d3 and react-ga4. The rest of the portal does not load Tailwind. The ported files still carry `// @ts-nocheck` because they were written for non-strict TypeScript; remove it as each file gets proper types.

## Dynamic topography (`/dynamic_topography_cesium`)

The viewer (rewritten without Dojo), plus the model lists at `/portal/dt` and `/portal/dynamic_topography_model_list`. Old `?model=...&name=...` links still work.

- **Model list**: `src/lib/dynamicTopography/models.json`, built from the old portal by `scripts/build_dt_models.py`. Public models only.
- **Profile**: generated sample values for now, labelled as such in the chart and the CSV. Set `NEXT_PUBLIC_DT_PROFILE_SOURCE=gws` once GWS has the endpoint described in `docs/dynamic-topography-gws-api.md`.
- **Globe images**: still served by the old portal, through the `/legacy-portal` rewrite in `next.config.mjs` (it sends no CORS header). After the JPEGs are copied to the data server, set `NEXT_PUBLIC_DT_RASTER_SOURCE=tiles` and remove the rewrite.
