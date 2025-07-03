export const chatContexts: Map<string, { messages: any[]; lastUpdated: number }> =
  (global as any).chatContexts || new Map();
(global as any).chatContexts = chatContexts;

export const CONTEXT_TTL_MS = 3 * 60 * 60 * 1000; // 3 hour

export function cleanUpExpiredContexts() {
  const now = Date.now();
  for (const [chatID, ctx] of chatContexts.entries()) {
    if (now - ctx.lastUpdated > CONTEXT_TTL_MS) {
      chatContexts.delete(chatID);
    }
  }
}
