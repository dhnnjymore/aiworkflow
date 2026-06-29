import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
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

const knowledgeSchema = z.object({
  company: z.string().nullable().describe("Company or organization name, or null if not applicable"),
  product: z.string().nullable().describe("Product or service name, or null if not applicable"),
  audience: z.string().nullable().describe("Target audience, or null if not applicable"),
  features: z.array(z.string()).describe("Key features or capabilities, empty array if none"),
  tone: z.string().nullable().describe("Brand tone and voice, or null if not applicable"),
  keyMessages: z.array(z.string()).describe("Key messages or value propositions, empty array if none"),
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .describe("Frequently asked questions, empty array if none"),
  summary: z.string().describe("Brief summary of the content"),
  additionalNotes: z.array(z.string()).describe("Any other relevant information as a list of notes, empty array if none"),
});

export async function POST(req: Request) {
  try {
    const { content, provider, apiKey } = await req.json();

    if (!apiKey) {
      return Response.json({ error: "API key is required" }, { status: 400 });
    }

    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const model = getModel(provider, apiKey);

    const { object } = await generateObject({
      model,
      schema: knowledgeSchema,
      prompt: `Extract structured knowledge from the following content. Identify the company, product, audience, features, tone, key messages, FAQs, and any other relevant information. Use null for string fields that don't apply, and empty arrays for list fields that don't apply.\n\nContent:\n${content}`,
    });

    return Response.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
