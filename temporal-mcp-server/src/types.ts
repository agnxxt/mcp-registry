import type { TemporalClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: TemporalClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
