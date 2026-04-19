import type { MatomoClient } from "./client.js";

export interface MatomoConfig {
  baseUrl: string;
  token: string;
  siteId: string;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: MatomoClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
