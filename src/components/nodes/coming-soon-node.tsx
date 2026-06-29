"use client";

import React from "react";
import { type NodeProps } from "@xyflow/react";
import { Lock } from "lucide-react";
import { BaseNode } from "./base-node";
import { type NodeData, type WorkflowNode } from "@/store/workflow-store";

export function ComingSoonNode({ data, selected }: NodeProps<WorkflowNode>) {
  const nodeData = data as NodeData;

  return (
    <BaseNode
      label={nodeData.label}
      icon={<Lock className="h-3.5 w-3.5" />}
      status="idle"
      selected={!!selected}
      hasInput
      hasOutput
      accentColor={(nodeData.accentColor as string) || "bg-zinc-500/15 text-zinc-400"}
    >
      <div className="text-center py-3 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50">
          <Lock className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground/40">
          {(nodeData.description as string) || "This node is not yet available"}
        </p>
      </div>
    </BaseNode>
  );
}
