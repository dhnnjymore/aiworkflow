"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Type,
  BookOpen,
  MessageSquare,
  Monitor,
  ImageIcon,
  GitBranch,
  Globe,
  Database,
  Mail,
  Frame,
} from "lucide-react";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NodeTemplate {
  type: NodeData["type"];
  label: string;
  icon: React.ReactNode;
  color: string;
  nodeType: string;
  comingSoon?: boolean;
  description?: string;
  accentColor?: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: "input",
    label: "Input",
    icon: <Type className="h-4 w-4" />,
    color: "text-blue-400 hover:bg-blue-500/10 border-transparent hover:border-blue-500/20",
    nodeType: "input",
  },
  {
    type: "knowledge",
    label: "Knowledge",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-violet-400 hover:bg-violet-500/10 border-transparent hover:border-violet-500/20",
    nodeType: "knowledge",
  },
  {
    type: "prompt",
    label: "AI Prompt",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-amber-400 hover:bg-amber-500/10 border-transparent hover:border-amber-500/20",
    nodeType: "prompt",
  },
  {
    type: "image-gen",
    label: "Image Gen",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "text-pink-400 hover:bg-pink-500/10 border-transparent hover:border-pink-500/20",
    nodeType: "image-gen",
  },
  {
    type: "output",
    label: "Output",
    icon: <Monitor className="h-4 w-4" />,
    color: "text-emerald-400 hover:bg-emerald-500/10 border-transparent hover:border-emerald-500/20",
    nodeType: "output",
  },
  {
    type: "coming-soon",
    label: "Condition",
    icon: <GitBranch className="h-4 w-4" />,
    color: "text-cyan-400/50 border-transparent",
    nodeType: "coming-soon",
    comingSoon: true,
    description: "Branch workflow based on conditions",
    accentColor: "bg-cyan-500/15 text-cyan-400",
  },
  {
    type: "coming-soon",
    label: "Web Scraper",
    icon: <Globe className="h-4 w-4" />,
    color: "text-orange-400/50 border-transparent",
    nodeType: "coming-soon",
    comingSoon: true,
    description: "Scrape content from URLs",
    accentColor: "bg-orange-500/15 text-orange-400",
  },
  {
    type: "coming-soon",
    label: "Memory",
    icon: <Database className="h-4 w-4" />,
    color: "text-teal-400/50 border-transparent",
    nodeType: "coming-soon",
    comingSoon: true,
    description: "Store and retrieve data between runs",
    accentColor: "bg-teal-500/15 text-teal-400",
  },
  {
    type: "coming-soon",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
    color: "text-red-400/50 border-transparent",
    nodeType: "coming-soon",
    comingSoon: true,
    description: "Send workflow output via email",
    accentColor: "bg-red-500/15 text-red-400",
  },
];

export function Toolbar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const nodes = useWorkflowStore((s) => s.nodes);

  const handleAddNode = (template: NodeTemplate) => {
    if (template.comingSoon) return;
    const id = `${template.type}-${Date.now()}`;
    const xOffset = 300 + nodes.length * 50;
    const node: WorkflowNode = {
      id,
      type: template.nodeType,
      position: { x: xOffset, y: 200 },
      data: {
        label: template.label,
        type: template.type,
        status: "idle",
      },
    };
    addNode(node);
  };

  const handleAddFrame = () => {
    const id = `frame-${Date.now()}`;
    const xOffset = 200 + nodes.length * 50;
    const node: WorkflowNode = {
      id,
      type: "frame",
      position: { x: xOffset, y: 100 },
      data: { label: "Frame", type: "frame", status: "idle" },
      style: { width: 500, height: 300, zIndex: -1 },
    };
    addNode(node);
  };

  const activeNodes = nodeTemplates.filter((t) => !t.comingSoon);
  const comingSoonNodes = nodeTemplates.filter((t) => t.comingSoon);

  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1 p-1.5 bg-card/90 backdrop-blur-xl border border-border rounded-xl shadow-xl"
    >
      {activeNodes.map((template, i) => (
        <Tooltip key={`${template.type}-${i}`} delayDuration={0}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAddNode(template)}
              className={`flex items-center justify-center w-9 h-9 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${template.color}`}
            >
              {template.icon}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">{template.label}</TooltipContent>
        </Tooltip>
      ))}

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddFrame}
            className="flex items-center justify-center w-9 h-9 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-zinc-400 hover:bg-zinc-500/10 border-transparent hover:border-zinc-500/20"
          >
            <Frame className="h-4 w-4" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right">Frame</TooltipContent>
      </Tooltip>

      <div className="h-px bg-border mx-1 my-0.5" />

      {comingSoonNodes.map((template, i) => (
        <Tooltip key={`soon-${i}`} delayDuration={0}>
          <TooltipTrigger asChild>
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg opacity-60 cursor-not-allowed ${template.color}`}>
              {template.icon}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {template.label} — Coming Soon
          </TooltipContent>
        </Tooltip>
      ))}
    </motion.div>
  );
}
