import type { GlitchTipClient } from "./client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: GlitchTipClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
