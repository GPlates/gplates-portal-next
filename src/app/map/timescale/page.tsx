"use client";

import * as d3 from "d3";
import { Button } from "../components/ui";
import React, { useEffect } from "react";
import ReactGA from "react-ga4";

ReactGA.initialize("G-SK40RD0DHH");

/** a node of public/json/timescale-gsa-0.6.json: an eon, era, period... */
type TimescaleNode = {
  name: string;
  children: TimescaleNode[];
  color?: string;
  /** Ma */
  begin?: number;
  end?: number;
  size?: number;
  size_factor?: number;
  value?: number;
};

type Cell = d3.HierarchyRectangularNode<TimescaleNode>;

const findSubTree = (root: TimescaleNode, name: string) => {
  let ret: TimescaleNode = root;

  depth_first_search(root, (node) => {
    if (node.name.toString() == name) {
      ret = node;
      return false;
    }
    return true;
  });

  return ret;
};

/** visit every node; returning false from the callback skips that node's subtree */
const depth_first_search = (
  tree: TimescaleNode,
  callback: (node: TimescaleNode) => boolean
) => {
  const ret = callback(tree);
  if (!ret) {
    return;
  }
  for (let i = 0; i < tree.children.length; i++) {
    depth_first_search(tree.children[i], callback);
  }
};

/**
 * The geological timescale: a clickable icicle chart of the GSA timescale
 * (drill into an eon, era or period; breadcrumbs to go back), and the GSA
 * v0.6 chart split into four downloadable SVGs.
 */
