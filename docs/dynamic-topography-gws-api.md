# Dynamic topography profile — GWS endpoint

What the new dynamic topography viewer (`/dynamic_topography_cesium/`) expects from GPlates Web Service. It replaces the old portal's `dynamic_topography_profile` and `download_dynamic_topography_profile`, which ran `portal/DynamicTopographyProfile.py`.

Until this exists, the viewer generates sample values in the browser (`src/lib/dynamicTopography/service.ts`). Set `NEXT_PUBLIC_DT_PROFILE_SOURCE=gws` to switch to the real endpoint.

## Request

```
GET /raster/dynamic_topography/profile?model=gld21&lon=-90.00&lat=35.00&frame=plate
```

| Parameter | Meaning |
|---|---|
| `model` | Model id, e.g. `gld21`, `M7Rate` |
| `lon`, `lat` | The point, in degrees |
| `frame` | `plate` (default) or `plate_co` (continent only — the `Masked_*.nc` grids, falling back to the unmasked grid where there is none, as the old script did) |

## Response

```json
{
  "model": "gld21",
  "lon": -90.0,
  "lat": 35.0,
  "frame": "plate",
  "unit": "m",
  "times": [0, 4, 11, 15],
  "values": [-666.94, -684.15, -704.63, null]
}
```

- `times`: every grid time for the model, ascending, in Ma.
- `values`: the grid value at the point for each time, linearly interpolated (the old script used `RegularGridInterpolator(method='linear')`). `null` where there is no value; the old script also treated anything below -3000 as no value.
- `unit`: `m`, or `m/Ma` for `M7Rate`.

The CSV download is built in the browser from this response, in the old layout, so GWS doesn't need to produce CSV.

## Model list and images

Not needed from GWS:

- The model list, names and references are static data in `src/lib/dynamicTopography/models.json`, built by `scripts/build_dt_models.py`.
- The globe images are pre-rendered JPEGs. For now they come from the old portal. They should move to the data server at `DynamicTopography/Models/<id>/{PlateFrame,MantleFrame}/<time>.jpg`, with `Masked_<time>.jpg` for continent only.
