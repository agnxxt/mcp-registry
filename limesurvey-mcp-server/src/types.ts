import type { LimeSurveyClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: LimeSurveyClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
