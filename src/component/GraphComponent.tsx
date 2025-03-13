import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useAtom } from "jotai";
import { elementsAtom, nodesAtom } from "../atoms";

const GraphComponent = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes] = useAtom(nodesAtom);
  const [elements] = useAtom(elementsAtom);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const aspectRatio = 0.4; // Keep aspect ratio as 1 for proportional scaling
    const height = width * aspectRatio; // Ensure height is equal to width for proportional scaling
    const padding = 60;

    svg.attr("width", width).attr("height", height);

    // Scales based on the node data
    const xMin = d3.min(nodes, (d) => d.x) || 0;
    const xMax = d3.max(nodes, (d) => d.x) || 1;
    const yMin = d3.min(nodes, (d) => d.y) || 0;
    const yMax = d3.max(nodes, (d) => d.y) || 1;

    const xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height - padding, padding]);

    // Clear previous content
    svg.selectAll("*").remove();

    // Create a group element to contain all the chart elements
    const graphGroup = svg.append("g");

    // Create lines for each element
    elements.forEach((element) => {
      const node1 = nodes.find((node) => node.id === element.node1);
      const node2 = nodes.find((node) => node.id === element.node2);

      if (node1 && node2) {
        const x1 = xScale(node1.x);
        const y1 = yScale(node1.y);
        const x2 = xScale(node2.x);
        const y2 = yScale(node2.y);

        // Draw line between nodes with increased stroke width
        graphGroup
          .append("line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", "#D3D3D3")
          .attr("stroke-width", 4) // Increased stroke width
          .attr("stroke-linecap", "round")
          .attr("class", "line")
          .on("mouseover", function () {
            d3.select(this).attr("stroke", "#808080").attr("stroke-width", 5); // Highlight on hover
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", "#D3D3D3").attr("stroke-width", 4); // Reset color on mouseout
          });
      }
    });

    nodes.forEach((node) => {
      if (node) {
        const x = xScale(node.x);
        const y = yScale(node.y);
        graphGroup
          .append("text")
          .attr("x", x - 160)
          .attr("y", y - 20)
          .attr("font-size", "24px")
          .attr("fill", "black")
          .text(`(${node.x.toFixed(2)}, ${node.y.toFixed(2)})`);

        switch (node.support) {
          case "fixed": {
            graphGroup
              .append("rect")
              .attr("x", x - 18)
              .attr("y", y - 18)
              .attr("width", 36)
              .attr("height", 36)
              .attr("fill", "#ff6347")
              .attr("stroke", "#000")
              .attr("stroke-width", 2);
            break;
          }
          case "free": {
            graphGroup
              .append("circle")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 8) //
              .attr("fill", "#808080")
              .attr("stroke", "#000000")
              .attr("stroke-width", 2)
              .on("mouseover", function () {
                d3.select(this).attr("fill", "#adff2f");
              })
              .on("mouseout", function () {
                d3.select(this).attr("fill", "#808080");
              });
            break;
          }
          case "pinned": {
            graphGroup
              .append("polygon")
              .attr(
                "points",
                `${x},${y} ${x + 25},${y + 40} ${x - 25},${y + 40}`
              )
              .attr("fill", "#ff6347") // Red color
              .attr("stroke", "#000")
              .attr("stroke-width", 2);
            break;
          }

          case "v_roller": {
            graphGroup
              .append("circle")
              .attr("cx", x)
              .attr("cy", y + 20)
              .attr("r", 20) //
              .attr("fill", "#ff6347")
              .attr("stroke", "#000000")
              .attr("stroke-width", 2);

            graphGroup
              .append("text")
              .attr("x", x)
              .attr("y", y + 20)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("fill", "#ffffff")
              .attr("font-size", "16px")
              .attr("font-weight", "bold")
              .text("V");
            break;
          }

          case "h_roller": {
            graphGroup
              .append("circle")
              .attr("cx", x + 20)
              .attr("cy", y)
              .attr("r", 20) // Circle size
              .attr("fill", "#ff6347")
              .attr("stroke", "#000000")
              .attr("stroke-width", 2);

            // Add text inside the circle
            graphGroup
              .append("text")
              .attr("x", x + 20)
              .attr("y", y)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("fill", "#ffffff")
              .attr("font-size", "16px")
              .attr("font-weight", "bold")
              .text("H");
            break;
          }
        }
      }
    });

    const zoom = d3.zoom().on("zoom", function (event) {
      graphGroup.attr("transform", event.transform);
    });

    svg.call(zoom as any);
  }, [nodes, elements]);

  return nodes.length ? (
    <>
      <h2>Structure Diagram</h2>
      <div
        style={{
          border: "1px solid black",
          overflow: "hidden",
          cursor: "move",
        }}
      >
        <svg ref={svgRef}></svg>
      </div>
    </>
  ) : null;
};

export default GraphComponent;
