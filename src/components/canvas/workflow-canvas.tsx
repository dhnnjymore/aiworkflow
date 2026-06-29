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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "@/store/workflow-store";
import { InputNode } from "@/components/nodes/input-node";
import { KnowledgeNode } from "@/components/nodes/knowledge-node";
import { PromptNode } from "@/components/nodes/prompt-node";
import { OutputNode } from "@/components/nodes/output-node";

const nodeTypes: NodeTypes = {
  input: InputNode,
  knowledge: KnowledgeNode,
  prompt: PromptNode,
  output: OutputNode,
};

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
  } = useWorkflowStore();

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
          position="bottom-left"
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
