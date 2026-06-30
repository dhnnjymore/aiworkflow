"use client";

import React from "react";
import { type NodeProps } from "@xyflow/react";
import { MessageSquare, Loader2 } from "lucide-react";
import { BaseNode } from "./base-node";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { motion, AnimatePresence } from "framer-motion";

export function PromptNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodeData = data as NodeData;

  return (
    <BaseNode
      label="AI Prompt"
      icon={<MessageSquare className="h-3.5 w-3.5" />}
      status={nodeData.status}
      selected={!!selected}
      accentColor="bg-amber-500/15 text-amber-400"
      note={nodeData.note}
      onNoteChange={(note) => updateNodeData(id, { note })}
    >
      <div className="space-y-2">
        <textarea
          value={nodeData.prompt || ""}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          placeholder="Write your prompt... e.g. Generate a LinkedIn launch post."
          className="w-full text-xs bg-transparent border border-border rounded-lg p-2 min-h-[56px] resize-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
          rows={3}
        />

        <AnimatePresence>
          {nodeData.status === "running" && nodeData.output && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Streaming...</span>
              </div>
              <div className="text-[11px] text-foreground/70 bg-muted/30 rounded-lg p-2 max-h-[80px] overflow-y-auto font-mono leading-relaxed">
                {nodeData.output.slice(-200)}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-3 bg-primary ml-0.5 align-middle"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseNode>
  );
}
