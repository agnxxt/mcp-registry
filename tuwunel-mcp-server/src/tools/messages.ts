import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TuwunelClient } from "../client.js";

export const messageTools: Tool[] = [
  {
    name: "send_message",
    description: "Send a text message to a Matrix room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID to send the message to" },
        body: { type: "string", description: "Message text content" },
      },
      required: ["roomId", "body"],
    },
  },
  {
    name: "get_messages",
    description: "Get messages from a room with pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
        from: { type: "string", description: "Pagination token to start from" },
        dir: { type: "string", description: "Direction: 'b' for backwards, 'f' for forwards" },
        limit: { type: "number", description: "Maximum number of messages to return" },
        filter: { type: "string", description: "JSON-encoded filter string" },
      },
      required: ["roomId"],
    },
  },
  {
    name: "search_messages",
    description: "Search for messages across rooms",
    inputSchema: {
      type: "object" as const,
      properties: {
        search_term: { type: "string", description: "Text to search for in messages" },
      },
      required: ["search_term"],
    },
  },
];

function generateTxnId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `m${timestamp}.${random}`;
}

export async function handleMessageTool(
  client: TuwunelClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "send_message": {
      const { roomId, body } = args as { roomId: string; body: string };
      const txnId = generateTxnId();
      return client.put(
        `/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`,
        { msgtype: "m.text", body }
      );
    }
    case "get_messages": {
      const { roomId, from, dir, limit, filter } = args as {
        roomId: string;
        from?: string;
        dir?: string;
        limit?: number;
        filter?: string;
      };
      return client.get(
        `/rooms/${encodeURIComponent(roomId)}/messages`,
        {
          from,
          dir: dir ?? "b",
          limit,
          filter,
        }
      );
    }
    case "search_messages": {
      const { search_term } = args as { search_term: string };
      return client.post("/search", {
        search_categories: {
          room_events: {
            search_term,
          },
        },
      });
    }
    default:
      throw new Error(`Unknown message tool: ${toolName}`);
  }
}
