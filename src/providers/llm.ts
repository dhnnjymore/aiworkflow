import type { LLMProvider } from "@/store/workflow-store";

export function getProviderConfig(provider: LLMProvider) {
  const configs: Record<LLMProvider, { name: string; placeholder: string; models: string[] }> = {
    openai: {
      name: "OpenAI",
      placeholder: "sk-...",
      models: ["gpt-4o", "gpt-4o-mini"],
    },
    anthropic: {
      name: "Anthropic",
      placeholder: "sk-ant-...",
      models: ["claude-sonnet-4-20250514", "claude-haiku-4-20250414"],
    },
    google: {
      name: "Google Gemini",
      placeholder: "AIza...",
      models: ["gemini-2.0-flash", "gemini-2.5-flash-preview-05-20"],
    },
    groq: {
      name: "Groq",
      placeholder: "gsk_...",
      models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
    },
    openrouter: {
      name: "OpenRouter",
      placeholder: "sk-or-...",
      models: ["openai/gpt-4o", "anthropic/claude-sonnet-4"],
    },
  };

  return configs[provider];
}

export function getProviderLabel(provider: LLMProvider): string {
  return getProviderConfig(provider).name;
}
