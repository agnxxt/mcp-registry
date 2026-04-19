import type { N8nClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: N8nClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
