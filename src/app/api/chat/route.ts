import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import type { LLMProvider } from "@/store/workflow-store";

function getModel(provider: LLMProvider, apiKey: string) {
  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey })("gpt-4o-mini");
    case "anthropic":
      return createAnthropic({ apiKey })("claude-sonnet-4-20250514");
    case "google":
      return createGoogleGenerativeAI({ apiKey })("gemini-2.0-flash");
    case "groq":
      return createOpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" })(
        "llama-3.3-70b-versatile"
      );
    case "openrouter":
      return createOpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" })(
        "openai/gpt-4o-mini"
      );
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, context, provider, apiKey } = await req.json();

    if (!apiKey) {
      return Response.json({ error: "API key is required" }, { status: 400 });
    }

    const model = getModel(provider, apiKey);

    const systemPrompt = context
      ? `You are a helpful AI assistant. Use the following context to inform your response:\n\n${context}`
      : "You are a helpful AI assistant.";

    const result = streamText({
      model,
      system: systemPrompt,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
