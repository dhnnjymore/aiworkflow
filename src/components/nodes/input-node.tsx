"use client";

import React, { useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X, Type } from "lucide-react";
import { BaseNode } from "./base-node";
import { useWorkflowStore, type NodeData, type WorkflowNode } from "@/store/workflow-store";
import { motion, AnimatePresence } from "framer-motion";

export function InputNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodeData = data as NodeData;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      let content = "";
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          pages.push(textContent.items.map((item: Record<string, unknown>) => (item as { str?: string }).str || "").join(" "));
        }
        content = pages.join("\n\n");
      } else {
        content = await file.text();
      }

      updateNodeData(id, {
        file: { name: file.name, content, type: file.type },
        content: undefined,
      });
    },
    [id, updateNodeData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
    maxFiles: 1,
  });

  const clearFile = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateNodeData(id, { file: undefined });
    },
    [id, updateNodeData]
  );

  return (
    <BaseNode
      label="Input"
      icon={<Type className="h-3.5 w-3.5" />}
      status={nodeData.status}
      selected={!!selected}
      hasInput={false}
      accentColor="bg-blue-500/15 text-blue-400"
      note={nodeData.note}
      onNoteChange={(note) => updateNodeData(id, { note })}
    >
      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {nodeData.file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 rounded-lg bg-muted/50 border border-border p-2"
            >
              <FileText className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-xs text-foreground truncate flex-1">
                {nodeData.file.name}
              </span>
              <button
                onClick={clearFile}
                className="p-0.5 rounded hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                {...getRootProps()}
                className={`
                  border border-dashed rounded-lg p-4 text-center cursor-pointer
                  transition-all duration-150
                  ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground hover:bg-muted/30"}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">
                  Drop PDF, MD, or TXT
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <textarea
            value={nodeData.content || ""}
            onChange={(e) => updateNodeData(id, { content: e.target.value, file: undefined })}
            placeholder="Or type text here..."
            className="w-full text-xs bg-transparent border border-border rounded-lg p-2 min-h-[48px] resize-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
            rows={2}
          />
        </div>
      </div>
    </BaseNode>
  );
}
