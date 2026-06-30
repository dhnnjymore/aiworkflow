"use client";

import React from "react";
import { type NodeProps } from "@xyflow/react";
import { ImageIcon, Download } from "lucide-react";
import { BaseNode } from "./base-node";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { motion, AnimatePresence } from "framer-motion";

export function ImageGenNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodeData = data as NodeData;

  return (
    <BaseNode
      label="Generate Image"
      icon={<ImageIcon className="h-3.5 w-3.5" />}
      status={nodeData.status}
      selected={!!selected}
      accentColor="bg-pink-500/15 text-pink-400"
      note={nodeData.note}
      onNoteChange={(note) => updateNodeData(id, { note })}
    >
      <div className="space-y-2">
        <textarea
          value={nodeData.prompt || ""}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          placeholder="Describe the image to generate..."
          className="w-full text-xs bg-transparent border border-border rounded-lg p-2 min-h-[48px] resize-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
          rows={2}
        />

        <AnimatePresence mode="wait">
          {nodeData.output ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-pink-400 font-medium">Generated</span>
                <a
                  href={nodeData.output}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Download className="h-3 w-3 text-muted-foreground" />
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nodeData.output}
                alt="Generated"
                className="w-full rounded-lg border border-border"
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2"
            >
              <ImageIcon className="h-5 w-5 mx-auto mb-1 text-muted-foreground/40" />
              <p className="text-[11px] text-muted-foreground/60">
                Image will appear here after running
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseNode>
  );
}
