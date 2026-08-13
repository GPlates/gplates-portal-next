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
