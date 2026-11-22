import * as d3 from "d3";
import {
  CirclePointDatum,
  LabelDatum,
  MapProjection,
  PathPointDatum,
  projectX,
  projectY,
} from "../types";

/**
 * Draw a point and its label into a layer: a small circle polygon on the
 * globe (so it is clipped on the far side), an SVG circle on a flat map.
 */
export const drawPoint = (
  layer: d3.Selection<SVGGElement, unknown, null, undefined>,
  projection: MapProjection,
  lon: number,
  lat: number,
  label: string = "",
  radius: number = 1,
  className: string = ""
) => {
  const proj = projection.proj;
  const projName = projection.name;

  if (proj == null || projName == null) {
    return;
  }
  if (projName.toLowerCase() == "orthographic") {
    layer
      .append("path")
      .datum<PathPointDatum>([lon, lat, radius])
      .attr("d", function (d) {
        return d3.geoPath().projection(proj)(
          d3.geoCircle().center([d[0], d[1]]).radius(d[2]).precision(10)()
        );
      })
      .attr("class", "path-point " + className)
      .append("svg:title")
      .text(function (d) {
        return "Longitude: " + d[0] + "\nLatitude: " + d[1];
      });
  } else {
    layer
      .append("circle")
      .datum<CirclePointDatum>([lon, lat])
      .attr("cx", (d) => projectX(proj, d))
      .attr("cy", (d) => projectY(proj, d))
      .attr("r", 5)
      .style("fill", "blue")
      .attr("class", "circle-point " + className)
      .append("svg:title")
      .text(function (d) {
        return "Longitude: " + d[0] + "\nLatitude: " + d[1];
      });
  }

  // add point label
  layer
    .append("text")
    .datum<LabelDatum>([lon, lat, label])
    .attr("x", (d) => projectX(proj, d))
    .attr("y", (d) => projectY(proj, d))
    .text(function (d) {
      return d[2];
    })
    .attr("class", "point-label")
    .style("font-size", "14px");
};
