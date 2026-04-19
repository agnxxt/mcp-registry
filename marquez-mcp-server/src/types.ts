import type { MarquezClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (client: MarquezClient, args: Record<string, unknown>) => Promise<unknown>;
}
