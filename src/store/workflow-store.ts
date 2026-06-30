import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";

export type NodeStatus = "idle" | "running" | "success" | "error";
export type LLMProvider = "openai" | "anthropic" | "google" | "groq" | "openrouter";

export interface NodeData {
  label: string;
  type: "input" | "knowledge" | "prompt" | "output" | "image-gen" | "coming-soon" | "frame";
  status: NodeStatus;
  content?: string;
  file?: { name: string; content: string; type: string };
  extractedKnowledge?: Record<string, unknown>;
  prompt?: string;
  output?: string;
  error?: string;
  [key: string]: unknown;
}

export type WorkflowNode = Node<NodeData>;
export type WorkflowEdge = Edge;

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  isRunning: boolean;
  provider: LLMProvider;
  apiKey: string;
  inspectorOpen: boolean;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setSelectedNode: (id: string | null) => void;
  setIsRunning: (running: boolean) => void;
  setProvider: (provider: LLMProvider) => void;
  setApiKey: (key: string) => void;
  setInspectorOpen: (open: boolean) => void;
  resetNodeStatuses: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isRunning: false,
      provider: "openai",
      apiKey: "",
      inspectorOpen: false,

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(
            { ...connection, animated: false },
            get().edges
          ),
        });
      },

      addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
      },

      removeNode: (id) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
          selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
        });
      },

      updateNodeData: (id, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        });
      },

      setSelectedNode: (id) => {
        set({ selectedNodeId: id, inspectorOpen: id !== null });
      },

      setIsRunning: (running) => set({ isRunning: running }),
      setProvider: (provider) => set({ provider }),
      setApiKey: (key) => set({ apiKey: key }),
      setInspectorOpen: (open) => set({ inspectorOpen: open }),

      resetNodeStatuses: () => {
        set({
          nodes: get().nodes.map((node) => ({
            ...node,
            data: { ...node.data, status: "idle" as NodeStatus, error: undefined, output: undefined },
          })),
          edges: get().edges.map((edge) => ({ ...edge, animated: false })),
        });
      },
    }),
    {
      name: "workflow-storage",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        provider: state.provider,
        apiKey: state.apiKey,
      }),
    }
  )
);
