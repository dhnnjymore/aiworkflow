"use client";

import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
  type OnSelectionChangeFunc,
  type OnNodeDrag,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore, type WorkflowNode } from "@/store/workflow-store";
import { InputNode } from "@/components/nodes/input-node";
import { KnowledgeNode } from "@/components/nodes/knowledge-node";
import { PromptNode } from "@/components/nodes/prompt-node";
import { OutputNode } from "@/components/nodes/output-node";
import { ImageGenNode } from "@/components/nodes/image-gen-node";
import { ComingSoonNode } from "@/components/nodes/coming-soon-node";
import { FrameNode } from "@/components/nodes/frame-node";

const nodeTypes: NodeTypes = {
  input: InputNode,
  knowledge: KnowledgeNode,
  prompt: PromptNode,
  output: OutputNode,
  "image-gen": ImageGenNode,
  "coming-soon": ComingSoonNode,
  frame: FrameNode,
};

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setNodes,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();

  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes: selectedNodes }) => {
      if (selectedNodes.length === 1) {
        setSelectedNode(selectedNodes[0].id);
      } else {
        setSelectedNode(null);
      }
    },
    [setSelectedNode]
  );

  const onNodeDragStop: OnNodeDrag<WorkflowNode> = useCallback(
    (_event, draggedNode) => {
      if (draggedNode.type === "frame") return;

      const frames = nodes.filter((n) => n.type === "frame" && n.id !== draggedNode.id);
      let newParentId: string | undefined;

      for (const frame of frames) {
        const fw = (frame.style?.width as number) || 500;
        const fh = (frame.style?.height as number) || 300;
        const fx = frame.position.x;
        const fy = frame.position.y;

        const nx = draggedNode.position.x + (draggedNode.parentId === frame.id ? fx : 0);
        const ny = draggedNode.position.y + (draggedNode.parentId === frame.id ? fy : 0);

        if (nx >= fx && nx <= fx + fw && ny >= fy && ny <= fy + fh) {
          newParentId = frame.id;
          break;
        }
      }

      const currentParent = draggedNode.parentId;

      if (newParentId && currentParent !== newParentId) {
        const frame = frames.find((f) => f.id === newParentId)!;
        const updated = nodes.map((n) => {
          if (n.id === draggedNode.id) {
            return {
              ...n,
              parentId: newParentId,
              position: {
                x: n.position.x - frame.position.x,
                y: n.position.y - frame.position.y,
              },
            };
          }
          return n;
        });
        setNodes(updated);
      } else if (!newParentId && currentParent) {
        const parentFrame = nodes.find((n) => n.id === currentParent);
        const updated = nodes.map((n) => {
          if (n.id === draggedNode.id) {
            const result = { ...n, parentId: undefined, position: {
              x: n.position.x + (parentFrame?.position.x || 0),
              y: n.position.y + (parentFrame?.position.y || 0),
            }};
            delete result.parentId;
            return result;
          }
          return n;
        });
        setNodes(updated);
      }
    },
    [nodes, setNodes]
  );

  const minimapStyle = useMemo(
    () => ({
      height: 100,
      maskColor: "rgba(0,0,0,0.8)",
    }),
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onPaneClick={() => setSelectedNode(null)}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: { strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
        minZoom={0.2}
        maxZoom={2}
        deleteKeyCode="Delete"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#27272a"
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
        />
        <MiniMap
          position="bottom-right"
          style={minimapStyle}
          nodeColor={() => "#6366f1"}
          maskColor="rgba(0,0,0,0.8)"
        />
      </ReactFlow>
    </div>
  );
}
