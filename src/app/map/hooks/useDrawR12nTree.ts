import * as d3 from "d3";
import React, { useEffect } from "react";
import { GWS_URL } from "../../../lib/gws";
import type { SvgRef } from "../types";

const dx = 50;
const dy = 50;

const margin = 20;

/** a node of GWS /rotation/get_reconstruction_tree: a plate and the plates moving relative to it */
export type PlateTree = { pid: number; children: PlateTree[] };

/** GWS /earth/get_plate_names: plate id -> [name, description] */
type PlateNames = Record<string, [string, string]>;

/** a laid-out tree node, plus the key and hover-box size the drawing code attaches */
type TreeNode = d3.HierarchyPointNode<PlateTree> & { uid?: number; bbox?: DOMRect };
type TreeLink = d3.HierarchyPointLink<PlateTree> & { target: TreeNode };

let plate_names_dict: PlateNames = {};

const onNodeClick = (event: MouseEvent, d: TreeNode) => {
  void event;
  void d;
};

const clearTree = (svgRef: SvgRef) => {
  if (!svgRef.current) return;
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();
};

const drawTree = (svgRef: SvgRef, data: PlateTree) => {
  const svgEl = svgRef.current;
  if (!svgEl) return;
  const root = d3.hierarchy(data) as unknown as TreeNode;

  const tree = d3.tree<PlateTree>().nodeSize([dx, dy]);
  const diagonal = d3
    .linkVertical<{ source: [number, number]; target: [number, number] }, [number, number]>()
    .x((d) => d[0])
    .y((d) => d[1]);

  const svg = d3.select(svgEl);
  svg.selectAll("*").remove();

  const gLink = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

  const gNode = svg
    .append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

  // Compute the new tree layout.
  tree(root);

  const nodes = root.descendants().reverse() as TreeNode[];
  const links = root.links() as TreeLink[];

  const node = gNode
    .selectAll<SVGGElement, TreeNode>("g")
    .data(nodes, (d) => String(d.uid));

  root.descendants().forEach((d, i) => {
    (d as TreeNode).uid = i;
  });

  const nodeEnter = node
    .enter()
    .append("g")
    .attr("transform", () => `translate(${root.x},${root.y})`)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1)
    .on("click", (event: MouseEvent, d) => {
      onNodeClick(event, d);
    });

  nodeEnter
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .text((d) => d.data.pid.toString())
    .attr("font-size", (d) => (d.data.pid > 999 ? "0.5em" : "1em"))
    .clone(true)
    .lower()
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .attr("stroke", "white");

  // display PID name and description while mouse is over the node
  nodeEnter.on("mouseover", function (event, d) {
    const g = d3.select<SVGGElement, TreeNode>(this);
    g.style("fill", "red");

    let name = "Unknown";
    let desc = "N/A";
    if (d.data.pid.toString() in plate_names_dict) {
      const name_ = plate_names_dict[d.data.pid.toString()][0];
      const desc_ = plate_names_dict[d.data.pid.toString()][1];
      if (name_.length > 0) {
        name = name_;
      }
      if (desc_.length > 0) {
        desc = desc_;
      }
    }

    const rect = g
      .append("rect")
      .attr("class", "pid-info")
      .attr("x", 20)
      .attr("y", -15)
      .attr("height", 35)
      .style("fill", "pink");

    g
      .append("text")
      .classed("pid-info", true)
      .attr("x", 25)
      .attr("y", 0)
      .style("fill", "black")
      .html("Name: " + name)
      .call(getTextBox);

    g
      .append("text")
      .classed("pid-info", true)
      .attr("x", 25)
      .attr("y", 15)
      .style("fill", "black")
      .html("Description: " + desc)
      .call(getTextBox);

    rect.attr("width", function (d) {
      return d.bbox!.width + 10;
    });
  });

  /** remember the widest text box on the node's datum, to size the pink box */
  function getTextBox(selection: d3.Selection<SVGTextElement, TreeNode, null, undefined>) {
    selection.each(function (d) {
      if (!d.bbox || d.bbox.width < this.getBBox().width) {
        d.bbox = this.getBBox();
      }
    });
  }

  nodeEnter.on("mouseout", function () {
    d3.select(this).style("fill", null);
    d3.selectAll(".pid-info").remove();
  });

  const duration = 2500;
  // one transition shared by the nodes and links, so they move together
  const transition = svg
    .transition()
    .duration(duration) as unknown as d3.Transition<d3.BaseType, unknown, null, undefined>;

  // Transition nodes to their new position.
  node
    .merge(nodeEnter)
    .transition(transition)
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);

  // Update the links…
  const link = gLink
    .selectAll<SVGPathElement, TreeLink>("path")
    .data(links, (d) => String(d.target.uid));

  // Enter any new links at the parent's previous position.
  const linkEnter = link
    .enter()
    .append("path")
    .attr("d", () => {
      return diagonal({ source: [root.x, root.y], target: [root.x, root.y] });
    });

  // Transition links to their new position.
  link
    .merge(linkEnter)
    .transition(transition)
    .attr("d", (d) => {
      return diagonal({
        source: [d.source.x, d.source.y],
        target: [d.target.x, d.target.y],
      });
    });

  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0, 100])
    .on("zoom", zoomed);

  svg.call(zoom);

  svg.call(zoom.transform, d3.zoomIdentity.translate(svgEl.clientWidth / 2, margin));

  function zoomed({ transform }: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
    gNode.attr("transform", transform.toString());
    gLink.attr("transform", transform.toString());
  }
};

