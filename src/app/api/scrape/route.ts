export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WorkflowBot/1.0)",
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 10000);

    return Response.json({ content: text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
