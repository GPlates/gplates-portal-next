#!/usr/bin/env python3
"""
Local dev stand-in for the real tile server: serves raster_tiles/ and
terrain_tiles/ (see GPlatesImageryProvider.ts / GPlatesTerrainProvider.ts)
with Access-Control-Allow-Origin set, since plain `python3 -m http.server`
sends no CORS headers and the Next.js dev server runs on a different origin
(localhost:3000 vs this server's localhost:8000).

Usage (run from the directory that directly contains raster_tiles/ and
terrain_tiles/, matching TILE_SERVER_URL in gplates-portal-next):

    python3 scripts/serve_tiles_cors.py [port]   # default port 8000

Or point it at a data directory elsewhere without cd'ing there:

    python3 scripts/serve_tiles_cors.py [port] --directory /path/to/data
"""

#python3 scripts/serve_tiles_cors.py 8000 --directory /Users/mchin/workspace/gplates-portal-upgrade/gplates-portal-home/data

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # "*" is fine here: every request from GPlatesImageryProvider/
        # GPlatesTerrainProvider is an unauthenticated simple GET (no cookies,
        # no custom headers besides the CORS-safelisted "Accept"), so this
        # never needs to be a specific origin or paired with
        # Access-Control-Allow-Credentials.
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


if __name__ == "__main__":
    args = sys.argv[1:]
    directory = None
    if "--directory" in args:
        i = args.index("--directory")
        directory = args[i + 1]
        del args[i : i + 2]

    port = int(args[0]) if args else 8000
    handler = partial(CORSRequestHandler, directory=directory)
    server = ThreadingHTTPServer(("", port), handler)
    print(f"Serving {directory or '.'} on http://localhost:{port} with CORS enabled")
    server.serve_forever()