const hasValidChild = (children: PlateTree[], maxPID: number) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i].pid < maxPID) {
      return true;
    }
  }
  return false;
};

/** the plate ids, below maxPID, that have at least one child below maxPID */
const getNonLeavePIDs = (trees: PlateTree[], maxPID: number) => {
  const pids = new Set<string>();
  for (let i = 0; i < trees.length; i++) {
    depth_first_search(trees[i], (node) => {
      if (node.pid < maxPID && hasValidChild(node.children, maxPID)) {
        pids.add(node.pid.toString());
      }
      return true;
    });
  }
  return Array.from(pids).sort();
};

const findSubTree = (trees: PlateTree[], rootPID: string): PlateTree | null => {
  let ret: PlateTree | null = null;
  for (let i = 0; i < trees.length; i++) {
    depth_first_search(trees[i], (node) => {
      if (node.pid.toString() == rootPID) {
        ret = node;
        return false;
      }
      return true;
    });
  }
  return ret;
};

/** a copy of the tree without plates above maxPID (or their descendants) */
const filterTree = (tree: PlateTree, maxPID: number): PlateTree | null => {
  if (tree.pid > maxPID) {
    return null;
  }

  const newTree: PlateTree = { pid: tree.pid, children: [] };
  for (let i = 0; i < tree.children.length; i++) {
    const child = filterTree(tree.children[i], maxPID);
    if (child) {
      newTree.children.push(child);
    }
  }
  return newTree;
};

/** visit every node; returning false from the callback skips that node's subtree */
const depth_first_search = (tree: PlateTree, callback: (node: PlateTree) => boolean) => {
  const ret = callback(tree);
  if (!ret) {
    return;
  }
  for (let i = 0; i < tree.children.length; i++) {
    depth_first_search(tree.children[i], callback);
  }
};

function comparePID(a: PlateTree, b: PlateTree) {
  return a.pid - b.pid;
}

/** make sure the children will be rendered in consistent order */
const sortChildren = (tree: PlateTree) => {
  tree.children.sort(comparePID);
  for (let i = 0; i < tree.children.length; i++) {
    sortChildren(tree.children[i]);
  }
};

/*
 * Build trees from a list of [parent, child] edges, for if GWS ever returns
 * edges rather than trees again. Unused today; kept on purpose (the original
 * note said "keep the code, do not remove"):
 *
 *   const roots = findRoots(edges);
 *   const trees = roots.map((r) => ({ name: r, children: getChildren(r, edges) }));
 */
type Edge = [number, number];
type EdgeTree = { name: number; children: EdgeTree[] };

export const getChildren = (node: number, edges: Edge[]): EdgeTree[] =>
  edges
    .filter((edge) => edge[0] == node)
    .map((edge) => ({ name: edge[1], children: getChildren(edge[1], edges) }));

/** given a set of "tree edges", find the "roots": the nodes without a parent */
export const findRoots = (edges: Edge[]) => {
  const childrenSet = new Set(edges.map((edge) => edge[1]));
  return Array.from(new Set(edges.map((edge) => edge[0]))).filter((p) => !childrenSet.has(p));
};

/**
 * Fetch the reconstruction tree for a model and time from GWS and draw the
 * part under rootPid, leaving out plates above maxPID. Also reports which
 * plate ids can be chosen as a root (those with children).
 */
export const useDrawR12nTree = (
  svgRef: SvgRef,
  paleoAge: number,
  modelName: string,
  rootPid: string,
  setAllPIDs: (pids: string[]) => void,
  maxPID: number
) => {
  const [trees, setTrees] = React.useState<PlateTree[]>([]);

  useEffect(() => {
    d3.json<PlateNames>(GWS_URL + "/earth/get_plate_names").then(function (data) {
      if (data) plate_names_dict = data;
    });
  }, []);

  useEffect(() => {
    d3.json<PlateTree[]>(
      GWS_URL + "/rotation/get_reconstruction_tree/?model=" + modelName + "&time=" + paleoAge
    ).then(function (data) {
      if (!data) return;
      for (let i = 0; i < data.length; i++) {
        sortChildren(data[i]);
      }
      data.sort(comparePID);
      setTrees(data);
    });
  }, [paleoAge, modelName]);

  useEffect(() => {
    if (trees.length > 0) {
      const subtree = findSubTree(trees, rootPid);
      let newTree: PlateTree | null = null;
      if (subtree) {
        newTree = filterTree(subtree, maxPID);
      }
      if (newTree) {
        drawTree(svgRef, newTree);
      } else {
        alert("The tree is empty!");
        clearTree(svgRef);
      }
    }
  }, [svgRef, trees, rootPid, maxPID]);

  useEffect(() => {
    if (trees.length > 0) {
      setAllPIDs(getNonLeavePIDs(trees, maxPID));
    }
  }, [setAllPIDs, trees, maxPID]);
};
