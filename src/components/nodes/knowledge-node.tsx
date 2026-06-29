"use client";

import React from "react";
import { type NodeProps } from "@xyflow/react";
import { BookOpen, Sparkles } from "lucide-react";
import { BaseNode } from "./base-node";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { motion, AnimatePresence } from "framer-motion";

export function KnowledgeNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const nodeData = data as NodeData;
  const knowledge = nodeData.extractedKnowledge;
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const clearKnowledge = () => {
    updateNodeData(id, { extractedKnowledge: undefined, output: undefined, status: "idle" });
  };

  return (
    <BaseNode
      label="Extract Knowledge"
      icon={<BookOpen className="h-3.5 w-3.5" />}
      status={nodeData.status}
      selected={!!selected}
      accentColor="bg-violet-500/15 text-violet-400"
    >
      <AnimatePresence mode="wait">
        {knowledge && Object.keys(knowledge).length > 0 ? (
          <motion.div
            key="knowledge"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-violet-400" />
                <span className="text-[11px] font-medium text-violet-400">Extracted</span>
              </div>
              <button
                onClick={clearKnowledge}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-[120px] overflow-y-auto">
              {Object.entries(knowledge)
                .filter(([, v]) => v !== undefined && v !== null && v !== "")
                .slice(0, 6)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-2 text-[11px] px-2 py-1 rounded bg-muted/30"
                  >
                    <span className="text-muted-foreground capitalize shrink-0 w-16 truncate">
                      {key}
                    </span>
                    <span className="text-foreground/80 truncate">
                      {Array.isArray(value)
                        ? `${value.length} items`
                        : typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3"
          >
            <BookOpen className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground/40" />
            <p className="text-[11px] text-muted-foreground/60">
              Connects to an input to extract structured knowledge
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </BaseNode>
  );
}
