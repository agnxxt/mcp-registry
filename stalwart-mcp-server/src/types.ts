import type { StalwartClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: StalwartClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
