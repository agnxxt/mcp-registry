import type { MauticClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: MauticClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
