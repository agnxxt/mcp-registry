import type { LitellmClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: LitellmClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
