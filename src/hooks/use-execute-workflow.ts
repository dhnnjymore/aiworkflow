"use client";

import { useCallback } from "react";
import { useWorkflowStore } from "@/store/workflow-store";
import { executeWorkflow } from "@/engine/executor";

export function useExecuteWorkflow() {
  const {
    nodes,
    edges,
    provider,
    apiKey,
    isRunning,
    setIsRunning,
    updateNodeData,
    setEdges,
    resetNodeStatuses,
  } = useWorkflowStore();

  const execute = useCallback(async () => {
    if (isRunning) return;
    if (!apiKey) {
      alert("Please configure your API key in settings.");
      return;
    }
    if (nodes.length === 0) return;

    resetNodeStatuses();
    setIsRunning(true);

    try {
      await executeWorkflow(nodes, edges, provider, apiKey, {
        onNodeStart: (nodeId) => {
          updateNodeData(nodeId, { status: "running", error: undefined });
        },
        onNodeComplete: (nodeId, data) => {
          updateNodeData(nodeId, {
            ...data,
            status: "success",
          });
          if (data.output) {
            try {
              const parsed = JSON.parse(data.output);
              if (typeof parsed === "object" && parsed !== null) {
                updateNodeData(nodeId, { extractedKnowledge: parsed });
              }
            } catch {
              // not JSON, that's fine
            }
          }
        },
        onNodeError: (nodeId, error) => {
          updateNodeData(nodeId, { status: "error", error });
        },
        onEdgeActivate: (edgeId) => {
          setEdges(
            useWorkflowStore.getState().edges.map((e) =>
              e.id === edgeId ? { ...e, animated: true } : e
            )
          );
        },
        onEdgeDeactivate: (edgeId) => {
          setEdges(
            useWorkflowStore.getState().edges.map((e) =>
              e.id === edgeId ? { ...e, animated: false } : e
            )
          );
        },
        onStreamToken: (nodeId, text) => {
          updateNodeData(nodeId, { output: text });
        },
      });
    } catch {
      // error handled per-node
    } finally {
      setIsRunning(false);
      setEdges(
        useWorkflowStore.getState().edges.map((e) => ({ ...e, animated: false }))
      );
    }
  }, [nodes, edges, provider, apiKey, isRunning, setIsRunning, updateNodeData, setEdges, resetNodeStatuses]);

  return { execute, isRunning };
}
