import * as d3 from "d3";
import { GWS_URL } from "../../../lib/gws";
import { MapProjection, SvgRef, isReady } from "../types";

/**
 * Fetch the reconstructed coastlines for a time and model from GWS and draw
 * them, replacing any already drawn. Hovering a coastline highlights it.
 */
export const drawCoastlines = async (
  svgRef: SvgRef,
  paleoAge: number,
  projection: MapProjection,
  modelName: string
) => {
  if (!isReady(projection) || !svgRef.current) return;
  const svg = d3.select(svgRef.current);
  const path = d3.geoPath().projection(projection.proj);
  svg.selectAll(".coastlines").remove();

  return d3
    .json<GeoJSON.FeatureCollection>(
      GWS_URL +
        "/reconstruct/coastlines_low/?time=" +
        paleoAge +
        "&model=" +
        modelName +
        "&avoid_map_boundary&min_area=2000"
    )
    .then(function (data) {
      if (!data) return;
      const coastlinesLayer = svg.append("g").attr("class", "coastlines");
      coastlinesLayer
        .selectAll(".coastline")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "coastline")
        .style("fill-opacity", 1)
        .style("stroke", "blue")
        .style("stroke-width", "0px")
        .style("fill", "gray")
        .on("mouseover", function () {
          d3.select(this).style("fill-opacity", 0.5);
          d3.select(this).style("stroke-width", "1px");
        })
        .on("mouseout", function () {
          d3.select(this).style("fill-opacity", 1);
          d3.select(this).style("stroke-width", "0px");
        });
    });
};
