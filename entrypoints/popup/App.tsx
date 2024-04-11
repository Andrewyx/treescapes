import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

import * as React from "react";
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  SimulationNodeDatum,
  SimulationLinkDatum
} from "d3-force";

import * as d3 from 'd3';

interface MyNode {
  label: string;
  parent?: number;
}

const ForceGraph: React.FC<{ nodesData: MyNode[] }> = ({ nodesData }) => {
  const rootRef = React.useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [nodes, setNodes] = React.useState<SimulationNodeDatum[]>([]);

  // Simulation effect
  React.useEffect(() => {
    setIsLoading(true);
    const nodes = nodesData.map<SimulationNodeDatum>((x, i) => {
      return { index: i };
    });
    const links = nodesData
      .filter(x => typeof x.parent === "number")
      .map<SimulationLinkDatum<SimulationNodeDatum>>(x => {
        return {
          source: x.parent!,
          target: nodesData.indexOf(x)
        };
      });
    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links))
      .force("charge", forceManyBody());
    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
    });
    simulation.on("end", () => {
      setNodes([...simulation.nodes()]);
      setIsLoading(false);
    });
    return () => {
      simulation.stop();
    };
  }, [nodesData]);

  return (
    <>
      <svg
        height="500px"
        ref={rootRef}
        style={{ border: "1px solid #000" }}
        viewBox={getViewBox(nodes)}
        width="500px"
        xmlns="http://www.w3.org/2000/svg"
      >
        {nodesData
          .filter(x => typeof x.parent === "number")
          .map((x, i) => {
            const child = nodes.find(y => y.index === nodesData.indexOf(x));
            const parent = nodes.find(y => y.index === x.parent);
            if (child && parent) {
              return (
                <line
                  key={i}
                  x1={child.x}
                  y1={child.y}
                  x2={parent.x}
                  y2={parent.y}
                  strokeWidth={0.25}
                  stroke="#000"
                />
              );
            } else {
              return null;
            }
          })}
        {nodes.map((x, i) => (
          <circle key={i} cx={x.x} r={x.index === 0 ? 3 : 1} cy={x.y}>
            {nodesData[x.index!] && <title>{nodesData[x.index!].label}</title>}
          </circle>
        ))}
      </svg>
      {isLoading ? <p>Simulating...</p> : <p>Complete</p>}
    </>
  );
};

export default function App() {

  const [nodeCount, setNodeCount] = React.useState(20);
  const [nodesData, setNodesData] = React.useState<MyNode[]>(
    makeData(nodeCount)
  );
  return (
    <div className="App">
      <h1>React D3 Force Graph</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          setNodesData(makeData(nodeCount));
        }}
      >
        <label>
          Count:
          <input
            onChange={e => setNodeCount(Number(e.target.value))}
            type="number"
            value={nodeCount}
          />
        </label>
        <button type="submit">Regenerate</button>
      </form>
      <br />
      <ForceGraph nodesData={nodesData} />
    </div>
  );
}

function drag(simulation:any) {
  
  function dragstarted(event:any, d:any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event:any, d:any) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event:any, d:any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getViewBox(
  nodes: SimulationNodeDatum[],
  padding: number = 0.1
): string {
  const size =
    (1 + padding) *
    Math.max(
      Math.max(...nodes.map(x => Math.abs(x.x!))),
      Math.max(...nodes.map(x => Math.abs(x.y!)))
    );
  const viewBox = {
    cx: -size,
    cy: -size,
    height: size * 2,
    width: size * 2
  };
  return `${viewBox.cx} ${viewBox.cy} ${viewBox.width} ${viewBox.height}`;
}

function makeData(length: number): MyNode[] {
  return Array.from({ length }, (_, i) => {
    return {
      label: `Item ${i}`,
      parent: i === 0 ? undefined : getRandomInt(0, i - 1)
    };
  });
}
