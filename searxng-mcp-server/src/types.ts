import type { SearxngClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: SearxngClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
