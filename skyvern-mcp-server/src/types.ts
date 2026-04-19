import type { SkyvernClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: SkyvernClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
