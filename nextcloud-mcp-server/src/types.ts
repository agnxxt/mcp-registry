import type { NextcloudClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: NextcloudClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
