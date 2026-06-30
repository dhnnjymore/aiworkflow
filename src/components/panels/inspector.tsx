"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Copy, FileText, BookOpen, MessageSquare, Monitor } from "lucide-react";
import { useWorkflowStore, type NodeData } from "@/store/workflow-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const statusVariants: Record<string, "default" | "success" | "destructive" | "warning" | "outline"> = {
  idle: "outline",
  running: "default",
  success: "success",
  error: "destructive",
};

const nodeIcons: Record<string, React.ReactNode> = {
  input: <FileText className="h-4 w-4 text-blue-400" />,
  knowledge: <BookOpen className="h-4 w-4 text-violet-400" />,
  prompt: <MessageSquare className="h-4 w-4 text-amber-400" />,
  output: <Monitor className="h-4 w-4 text-emerald-400" />,
};

export function Inspector() {
  const { selectedNodeId, nodes, inspectorOpen, setInspectorOpen, setSelectedNode, removeNode, duplicateNode } =
    useWorkflowStore();

  const node = nodes.find((n) => n.id === selectedNodeId);
  const data = node?.data as NodeData | undefined;

  const handleClose = () => {
    setSelectedNode(null);
    setInspectorOpen(false);
  };

  return (
    <AnimatePresence>
      {inspectorOpen && data && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 h-full w-80 bg-card/95 backdrop-blur-xl border-l border-border z-20 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              {nodeIcons[data.type]}
              <div>
                <h3 className="text-sm font-semibold">{data.label}</h3>
                <Badge variant={statusVariants[data.status]} className="mt-0.5">
                  {data.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (selectedNodeId) duplicateNode(selectedNodeId);
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (selectedNodeId) removeNode(selectedNodeId);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={handleClose}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {data.type === "input" && (
                <Section title="Configuration">
                  {data.file ? (
                    <div className="space-y-1.5">
                      <Label>File</Label>
                      <div className="flex items-center gap-2 text-xs bg-muted/50 rounded-lg p-2.5 border border-border">
                        <FileText className="h-3.5 w-3.5 text-blue-400" />
                        <span className="truncate">{data.file.name}</span>
                      </div>
                      <Label>Content Preview</Label>
                      <pre className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-2.5 max-h-40 overflow-auto whitespace-pre-wrap border border-border/50">
                        {data.file.content.slice(0, 500)}
                        {data.file.content.length > 500 && "..."}
                      </pre>
                    </div>
                  ) : data.content ? (
                    <div>
                      <Label>Text Input</Label>
                      <pre className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-2.5 max-h-40 overflow-auto whitespace-pre-wrap border border-border/50">
                        {data.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No input configured</p>
                  )}
                </Section>
              )}

              {data.type === "knowledge" && data.extractedKnowledge && (
                <Section title="Extracted Knowledge">
                  <pre className="text-[11px] text-foreground/80 bg-muted/30 rounded-lg p-2.5 max-h-64 overflow-auto whitespace-pre-wrap border border-border/50 font-mono">
                    {JSON.stringify(data.extractedKnowledge, null, 2)}
                  </pre>
                </Section>
              )}

              {data.type === "prompt" && (
                <Section title="Prompt">
                  <pre className="text-[11px] text-foreground/80 bg-muted/30 rounded-lg p-2.5 max-h-40 overflow-auto whitespace-pre-wrap border border-border/50">
                    {data.prompt || "No prompt configured"}
                  </pre>
                </Section>
              )}

              {data.output && (
                <Section title="Output">
                  <pre className="text-[11px] text-foreground/80 bg-muted/30 rounded-lg p-2.5 max-h-64 overflow-auto whitespace-pre-wrap border border-border/50 leading-relaxed">
                    {data.output}
                  </pre>
                </Section>
              )}

              {data.error && (
                <Section title="Error">
                  <div className="text-xs text-destructive bg-destructive/10 rounded-lg p-2.5 border border-destructive/20">
                    {data.error}
                  </div>
                </Section>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium text-muted-foreground mb-1">{children}</p>;
}
