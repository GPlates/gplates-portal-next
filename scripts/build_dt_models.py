#!/usr/bin/env python3
"""
Build src/lib/dynamicTopography/models.json, the dynamic topography model
catalogue the viewer and the two model list pages read.

On the old portal this lived in Postgres: portal/dynamic_topography_models.py
(`reset_db`) loaded the models, references and access lists, and
portal/dynamic_topography.py worked out each model's time steps by listing the
.nc grids on disk. Neither is reachable from the new site, so this script
reads the first from the old repo and asks the live old portal for the second.

Only public models are kept: the new portal has no login yet (see the accounts
issue), so private models stay on the old site for now.

Usage:
    python3 scripts/build_dt_models.py ../gplates-portal/portal/dynamic_topography_models.py
"""

import ast
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

OLD_PORTAL = "https://portal.gplates.org"
OUT = Path(__file__).resolve().parent.parent / "src/lib/dynamicTopography/models.json"

# portal/dynamic_topography.py::show only offered "Download Grids" and
# "Download Reconstruction Files" links for these
DOWNLOADABLE = {
    "gld21", "terra", "gld51", "gld24", "gld31", "gld34", "gld71", "gld72",
    "gld136", "gld134", "gld112", "gld119", "gld115", "gld115n", "gld98",
    "gld95", "gld89", "gld108", "gld107", "gld189", "gld241", "M1", "M2",
    "M3", "M4", "gld321", "gld324", "gld118", "gld428", "M5", "M6", "M7",
    "M7Rate", "ngrand", "s20rts", "smean", "C1", "C1s", "C2", "C3", "C4",
    "C5", "C6", "gmcm9", "gld428_m21",
}

# portal/dynamic_topography.py::show picked the legend per model
LEGENDS = {"gld115": "/img/dt-legend-gld115.png", "M7Rate": "/img/dt-rate-legend.png"}


def parse_seed(src):
    models = ast.literal_eval(re.search(r"models = (\{.*?\n    \})\n", src, re.S).group(1))

    refs = {}
    for name, title, ref_html in re.findall(
        r'Reference\(\s*name="([^"]+)",\s*title="([^"]+)",.*?html="""(.*?)"""', src, re.S
    ):
        refs[name] = {"name": name, "title": title, "html": " ".join(ref_html.split())}

    ref_keys = {}
    for keys, name in re.findall(
        r'if key in \[([^\]]*)\]:\s*\n\s*dt\.refs\.add\(\s*Reference\.objects\.get\(name__iexact="([^"]+)"\)',
        src,
        re.S,
    ):
        for key in re.findall(r'"([^"]+)"', keys):
            ref_keys.setdefault(key, []).append(name)

    return models, refs, ref_keys


def fetch_times(model_id):
    """The time steps and whether a continent-only (masked) set exists."""
    page = urllib.request.urlopen(
        f"{OLD_PORTAL}/dynamic_topography_cesium/?model={model_id}", timeout=60
    ).read().decode()
    seq = re.search(r'data-time-sequence="([^"]*)"', page).group(1)
    return json.loads(html.unescape(seq))["time_seq"], 'id="plateFrameRefCO"' in page


def main():
    models, refs, ref_keys = parse_seed(Path(sys.argv[1]).read_text(encoding="utf-8"))

    entries, info = [], {}
    for key, cfg in models.items():
        if "public" not in cfg.get("users", []):
            continue
        model_id = key.split("__")[0]
        # one model can appear more than once, under a different name per paper
        entries.append(
            {"id": model_id, "name": cfg["long_name"].strip(), "refs": ref_keys.get(key, [])}
        )
        if model_id not in info:
            times, masked = fetch_times(model_id)
            info[model_id] = {
                # kept as strings: they are the grid file names on the server
                "times": times,
                "continentOnly": masked,
                "downloads": model_id in DOWNLOADABLE,
                "legend": LEGENDS.get(model_id, "/img/dt-legend.png"),
                "unit": "m/Ma" if model_id == "M7Rate" else "m",
            }
            print(model_id, len(times), file=sys.stderr)

    used = {name for e in entries for name in e["refs"]}
    out = {
        "references": [r for name, r in refs.items() if name in used and name != "Unpublished"],
        "entries": sorted(entries, key=lambda e: e["name"].lower()),
        "models": info,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({len(entries)} entries, {len(info)} models)", file=sys.stderr)


if __name__ == "__main__":
    main()
