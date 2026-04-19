import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_chat_completion",
    description: "Create a chat completion through the LiteLLM proxy",
    inputSchema: {
      type: "object",
      properties: {
        model: { type: "string", description: "Model name (e.g. gpt-4, claude-3)" },
        messages: {
          type: "array",
          description: "Array of message objects with role and content",
          items: {
            type: "object",
            properties: {
              role: { type: "string", description: "Message role: system, user, or assistant" },
              content: { type: "string", description: "Message content" },
            },
            required: ["role", "content"],
          },
        },
        temperature: { type: "number", description: "Sampling temperature (0-2)" },
        max_tokens: { type: "number", description: "Maximum tokens to generate" },
      },
      required: ["model", "messages"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/chat/completions", args);
    },
  },
];
