"use client";

import React from "react";
import { motion } from "framer-motion";
import { Type, BookOpen, MessageSquare, Monitor, Plus } from "lucide-react";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NodeTemplate {
  type: NodeData["type"];
  label: string;
  icon: React.ReactNode;
  color: string;
  nodeType: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: "input",
    label: "Input",
    icon: <Type className="h-4 w-4" />,
    color: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
    nodeType: "input",
  },
  {
    type: "knowledge",
    label: "Knowledge",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20",
    nodeType: "knowledge",
  },
  {
    type: "prompt",
    label: "AI Prompt",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
    nodeType: "prompt",
  },
  {
    type: "output",
    label: "Output",
    icon: <Monitor className="h-4 w-4" />,
    color: "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
    nodeType: "output",
  },
];

export function Toolbar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const nodes = useWorkflowStore((s) => s.nodes);

  const handleAddNode = (template: NodeTemplate) => {
    const id = `${template.type}-${Date.now()}`;
    const yOffset = nodes.length * 180;
    const node: WorkflowNode = {
      id,
      type: template.nodeType,
      position: { x: 250, y: 80 + yOffset },
      data: {
        label: template.label,
        type: template.type,
        status: "idle",
      },
    };
    addNode(node);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1.5 bg-card/90 backdrop-blur-xl border border-border rounded-xl shadow-xl"
    >
      <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
        <Plus className="h-3 w-3" />
        <span className="font-medium">Add</span>
      </div>
      <div className="w-px h-5 bg-border" />
      {nodeTemplates.map((template) => (
        <Tooltip key={template.type}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddNode(template)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${template.color}`}
            >
              {template.icon}
              <span className="hidden sm:inline">{template.label}</span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>Add {template.label} node</TooltipContent>
        </Tooltip>
      ))}
    </motion.div>
  );
}
