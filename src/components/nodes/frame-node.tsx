"use client";

import React from "react";
import { type NodeProps, NodeResizer } from "@xyflow/react";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";

export function FrameNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodeData = data as NodeData;

  return (
    <div className="w-full h-full relative">
      <NodeResizer
        isVisible={!!selected}
        minWidth={300}
        minHeight={200}
        lineClassName="!border-primary/30"
        handleClassName="!w-2.5 !h-2.5 !bg-primary !border-background !rounded-sm"
      />
      <div className="w-full h-full rounded-xl border border-dashed border-border/60 bg-muted/10 backdrop-blur-sm">
        <input
          value={nodeData.label || "Frame"}
          onChange={(e) => updateNodeData(id, { label: e.target.value })}
          className="absolute -top-3 left-3 bg-background border border-border rounded-md px-2 py-0.5 text-[11px] font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:text-foreground"
        />
      </div>
    </div>
  );
}
