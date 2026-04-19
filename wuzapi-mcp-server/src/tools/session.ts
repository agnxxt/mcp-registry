import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WuzapiClient } from "../client.js";

export const sessionTools: Tool[] = [
  {
    name: "session_status",
    description: "Get the current WhatsApp session status",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "session_connect",
    description: "Connect/start a WhatsApp session",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "session_disconnect",
    description: "Disconnect/stop the current WhatsApp session",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "session_qr",
    description: "Get the QR code for WhatsApp session authentication",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

export async function handleSessionTool(
  client: WuzapiClient,
  toolName: string,
  _args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "session_status": {
      return client.get("/status");
    }
    case "session_connect": {
      return client.post("/connect");
    }
    case "session_disconnect": {
      return client.post("/disconnect");
    }
    case "session_qr": {
      return client.get("/qr");
    }
    default:
      throw new Error(`Unknown session tool: ${toolName}`);
  }
}
