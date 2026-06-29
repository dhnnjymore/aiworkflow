export async function POST(req: Request) {
  try {
    const { prompt, provider, apiKey } = await req.json();

    if (!apiKey) {
      return Response.json({ error: "API key is required" }, { status: 400 });
    }

    if (provider !== "openai" && provider !== "openrouter") {
      return Response.json(
        { error: "Image generation requires OpenAI or OpenRouter" },
        { status: 400 }
      );
    }

    const baseURL =
      provider === "openrouter"
        ? "https://openrouter.ai/api/v1"
        : "https://api.openai.com/v1";

    const response = await fetch(`${baseURL}/images/generations`, {
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
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || "Image generation failed");
    }

    const data = await response.json();
    return Response.json({ url: data.data[0].url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
