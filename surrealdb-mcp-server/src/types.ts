import type { SurrealDbClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (client: SurrealDbClient, args: Record<string, unknown>) => Promise<unknown>;
}
