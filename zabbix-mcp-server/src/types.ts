import type { ZabbixClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: ZabbixClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
