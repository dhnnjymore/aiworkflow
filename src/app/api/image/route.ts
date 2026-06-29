import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { LLMProvider } from "@/store/workflow-store";

export async function POST(req: Request) {
  try {
    const { prompt, provider, apiKey } = await req.json();

    if (!apiKey) {
      return Response.json({ error: "API key is required" }, { status: 400 });
    }

    if (provider === "openai" || provider === "groq" || provider === "openrouter") {
      const baseURL =
        provider === "groq"
          ? "https://api.groq.com/openai/v1"
          : provider === "openrouter"
            ? "https://openrouter.ai/api/v1"
            : undefined;

      const openai = createOpenAI({ apiKey, baseURL });

      const response = await fetch(
        baseURL ? `${baseURL}/images/generations` : "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt.slice(0, 4000),
            n: 1,
            size: "1024x1024",
            response_format: "url",
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || "Image generation failed");
      }

      const data = await response.json();
      return Response.json({ url: data.data[0].url });
    }

    const model =
      provider === "anthropic"
        ? createOpenAI({ apiKey: "", baseURL: "" })("gpt-4o-mini")
        : createOpenAI({ apiKey: "", baseURL: "" })("gpt-4o-mini");

    const { text } = await generateText({
      model,
      prompt: `Create a detailed image description for: ${prompt}`,
    });

    return Response.json({
      url: `https://placehold.co/1024x1024/1a1a2e/6366f1?text=${encodeURIComponent("Image generation requires OpenAI")}`,
      description: text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
