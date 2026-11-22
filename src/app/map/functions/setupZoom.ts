import * as d3 from "d3";
import {
  CirclePointDatum,
  LabelDatum,
  MapProjection,
  PathPointDatum,
  SvgRef,
  isReady,
  projectX,
  projectY,
} from "../types";

/** wheel/pinch zoom: rescale the projection and re-project everything drawn */
export const setupZoom = (svgRef: SvgRef, projection: MapProjection) => {
  const svgEl = svgRef.current;
  if (!isReady(projection) || !svgEl) {
    return;
  }
  const { name, proj } = projection;
  const svg = d3.select(svgEl);
  const svgWidth = svgEl.clientWidth;

  let scale0: number;
  if (name.toLowerCase() != "orthographic") {
    scale0 = (svgWidth - 1) / 2 / Math.PI;
  } else {
    scale0 = (svgWidth - 40) / 4;
  }

  const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", function (event) {
    if (event.transform.k > 0.5) {
      proj.scale(scale0 * event.transform.k);
      const path = d3.geoPath().projection(proj);
      svg.selectAll<SVGPathElement, d3.GeoPermissibleObjects>(".coastline").attr("d", path);
      svg.selectAll<SVGPathElement, d3.GeoPermissibleObjects>(".graticule").attr("d", path);

      if (name.toLowerCase() == "orthographic") {
        //keep the size of points in a globe projection
        svg.selectAll<SVGPathElement, PathPointDatum>(".path-point").attr("d", function (d) {
          return d3.geoPath().projection(proj)(
            d3
              .geoCircle()
              .center([d[0], d[1]])
              .radius(d[2] / event.transform.k)
              .precision(10)()
          );
        });
      } else {
        // move the points to new locations after zooming in a rectangular projection
        svg
          .selectAll<SVGCircleElement, CirclePointDatum>(".circle-point")
          .attr("cx", (d) => projectX(proj, d))
          .attr("cy", (d) => projectY(proj, d));
      }

      //move the point labels to the new locations
      svg
        .selectAll<SVGTextElement, LabelDatum>(".point-label")
        .attr("x", (d) => projectX(proj, d))
        .attr("y", (d) => projectY(proj, d));
    }
  });

  svg.call(zoom);
};
