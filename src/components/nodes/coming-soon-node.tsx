"use client";

import React from "react";
import { type NodeProps } from "@xyflow/react";
import {
  GitBranch,
  Globe,
  Database,
  Mail,
} from "lucide-react";
import { BaseNode } from "./base-node";
import { type NodeData, type WorkflowNode } from "@/store/workflow-store";

const iconMap: Record<string, React.ReactNode> = {
  Condition: <GitBranch className="h-3.5 w-3.5" />,
  "Web Scraper": <Globe className="h-3.5 w-3.5" />,
  Memory: <Database className="h-3.5 w-3.5" />,
  Email: <Mail className="h-3.5 w-3.5" />,
};

export function ComingSoonNode({ data, selected }: NodeProps<WorkflowNode>) {
  const nodeData = data as NodeData;
  const icon = iconMap[nodeData.label] || <GitBranch className="h-3.5 w-3.5" />;

  return (
    <BaseNode
      label={nodeData.label}
      icon={icon}
      status="idle"
      selected={!!selected}
      hasInput
      hasOutput
      accentColor={(nodeData.accentColor as string) || "bg-zinc-500/15 text-zinc-400"}
    >
      <div className="text-center py-3 space-y-1.5">
        <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
          Coming Soon
        </span>
        <p className="text-[11px] text-muted-foreground/40">
          {(nodeData.description as string) || "This node is not yet available"}
        </p>
      </div>
    </BaseNode>
  );
}
