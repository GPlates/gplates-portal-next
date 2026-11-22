# GPlates Portal Next.js

A separate frontend app for gradually migrating the legacy Django portal to a modern Next.js interface.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Before pushing, run `npm run lint` and `npm run typecheck`; CI runs both plus `npm run build` on every pull request.

## Notes

- This project is intentionally isolated from the legacy Django repo.
- Keep it as a frontend shell while old pages are migrated one by one.
- Connect it to the GPlates web service API as endpoints are extracted.

## Paleomap Maker (`/map`)

The new Paleomap Maker (previously the separate `michaelchin/new-paleomap-maker` repo) now lives under `src/app/map`, merged with its full git history:

- `/map` – paleomap maker
- `/map/r12ntree` – reconstruction tree
- `/map/timescale` – geological timescale

These pages use Tailwind CSS (config in `tailwind.config.js`, scoped to `src/app/map`), d3 and react-ga4. The rest of the portal does not load Tailwind. Shared types for these pages are in `src/app/map/types.ts`.
