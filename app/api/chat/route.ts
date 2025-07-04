import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import {
  chatContexts,
  cleanUpExpiredContexts,
  CONTEXT_TTL_MS,
} from "@/lib/cache/chat.cache";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { chatID, messages } = await req.json();
    cleanUpExpiredContexts();

    let context = chatContexts.get(chatID);
    const now = Date.now();

    if (!context || now - context.lastUpdated > CONTEXT_TTL_MS) {
      context = { messages: [], lastUpdated: now };
      chatContexts.set(chatID, context);
    }

    context.messages.push(...messages);
    context.lastUpdated = now;

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Google Gemini API key not configured",
          details:
            "Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Concatenate all messages into a single prompt
    const prompt = context.messages
      .map(
        (msg: any) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const { text } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt,
    });

    // Optionally, you can also store the assistant's reply in the context
    context.messages.push({ role: "assistant", content: text });

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
