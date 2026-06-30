"use client";

import React from "react";
import { type NodeProps, NodeResizer } from "@xyflow/react";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";

export function FrameNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodeData = data as NodeData;

  return (
    <div className="w-full h-full relative" style={{ pointerEvents: "all" }}>
      <NodeResizer
        isVisible={!!selected}
        minWidth={300}
        minHeight={200}
        lineClassName="!border-primary/20"
        handleClassName="!w-2 !h-2 !bg-primary/70 !border-background !rounded-sm"
      />
      <div className="w-full h-full rounded-xl border border-dashed border-border/40 bg-white/[0.02]">
        <div className="absolute top-1.5 left-2.5">
          <input
            value={nodeData.label || "Frame"}
            onChange={(e) => updateNodeData(id, { label: e.target.value })}
            className="bg-transparent text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider focus:outline-none focus:text-muted-foreground w-24"
          />
        </div>
      </div>
    </div>
  );
}
