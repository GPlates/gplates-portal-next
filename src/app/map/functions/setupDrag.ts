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

/** drag: rotate the globe, or pan a flat map, and re-project everything drawn */
export const setupDrag = (svgRef: SvgRef, projection: MapProjection) => {
  const svgEl = svgRef.current;
  if (!isReady(projection) || !svgEl) {
    return;
  }
  const { name, proj } = projection;
  const svg = d3.select(svgEl);

  svg.call(
    d3.drag<SVGSVGElement, unknown>().on("drag", (event) => {
      if (name.toLowerCase() == "orthographic") {
        const sensitivity = 75;
        const rotate = proj.rotate();
        const k = sensitivity / proj.scale();
        proj.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);

        //hide the label when it is on the other side of the globe
        svg.selectAll<SVGTextElement, LabelDatum>(".point-label").attr("display", function (d) {
          //get the location of the label
          const point = d3.geoPath().projection(proj)(
            d3.geoCircle().center([d[0], d[1]]).radius(1).precision(10)()
          );
          //if the location is not visible, not show label
          if (point != null) {
            return "inline";
          } else {
            return "none";
          }
        });

        //calculate the new geoCircle path with an appropiate radius
        svg.selectAll<SVGPathElement, PathPointDatum>(".path-point").attr("d", function (d) {
          const scale0 = (svgEl.clientWidth - 40) / 4;
          return d3.geoPath().projection(proj)(
            d3
              .geoCircle()
              .center([d[0], d[1]])
              .radius((d[2] / proj.scale()) * scale0)
              .precision(10)()
          );
        });
      } else {
        // for rectangular projection
        const translate = proj.translate();
        const tx = event.dx + translate[0];
        const ty = event.dy + translate[1];
        proj.translate([tx, ty]);
      }

      const path = d3.geoPath().projection(proj);
      //coastline and graticule do not need special treatement
      svg.selectAll<SVGPathElement, d3.GeoPermissibleObjects>(".coastline").attr("d", path);
      svg.selectAll<SVGPathElement, d3.GeoPermissibleObjects>(".graticule").attr("d", path);

      //move the circle points to the new locations
      svg
        .selectAll<SVGCircleElement, CirclePointDatum>(".circle-point")
        .attr("cx", (d) => projectX(proj, d))
        .attr("cy", (d) => projectY(proj, d));

      //move the point labels to the new locations
      svg
        .selectAll<SVGTextElement, LabelDatum>(".point-label")
        .attr("x", (d) => projectX(proj, d))
        .attr("y", (d) => projectY(proj, d));
    })
  );
};
