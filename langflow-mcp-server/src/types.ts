import type { LangflowClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: LangflowClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
