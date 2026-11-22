"use client";

import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import { drawCities } from "../functions/drawCities";
import { drawCoastlines } from "../functions/drawCoastlines";
import { drawGraticule } from "../functions/drawGraticule";
import { getProjection } from "../functions/getProjection";
import { setupDrag } from "../functions/setupDrag";
import { setupZoom } from "../functions/setupZoom";
import { MapProjection, isReady } from "../types";

interface D3SVGPros {
  paleoAge: number;
  projName: string;
  modelName: string;
  refresh: boolean;
}

/** the map itself: coastlines, graticule and cities for one model and age */
const D3SVG: React.FC<D3SVGPros> = ({
  paleoAge,
  projName,
  modelName,
  refresh,
}: D3SVGPros) => {
  const d3SVGRef = React.useRef<SVGSVGElement>(null);

  const [projection, setProjection] = useState<MapProjection>({
    name: null,
    proj: null,
  });

  // The page flips `refresh` whenever the projection, model or age changes.
  // A new projection is sized from the SVG on screen, so it has to be built
  // here after layout rather than during render.
  useEffect(() => {
    const svgEl = d3SVGRef.current;
    if (!svgEl) return;
    setProjection({
      name: projName,
      proj: getProjection(projName, svgEl.clientHeight, svgEl.clientWidth),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    const svgEl = d3SVGRef.current;
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.attr("width", svgEl.clientWidth);
    svg.attr("height", svgEl.clientHeight);
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");
  }, []);

  // draw everything for the new projection; paleoAge and modelName changes
  // always arrive together with a new projection (see above)
  useEffect(() => {
    if (!isReady(projection)) {
      return;
    }
    setupDrag(d3SVGRef, projection);

    setupZoom(d3SVGRef, projection);

    drawCoastlines(d3SVGRef, paleoAge, projection, modelName).then(() => {
      drawGraticule(d3SVGRef, projection);
      drawCities(d3SVGRef, paleoAge, projection, modelName);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projection]);

  return (
    <div
      id="svg-container"
      style={{
        aspectRatio: "2/1",
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
        background: "white",
      }}
    >
      <svg ref={d3SVGRef} id="map-svg" width="100%" height="100%"></svg>
    </div>
  );
};

export default D3SVG;
