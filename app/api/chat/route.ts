import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
          details: "Please add OPENAI_API_KEY to your environment variables",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Convert messages to the correct format for AI SDK
    const formattedMessages = messages.map((message: any) => ({
      role: message.role === "user" ? "user" : "assistant",
      content: message.content,
    }))

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Provide clear, concise, and helpful responses.",
        },
        ...formattedMessages,
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("Chat API error:", error)

    // Handle specific OpenAI errors
    if (error.message?.includes("quota") || error.message?.includes("billing")) {
      return new Response(
        JSON.stringify({
          error: "OpenAI quota exceeded",
          details: "Please check your OpenAI billing and usage limits",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
