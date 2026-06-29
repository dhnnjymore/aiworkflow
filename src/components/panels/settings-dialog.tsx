"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflowStore, type LLMProvider } from "@/store/workflow-store";
import { getProviderConfig } from "@/providers/llm";
import { Key, Eye, EyeOff, Shield } from "lucide-react";
import { motion } from "framer-motion";

const providers: { value: LLMProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google Gemini" },
  { value: "groq", label: "Groq" },
  { value: "openrouter", label: "OpenRouter" },
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { provider, apiKey, setProvider, setApiKey } = useWorkflowStore();
  const [showKey, setShowKey] = React.useState(false);
  const config = getProviderConfig(provider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            LLM Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AI provider and API key. Keys are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Provider</label>
            <Select value={provider} onValueChange={(v) => setProvider(v as LLMProvider)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">API Key</label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={config.placeholder}
                className="pr-10 font-mono text-xs"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/50"
          >
            <Shield className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
            <span>
              Your API key is stored only in your browser&apos;s local storage and sent directly to the provider. It never touches our servers.
            </span>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
