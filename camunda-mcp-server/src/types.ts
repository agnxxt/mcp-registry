import type { CamundaClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: CamundaClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
