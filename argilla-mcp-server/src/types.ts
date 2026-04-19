import type { ArgillaClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: ArgillaClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