const TimescalePage = () => {
  const timescaleContainerDiv = React.useRef<HTMLDivElement>(null);
  const timescaleIcicleContainerDiv = React.useRef<HTMLDivElement>(null);
  const timescaleData = React.useRef<TimescaleNode | null>(null);

  const drawTimescalePlot = (data: TimescaleNode) => {
    const container = timescaleIcicleContainerDiv.current;
    //do not redraw the svg if it has already been done.
    if (!container || container.querySelector("svg") != null) {
      return;
    }

    let breadcrumbs = ["root"];

    const height = 600,
      width = 240;

    const paddingTop = 5,
      paddingBottom = 5;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height + paddingBottom + paddingTop)
      .attr("id", "timescale-icicle-svg")
      .style("display", "block")
      .style("margin", "10px auto")
      .style("background", "red");

    // add left panel
    const leftPanel = svg.append("g").attr("class", "left-panel");
    const leftPanelWidth = 20;
    leftPanel
      .append("rect")
      .attr("width", leftPanelWidth)
      .attr("height", height + paddingBottom + paddingTop)
      .attr("fill-opacity", 1)
      .attr("fill", "cyan")
      .attr("transform", `translate(0 ,0)`);

    // add left panel
    const rightPanelWidth = 40;
    const rightPanel = svg
      .append("g")
      .attr("class", "right-panel")
      .attr("transform", `translate(${width - rightPanelWidth},0)`);
    rightPanel
      .append("rect")
      .attr("width", rightPanelWidth)
      .attr("height", height + paddingBottom + paddingTop)
      .attr("fill-opacity", 1)
      .attr("fill", "lightgrey");

    const gY = rightPanel.append("g").attr("class", "y-axis");

    // add breadcrumbs
    const gBreadcrumbs = leftPanel
      .append("g")
      .attr("class", "g-breadcrumbs")
      .attr("transform", "rotate(90) translate(20,-5)");
    const breadcrumbsTxt = gBreadcrumbs.append("text");
    const updateBreadcrumbs = () => {
      breadcrumbsTxt.selectAll(".breadcrumbs").remove();
      for (let i = 0; i < breadcrumbs.length; i++) {
        breadcrumbsTxt
          .append("tspan")
          .attr("class", "breadcrumbs")
          .text(breadcrumbs[i])
          .attr("text-decoration", () => {
            if (i < breadcrumbs.length - 1) {
              return "underline";
            } else {
              return "";
            }
          })
          .style("cursor", () => {
            if (i < breadcrumbs.length - 1) {
              return "pointer";
            } else {
              return "";
            }
          })
          .on("click", (e: MouseEvent) =>
            breadcrumbsClicked((e.target as SVGTSpanElement).innerHTML)
          );
        breadcrumbsTxt
          .append("tspan")
          .attr("class", "breadcrumbs")
          .text(" >> ");
      }
    };

    // Add a clipPath: everything out of this area won't be drawn.
    svg
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width - leftPanelWidth - rightPanelWidth)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // add central panel
    const centralPanel = svg
      .append("g")
      .attr("class", "central-panel")
      .attr("transform", `translate(${leftPanelWidth},${paddingTop})`)
      .attr("clip-path", "url(#clip)");

    const gTimescaleCells = centralPanel
      .append("g")
      .attr("class", "timescale-cells");

    const update = (
      timescaleGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      data: TimescaleNode
    ) => {
      svg.selectAll(".timescale-cell").remove();

      // Compute the layout.
      const hierarchy = d3.hierarchy(data).sum((d) => {
        if (d.children.length > 0) {
          return 0;
        } else {
          let size = 1;
          if (d.size) {
            size = d.size;
          } else {
            if (d.begin && d.end) {
              size = d.begin - d.end;
            }
          }

          if (d.size_factor) {
            return size * d.size_factor;
          } else {
            return size;
          }
        }
      });

      const _root = d3
        .partition<TimescaleNode>()
        .size([
          height,
          (hierarchy.height + 1) * (width - rightPanelWidth - leftPanelWidth),
        ])(hierarchy);

      // add timescale cells.
      const cell = timescaleGroup
        .selectAll<SVGGElement, Cell>(".timescale-cell")
        .data(_root.descendants())
        .enter()
        .append("g")
        .attr("class", "timescale-cell")
        .attr(
          "transform",
          (d) =>
            `translate(${d.y0 - width + rightPanelWidth + leftPanelWidth},${
              d.x0
            })`
        );

      const domainArray: number[] = [],
        rangeArray: number[] = [];
      cell
        .append("rect")
        .attr("width", (d) => d.y1 - d.y0)
        .attr("height", (d) => {
          if (d.depth == 1) {
            if (rangeArray.length > 1 && domainArray.length > 1) {
              rangeArray.pop();
              domainArray.pop();
            }
            rangeArray.push(d.x0 + paddingTop);
            domainArray.push(d.data.end!);
            rangeArray.push(d.x1 + paddingTop);
            domainArray.push(d.data.begin!);
          }
          return d.x1 - d.x0;
        })
        .attr("fill-opacity", 1)
        .attr("fill", (d) => d.data.color ?? null)
        .style("cursor", (d) => {
          if (d.data.children.length) {
            return "pointer";
          } else {
            return "";
          }
        })
        .on("click", cellClicked);

      const fontSize = Number(
        window
          .getComputedStyle(cell.node()!)
          .getPropertyValue("font-size")
          .match(/\d+/)![0]
      );
      cell
        .append("text")
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .attr("x", (d) => (d.y1 - d.y0) / 2)
        .attr("y", (d) => (d.x1 - d.x0 + fontSize) / 2)
        .attr("text-anchor", "middle")
        .text((d) => d.data.name);
      updateYAxis(rangeArray, domainArray);
    };

    /** drill into a cell that has children */
    function cellClicked(event: MouseEvent, node: Cell) {
      if (node.data.children.length > 0) {
        update(gTimescaleCells, node.data);
        breadcrumbs.push(node.data.name);
        updateBreadcrumbs();
      }
    }

    /** go back up to an ancestor named in the breadcrumbs */
    function breadcrumbsClicked(name: string) {
      const subtree = findSubTree(data, name);
      update(gTimescaleCells, subtree);
      const newBreadcrumbs: string[] = [];
      for (let i = 0; i < breadcrumbs.length; i++) {
        newBreadcrumbs.push(breadcrumbs[i]);
        if (name == breadcrumbs[i]) {
          break;
        }
      }
      breadcrumbs = newBreadcrumbs;
      updateBreadcrumbs();
    }

    function updateYAxis(rangeArray: number[], domainArray: number[]) {
      const y = d3.scaleLinear().range(rangeArray);
      y.domain(domainArray);
      if (domainArray[domainArray.length - 1] > 4000) {
        domainArray.pop();
      }
      const yAxis = d3
        .axisRight(y)
        .tickValues(domainArray)
        .tickFormat((v) => d3.format(".2~f")(v));
      gY.call(yAxis);
    }

    update(gTimescaleCells, data);
    updateBreadcrumbs();
  };

  useEffect(() => {
    //draw the time scale icicle
    d3.json<TimescaleNode>("/json/timescale-gsa-0.6.json")
      .then((data) => {
        if (!data) return;
        timescaleData.current = data;
        drawTimescalePlot(data);
      })
      .catch((e) => console.log(e));

    //draw GSA time scale v0.6....
    const containerEl = timescaleContainerDiv.current;
    if (!containerEl) return;
    const svgContainer = d3.select(containerEl);
    d3.xml("/svg/timescl.svg").then((data) => {
      if (containerEl.querySelector("svg") == null) {
        containerEl.append(data.documentElement);
        const oldSVG = svgContainer.select<SVGSVGElement>("svg");

        const ids = ["cenozoic", "mesozoic", "paleozoic", "precambrian"];
        const xTranlate = [-38, -232, -421, -582.5];
        const xWidth = [190, 185, 156, 170.5];

        for (let i = 0; i < ids.length; i++) {
          const newSVG = svgContainer
            .append("svg")
            .attr("width", xWidth[i])
            .attr("height", "463")
            .attr("id", ids[i] + "-svg")
            .style("display", "inline-block")
            .style("margin", "10px");

          newSVG
            .append("rect")
            .attr("width", xWidth[i])
            .attr("height", "463")
            .attr("fill", "white");

          const group = newSVG
            .append("g")
            .attr("transform", "translate(" + xTranlate[i] + ", -60)");

          // copy the paths and labels that fall inside this era's box
          const bigNode = oldSVG.select<SVGGraphicsElement>("#" + ids[i]).node()!;
          const bigBbox = bigNode.getBoundingClientRect();

          const allPath = oldSVG.selectAll<SVGPathElement, unknown>("path");

          allPath.each(function () {
            const bbox = this.getBoundingClientRect();
            if (
              bbox.x > bigBbox.x - 1 &&
              bbox.x < bigBbox.x + bigBbox.width + 1 &&
              bbox.y >= bigBbox.y - 1 &&
              bbox.y <= bigBbox.y + bigBbox.height + 1
            ) {
              group.append(() => d3.select(this).clone(true).node());
            }
          });

          const allText = oldSVG.selectAll<SVGTextElement, unknown>("text");
          allText.each(function () {
            const bbox = this.getBoundingClientRect();
            if (bbox.width > 200) {
              group.append(() => d3.select(this).clone(true).node());
            } else if (
              bbox.x >= bigBbox.x &&
              bbox.x <= bigBbox.x + bigBbox.width &&
              bbox.y >= bigBbox.y &&
              bbox.y <= bigBbox.y + bigBbox.height
            ) {
              group.append(() => d3.select(this).clone(true).node());
            }
          });
        }
      }
    });

    // runs once
  }, []);

  const handleDownloadButtonClicked = (name: string) => {
    const svgData = document.getElementById(name + "-svg");
    if (!svgData) return;
    const svgString = new XMLSerializer().serializeToString(svgData);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadJSON = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(timescaleData.current)], { type: "application/json" })
    );
    a.download = "timescale-gsa-v0.6.json";
    a.click();
  };

  return (
    <>
      <div
        ref={timescaleIcicleContainerDiv}
        id="timescale-icicle-container"
        style={{
          marginRight: "0px",
          marginLeft: "0px",
        }}
      ></div>
      <div
        ref={timescaleContainerDiv}
        id="timescale-container"
        style={{
          marginRight: "0px",
          marginLeft: "0px",
          background: "lightgrey",
        }}
      ></div>
      <div className="flex flex-wrap gap-2" style={{ width: "800px" }}>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("cenozoic")}
        >
          Download cenozoic
        </Button>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("mesozoic")}
        >
          Download mesozoic
        </Button>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("paleozoic")}
        >
          Download paleozoic
        </Button>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("precambrian")}
        >
          Download precambrian
        </Button>
        {false && (
          <Button
            className="download-btn"
            size="sm"
            color="blue"
            onClick={() => downloadJSON()}
          >
            Download Timescale JSON
          </Button>
        )}
      </div>
    </>
  );
};

export default TimescalePage;
