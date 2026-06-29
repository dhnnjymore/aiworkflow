"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NodeStatus } from "@/store/workflow-store";
import { Loader2, CheckCircle2, XCircle, GripVertical } from "lucide-react";

interface BaseNodeProps {
  children: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  status: NodeStatus;
  selected: boolean;
  hasInput?: boolean;
  hasOutput?: boolean;
  accentColor?: string;
}

const statusConfig: Record<NodeStatus, { border: string; glow: string }> = {
  idle: { border: "border-border", glow: "" },
  running: { border: "border-primary", glow: "shadow-[0_0_20px_rgba(99,102,241,0.3)]" },
  success: { border: "border-success", glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]" },
  error: { border: "border-destructive", glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]" },
};

function StatusIndicator({ status }: { status: NodeStatus }) {
  if (status === "idle") return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -top-2 -right-2 z-10"
    >
      {status === "running" && (
        <div className="rounded-full bg-card p-0.5 border border-primary">
          <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
        </div>
      )}
      {status === "success" && (
        <div className="rounded-full bg-card p-0.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
        </div>
      )}
      {status === "error" && (
        <div className="rounded-full bg-card p-0.5">
          <XCircle className="h-3.5 w-3.5 text-destructive" />
        </div>
      )}
    </motion.div>
  );
}

export function BaseNode({
  children,
  label,
  icon,
  status,
  selected,
  hasInput = true,
  hasOutput = true,
  accentColor,
}: BaseNodeProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative min-w-[240px] max-w-[320px] rounded-xl border bg-card transition-all duration-200",
        config.border,
        config.glow,
        selected && "ring-2 ring-primary/50"
      )}
    >
      <StatusIndicator status={status} />

      {status === "running" && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
        </motion.div>
      )}

      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-muted-foreground !border-background"
        />
      )}

      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
          <GripVertical className="h-3 w-3 text-muted-foreground/40 cursor-grab" />
          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-md",
              accentColor || "bg-primary/15 text-primary"
            )}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-foreground tracking-wide uppercase">
            {label}
          </span>
        </div>
        <div className="p-3">{children}</div>
      </div>

      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-muted-foreground !border-background"
        />
      )}
    </motion.div>
  );
}
