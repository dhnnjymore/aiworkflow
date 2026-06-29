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
  company: z.string().optional().describe("Company or organization name"),
  product: z.string().optional().describe("Product or service name"),
  audience: z.string().optional().describe("Target audience"),
  features: z.array(z.string()).optional().describe("Key features or capabilities"),
  tone: z.string().optional().describe("Brand tone and voice"),
  keyMessages: z.array(z.string()).optional().describe("Key messages or value propositions"),
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .optional()
    .describe("Frequently asked questions"),
  summary: z.string().describe("Brief summary of the content"),
  additionalNotes: z.array(z.string()).optional().describe("Any other relevant information as a list of notes"),
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
      prompt: `Extract structured knowledge from the following content. Identify the company, product, audience, features, tone, key messages, FAQs, and any other relevant information. If a field is not applicable, omit it.\n\nContent:\n${content}`,
    });

    return Response.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
