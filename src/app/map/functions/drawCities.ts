import * as d3 from "d3";
import { GWS_URL } from "../../../lib/gws";
import { MapProjection, SvgRef } from "../types";
import { drawPoint } from "./drawPoint";

/** GWS /earth/get_cities: parallel arrays, null where a city didn't exist yet */
type CitiesResponse = {
  names: string[];
  lons: (number | null)[];
  lats: (number | null)[];
};

export const drawCities = (
  svgRef: SvgRef,
  paleoAge: number,
  projection: MapProjection,
  modelName: string
) => {
  if (!svgRef.current) return Promise.resolve();
  const svg = d3.select(svgRef.current);
  svg.selectAll(".cities").remove();

  return d3
    .json<CitiesResponse>(
      GWS_URL +
        "/earth/get_cities?time=" +
        paleoAge +
        "&model=" +
        modelName
    )
    .then(function (data) {
      if (!data) return;
      console.assert(data.names.length == data.lons.length);
      console.assert(data.lats.length == data.lons.length);
      const cityLayer = svg.append("g").attr("class", "cities");
      for (let i = 0; i < data.names.length; i++) {
        const lon = data.lons[i];
        const lat = data.lats[i];
        if (lon == null || lat == null) continue;
        drawPoint(cityLayer, projection, lon, lat, data.names[i], 1, "city");
      }
    });
};
