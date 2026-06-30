"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Settings, Zap, Loader2, RotateCcw, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SettingsDialog } from "@/components/panels/settings-dialog";
import { useWorkflowStore } from "@/store/workflow-store";
import { useExecuteWorkflow } from "@/hooks/use-execute-workflow";
import { getProviderLabel } from "@/providers/llm";
import { useStore } from "zustand";

function useTemporalStore() {
  const store = useWorkflowStore.temporal;
  const undo = useStore(store, (s) => s.undo);
  const redo = useStore(store, (s) => s.redo);
  const pastStates = useStore(store, (s) => s.pastStates);
  const futureStates = useStore(store, (s) => s.futureStates);
  return { undo, redo, canUndo: pastStates.length > 0, canRedo: futureStates.length > 0 };
}

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { provider, apiKey, nodes, resetNodeStatuses, workflowName, setWorkflowName } =
    useWorkflowStore();
  const { execute, isRunning } = useExecuteWorkflow();
  const { undo, redo, canUndo, canRedo } = useTemporalStore();

  const hasNodes = nodes.length > 0;
  const isConfigured = !!apiKey;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-13 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 z-30 relative"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-sm font-semibold tracking-tight bg-transparent border-none outline-none focus:ring-0 w-40 text-foreground placeholder:text-muted-foreground"
                placeholder="Untitled Workflow"
              />
              <p className="text-[10px] text-muted-foreground -mt-0.5">FlowCraft</p>
            </div>
          </div>

          <div className="w-px h-5 bg-border" />

          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => undo()}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => redo()}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSettingsOpen(true)}
                className="gap-1.5"
              >
                <Settings className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {isConfigured ? (
                    <Badge variant="success" className="text-[10px] px-1.5 py-0">
                      {getProviderLabel(provider)}
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                      Setup API Key
                    </Badge>
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configure LLM provider</TooltipContent>
          </Tooltip>

          <div className="w-px h-5 bg-border" />

          {hasNodes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={resetNodeStatuses}
                  disabled={isRunning}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset all nodes</TooltipContent>
            </Tooltip>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={execute}
              disabled={isRunning || !hasNodes || !isConfigured}
              className="gap-2 px-5"
              size="sm"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Run</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
