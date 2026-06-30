"use client";

import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { WorkflowCanvas } from "@/components/canvas/workflow-canvas";
import { Toolbar } from "@/components/canvas/toolbar";
import { Inspector } from "@/components/panels/inspector";
import { EmptyState } from "@/components/layout/empty-state";
import { IntroModal } from "@/components/layout/intro-modal";

export default function Home() {
  return (
    <TooltipProvider delayDuration={200}>
      <ReactFlowProvider>
        <IntroModal />
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex-1 relative overflow-hidden">
            <Toolbar />
            <EmptyState />
            <WorkflowCanvas />
            <Inspector />
          </div>
        </div>
      </ReactFlowProvider>
    </TooltipProvider>
  );
}
