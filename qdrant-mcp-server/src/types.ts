import type { QdrantClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (client: QdrantClient, args: Record<string, unknown>) => Promise<unknown>;
}
