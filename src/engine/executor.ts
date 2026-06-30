import type { WorkflowNode, WorkflowEdge, NodeData, LLMProvider } from "@/store/workflow-store";

function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const sorted: WorkflowNode[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(nodeMap.get(id)!);
    for (const neighbor of adjacency.get(id) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  if (sorted.length !== nodes.length) {
    throw new Error("Workflow contains a cycle");
  }

  return sorted;
}

function getInputNodes(nodeId: string, edges: WorkflowEdge[]): string[] {
  return edges.filter((e) => e.target === nodeId).map((e) => e.source);
}

function gatherInputData(
  nodeId: string,
  edges: WorkflowEdge[],
  nodeOutputs: Map<string, unknown>
): unknown[] {
  const inputIds = getInputNodes(nodeId, edges);
  return inputIds.map((id) => nodeOutputs.get(id)).filter(Boolean);
}

interface ExecutionCallbacks {
  onNodeStart: (nodeId: string) => void;
  onNodeComplete: (nodeId: string, data: Partial<NodeData>) => void;
  onNodeError: (nodeId: string, error: string) => void;
  onEdgeActivate: (edgeId: string) => void;
  onEdgeDeactivate: (edgeId: string) => void;
  onStreamToken: (nodeId: string, token: string) => void;
}

export async function executeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  provider: LLMProvider,
  apiKey: string,
  callbacks: ExecutionCallbacks
): Promise<void> {
  const sorted = topologicalSort(nodes, edges);
  const nodeOutputs = new Map<string, unknown>();

  for (const node of sorted) {
    const incomingEdges = edges.filter((e) => e.target === node.id);
    for (const edge of incomingEdges) {
      callbacks.onEdgeActivate(edge.id);
    }

    callbacks.onNodeStart(node.id);

    try {
      const inputs = gatherInputData(node.id, edges, nodeOutputs);
      const result = await executeNode(node, inputs, provider, apiKey, callbacks);
      nodeOutputs.set(node.id, result);
      callbacks.onNodeComplete(node.id, {
        status: "success",
        output: typeof result === "string" ? result : JSON.stringify(result, null, 2),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      callbacks.onNodeError(node.id, message);
      throw err;
    } finally {
      for (const edge of incomingEdges) {
        callbacks.onEdgeDeactivate(edge.id);
      }
    }
  }
}

async function executeNode(
  node: WorkflowNode,
  inputs: unknown[],
  provider: LLMProvider,
  apiKey: string,
  callbacks: ExecutionCallbacks
): Promise<unknown> {
  switch (node.data.type) {
    case "input":
      return executeInputNode(node);
    case "knowledge":
      return executeKnowledgeNode(node, inputs, provider, apiKey);
    case "prompt":
      return executePromptNode(node, inputs, provider, apiKey, callbacks);
    case "image-gen":
      return executeImageGenNode(node, inputs, provider, apiKey);
    case "output":
      return executeOutputNode(inputs);
    case "frame":
      return inputs[0] ?? null;
    case "coming-soon":
      throw new Error("This node is not yet available");
    default:
      throw new Error(`Unknown node type: ${node.data.type}`);
  }
}

function executeInputNode(node: WorkflowNode): string {
  if (node.data.file) {
    return node.data.file.content;
  }
  if (node.data.content) {
    return node.data.content;
  }
  throw new Error("Input node has no content or file");
}

async function executeKnowledgeNode(
  node: WorkflowNode,
  inputs: unknown[],
  provider: LLMProvider,
  apiKey: string
): Promise<Record<string, unknown>> {
  if (node.data.extractedKnowledge && Object.keys(node.data.extractedKnowledge).length > 0) {
    return node.data.extractedKnowledge;
  }

  const content = inputs.map((i) => String(i)).join("\n\n");
  if (!content.trim()) {
    throw new Error("No content to extract knowledge from");
  }

  const response = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, provider, apiKey }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Extraction failed" }));
    throw new Error(err.error || "Knowledge extraction failed");
  }

  const knowledge = await response.json();
  return knowledge;
}

async function executePromptNode(
  node: WorkflowNode,
  inputs: unknown[],
  provider: LLMProvider,
  apiKey: string,
  callbacks: ExecutionCallbacks
): Promise<string> {
  const prompt = node.data.prompt;
  if (!prompt) {
    throw new Error("Prompt node has no prompt configured");
  }

  const context = inputs
    .map((i) => (typeof i === "string" ? i : JSON.stringify(i, null, 2)))
    .join("\n\n---\n\n");

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context, provider, apiKey }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "LLM call failed" }));
    throw new Error(err.error || "Prompt execution failed");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream");

  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    callbacks.onStreamToken(node.id, fullText);
  }

  return fullText;
}

async function executeImageGenNode(
  node: WorkflowNode,
  inputs: unknown[],
  provider: LLMProvider,
  apiKey: string
): Promise<string> {
  const userPrompt = node.data.prompt || "";
  const context = inputs
    .map((i) => (typeof i === "string" ? i : JSON.stringify(i, null, 2)))
    .join("\n\n");
  const fullPrompt = userPrompt
    ? `${userPrompt}\n\nContext:\n${context}`
    : context;

  if (!fullPrompt.trim()) {
    throw new Error("No prompt or input for image generation");
  }

  const response = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt, provider, apiKey }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Image generation failed" }));
    throw new Error(err.error || "Image generation failed");
  }

  const { url } = await response.json();
  return url;
}

function executeOutputNode(inputs: unknown[]): string {
  return inputs.map((i) => (typeof i === "string" ? i : JSON.stringify(i, null, 2))).join("\n\n");
}
