import type { TypebotClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: TypebotClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
