"use client";

import React from "react";
import { type NodeProps } from "@xyflow/react";
import { Monitor, Copy, Check } from "lucide-react";
import { BaseNode } from "./base-node";
import { type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { motion, AnimatePresence } from "framer-motion";

export function OutputNode({ data, selected }: NodeProps<WorkflowNode>) {
  const [copied, setCopied] = React.useState(false);
  const nodeData = data as NodeData;

  const copyOutput = async () => {
    if (nodeData.output) {
      await navigator.clipboard.writeText(nodeData.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <BaseNode
      label="Output"
      icon={<Monitor className="h-3.5 w-3.5" />}
      status={nodeData.status}
      selected={!!selected}
      hasOutput={false}
      accentColor="bg-emerald-500/15 text-emerald-400"
    >
      <AnimatePresence mode="wait">
        {nodeData.output ? (
          <motion.div
            key="output"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">Result</span>
              <button
                onClick={copyOutput}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            <div className="text-[11px] text-foreground/80 bg-muted/30 rounded-lg p-2.5 max-h-[160px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {nodeData.output}
            </div>
          </motion.div>
        ) : nodeData.error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] text-destructive bg-destructive/10 rounded-lg p-2.5"
          >
            {nodeData.error}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <Monitor className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground/40" />
            <p className="text-[11px] text-muted-foreground/60">
              Output will appear here after running
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </BaseNode>
  );
}
