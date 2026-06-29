"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Type, BookOpen, MessageSquare, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore, type WorkflowNode } from "@/store/workflow-store";

export function EmptyState() {
  const { addNode, setEdges, nodes } = useWorkflowStore();

  if (nodes.length > 0) return null;

  const createSampleWorkflow = () => {
    const newNodes: WorkflowNode[] = [
      {
        id: "input-1",
        type: "input",
        position: { x: 100, y: 250 },
        data: { label: "Input", type: "input", status: "idle" },
      },
      {
        id: "knowledge-1",
        type: "knowledge",
        position: { x: 450, y: 250 },
        data: { label: "Extract Knowledge", type: "knowledge", status: "idle" },
      },
      {
        id: "prompt-1",
        type: "prompt",
        position: { x: 800, y: 250 },
        data: {
          label: "AI Prompt",
          type: "prompt",
          status: "idle",
          prompt: "Generate a LinkedIn launch post based on the extracted knowledge. Make it engaging, professional, and include relevant hashtags.",
        },
      },
      {
        id: "output-1",
        type: "output",
        position: { x: 1150, y: 250 },
        data: { label: "Output", type: "output", status: "idle" },
      },
    ];

    for (const node of newNodes) {
      addNode(node);
    }

    setEdges([
      { id: "e1-2", source: "input-1", target: "knowledge-1", type: "smoothstep" },
      { id: "e2-3", source: "knowledge-1", target: "prompt-1", type: "smoothstep" },
      { id: "e3-4", source: "prompt-1", target: "output-1", type: "smoothstep" },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
    >
      <div className="text-center space-y-6 pointer-events-auto">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto"
        >
          <Zap className="h-7 w-7 text-primary" />
        </motion.div>

        <div>
          <h2 className="text-lg font-semibold">Build your first workflow</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Add nodes from the sidebar, connect them together, and hit Run.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
            <Type className="h-3.5 w-3.5 text-blue-400" />
            <span>Input</span>
          </div>
          <ArrowRight className="h-3 w-3" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
            <BookOpen className="h-3.5 w-3.5 text-violet-400" />
            <span>Knowledge</span>
          </div>
          <ArrowRight className="h-3 w-3" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
            <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
            <span>Prompt</span>
          </div>
          <ArrowRight className="h-3 w-3" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
            <Monitor className="h-3.5 w-3.5 text-emerald-400" />
            <span>Output</span>
          </div>
        </div>

        <Button onClick={createSampleWorkflow} variant="outline" size="sm" className="gap-2">
          <Zap className="h-3.5 w-3.5" />
          Start with a template
        </Button>
      </div>
    </motion.div>
  );
}
