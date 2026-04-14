import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { engineeringService } from "../../services/engineeringService";
import type { EngineeringSystem } from "../../types/engineering";

interface Props {
  systemId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function SystemCanvas({ systemId, initialNodes, initialEdges }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Handle connecting nodes together manually
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  // Auto-Save when a node drag ends
  const onNodeDragStop = useCallback(
    async () => {
      try {
        await engineeringService.updateSystem(systemId, {
          nodes: nodes as unknown as EngineeringSystem["nodes"],
          edges: edges as unknown as EngineeringSystem["edges"],
        });
      } catch (err) {
        console.error("Failed to save ADLC system layout:", err);
      }
    },
    [nodes, edges, systemId]
  );

  return (
    <div style={{ width: "100%", height: "100%" }} className="react-flow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        fitView
        colorMode={isDark ? "dark" : "light"}
      >
        <Controls showInteractive={false} />
        <MiniMap 
          nodeColor={isDark ? "#3b82f6" : "#2563eb"} 
          maskColor={isDark ? "rgba(17, 24, 39, 0.7)" : "rgba(249, 250, 251, 0.7)"}
          style={{ backgroundColor: isDark ? "#1f2937" : "#ffffff" }}
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color={isDark ? "#374151" : "#e5e7eb"} />
      </ReactFlow>
    </div>
  );
}
