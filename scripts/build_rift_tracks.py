#!/usr/bin/env python3
"""
Build rift_tracks.json.gz, the whole dataset behind the three rift views
(?view=rift, rift_v, rift_ov) as one static file.

The old portal served these points from Postgres: portal/rift_obliquity.py
loaded data/rift_obliquity/points/{id}.csv into the RiftPoint table (reset_db),
then answered /portal/get_rift_points/?time=N with the rows at that time and
/portal/get_rift_data/?id=N with one point's whole history. The React port needs
neither Django nor Postgres -- it reads this one file and does both jobs from it,
so the output here is per-point *tracks* rather than per-time snapshots: a point's
chart and CSV download are then a slice of what is already in memory, and the
per-time point sets are built once as an index at load.

Colour and marker size are deliberately *not* in the file. The old endpoints
baked them in, which is why there were two of them -- one colouring by obliquity,
one by velocity, over identical geometry. riftColormaps.ts reproduces both
matplotlib colour maps exactly, so one file serves all three views.

Usage, from the canonical CSVs:

    python3 scripts/build_rift_tracks.py \
        --csv-dir /path/to/gplates-portal-home/data/rift_obliquity/points \
        -o rift_tracks.json.gz

or, where that data isn't to hand, from the old portal's own endpoint (which
reproduces the CSVs row for row -- verified against get_rift_data for a sample
of ids):

    python3 scripts/build_rift_tracks.py --from-portal -o rift_tracks.json.gz

Upload the result to the data server beside Animations/ and GeoJson/:

    gplates-portal-data/rift_obliquity/rift_tracks.json.gz

It is served as a plain file with no Content-Encoding, and gunzipped in the
browser by src/lib/cesium/gunzip.ts, the same way the .geojson.gz layers are.
"""

import argparse
import csv
import glob
import gzip
import json
import os
import sys
import urllib.parse
import urllib.request
from collections import defaultdict

PORTAL_URL = "https://portal.gplates.org"

# The old points are on integer Ma from the present back to the oldest rift
# frame; Rift_Low_Res, the animation they are drawn over, has exactly these 241
# frames.
TIME_MIN = 0
TIME_MAX = 240


def from_csv_dir(directory):
    """{id: {time: (lon, lat, velocity, obliquity)}} from data/rift_obliquity/points."""
    tracks = {}
    paths = sorted(glob.glob(os.path.join(directory, "*.csv")))
    if not paths:
        sys.exit(f"no .csv files in {directory}")
    for path in paths:
        name = os.path.splitext(os.path.basename(path))[0]
        if not name.isdigit():
            # _obliquity/ and _velocity/ hold the old pre-rendered plot PNGs;
            # anything else non-numeric isn't a point file either
            print(f"skipping {path}: not an id", file=sys.stderr)
            continue
        rows = {}
        with open(path, newline="") as fp:
            for row in csv.reader(fp):
                if not row or row[0].strip().lower() == "time":
                    continue
                time, lon, lat, velocity, obliquity = (float(v) for v in row[:5])
                rows[round(time)] = (lon, lat, velocity, obliquity)
        if rows:
            tracks[int(name)] = rows
    return tracks


def from_portal(base_url):
    """The same, reassembled from one /portal/get_rift_points/ call per frame."""
    tracks = defaultdict(dict)
    for time in range(TIME_MIN, TIME_MAX + 1):
        url = f"{base_url}/portal/get_rift_points/?" + urllib.parse.urlencode({"time": time})
        with urllib.request.urlopen(url, timeout=120) as response:
            data = json.load(response)
        for feature in data["features"]:
            props = feature["properties"]
            lon, lat = feature["geometry"]["coordinates"]
            tracks[props["identifier"]][time] = (
                lon,
                lat,
                props["velocity"],
                props["obliquity"],
            )
        print(f"\r{time - TIME_MIN + 1}/{TIME_MAX - TIME_MIN + 1} frames", end="", file=sys.stderr)
    print(file=sys.stderr)
    return tracks


def build(tracks):
    out = []
    for point_id in sorted(tracks):
        times = sorted(tracks[point_id])
        # 368 of the 2220 points have gaps in their history, so the times are
        # listed rather than implied by a first/last pair
        rows = [tracks[point_id][t] for t in times]
        out.append(
            {
                "id": point_id,
                "t": times,
                "lon": [round(r[0], 5) for r in rows],
                "lat": [round(r[1], 5) for r in rows],
                "v": [round(r[2], 5) for r in rows],
                "o": [round(r[3], 5) for r in rows],
            }
        )
    return {"format": "rift-tracks-1", "timeRange": [TIME_MIN, TIME_MAX], "tracks": out}


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0].strip())
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--csv-dir", help="data/rift_obliquity/points of the old portal")
    source.add_argument(
        "--from-portal",
        nargs="?",
        const=PORTAL_URL,
        metavar="BASE_URL",
        help=f"read the old portal's endpoint instead (default {PORTAL_URL})",
    )
    parser.add_argument("-o", "--output", default="rift_tracks.json.gz")
    args = parser.parse_args()

    tracks = from_csv_dir(args.csv_dir) if args.csv_dir else from_portal(args.from_portal)
    document = build(tracks)
    payload = json.dumps(document, separators=(",", ":")).encode()
    with gzip.open(args.output, "wb", compresslevel=9) as fp:
        fp.write(payload)

    points = sum(len(t["t"]) for t in document["tracks"])
    print(
        f"{args.output}: {len(document['tracks'])} tracks, {points} points, "
        f"{os.path.getsize(args.output) / 1e6:.2f} MB gzipped "
        f"({len(payload) / 1e6:.2f} MB raw)"
    )


if __name__ == "__main__":
    main()
