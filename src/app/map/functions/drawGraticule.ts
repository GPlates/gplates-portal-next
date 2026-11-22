import * as d3 from "d3";
import { MapProjection, SvgRef, isReady } from "../types";

export const drawGraticule = (svgRef: SvgRef, projection: MapProjection) => {
  if (!isReady(projection) || !svgRef.current) {
    return;
  }

  const svg = d3.select(svgRef.current);

  const path = d3.geoPath().projection(projection.proj);

  svg.selectAll(".graticules").remove();

  const graticuleLayer = svg
    .append("g")
    .attr("class", "graticules")
    .style("fill", "none")
    .style("stroke", "#777")
    .style("stroke-width", "0.5px")
    .style("stroke-opacity", "0.5");

  const graticule = d3.geoGraticule();
  graticuleLayer
    .append("path")
    .datum(graticule())
    .attr("class", "graticule")
    .attr("d", path);
};
