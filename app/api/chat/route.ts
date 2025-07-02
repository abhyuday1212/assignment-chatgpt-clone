import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if API key is available
    if (!process.env.GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Google Gemini API key not configured",
          details: "Please add GOOGLE_API_KEY to your environment variables",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Concatenate all messages into a single prompt
    const prompt = messages
      .map(
        (msg: any) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const { text } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt,
    });

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
