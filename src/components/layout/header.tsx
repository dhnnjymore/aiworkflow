"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Settings, Zap, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SettingsDialog } from "@/components/panels/settings-dialog";
import { useWorkflowStore } from "@/store/workflow-store";
import { useExecuteWorkflow } from "@/hooks/use-execute-workflow";
import { getProviderLabel } from "@/providers/llm";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { provider, apiKey, nodes, resetNodeStatuses } = useWorkflowStore();
  const { execute, isRunning } = useExecuteWorkflow();

  const hasNodes = nodes.length > 0;
  const isConfigured = !!apiKey;

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
              <h1 className="text-sm font-semibold tracking-tight">FlowCraft</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">AI Workflow Builder</p>
            </div>
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
