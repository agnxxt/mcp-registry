import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TuwunelClient } from "../client.js";

export const roomTools: Tool[] = [
  {
    name: "list_joined_rooms",
    description: "List all rooms the authenticated user has joined",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_room",
    description: "Create a new Matrix room",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Room name" },
        topic: { type: "string", description: "Room topic" },
        preset: {
          type: "string",
          description: "Room preset: private_chat, public_chat, or trusted_private_chat",
        },
        invite: {
          type: "array",
          items: { type: "string" },
          description: "List of user IDs to invite",
        },
        room_alias_name: { type: "string", description: "Local alias for the room (without # and :server)" },
      },
      required: [],
    },
  },
  {
    name: "join_room",
    description: "Join a room by room ID or alias",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomIdOrAlias: { type: "string", description: "Room ID (e.g. !abc:server) or alias (e.g. #room:server)" },
      },
      required: ["roomIdOrAlias"],
    },
  },
  {
    name: "leave_room",
    description: "Leave a room by room ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID to leave" },
      },
      required: ["roomId"],
    },
  },
  {
    name: "get_room_state",
    description: "Get the full state of a room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
      },
      required: ["roomId"],
    },
  },
  {
    name: "set_room_name",
    description: "Set the name of a room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
        name: { type: "string", description: "New room name" },
      },
      required: ["roomId", "name"],
    },
  },
  {
    name: "set_room_topic",
    description: "Set the topic of a room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
        topic: { type: "string", description: "New room topic" },
      },
      required: ["roomId", "topic"],
    },
  },
  {
    name: "invite_to_room",
    description: "Invite a user to a room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
        user_id: { type: "string", description: "User ID to invite (e.g. @user:server)" },
      },
      required: ["roomId", "user_id"],
    },
  },
  {
    name: "kick_from_room",
    description: "Kick a user from a room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
        user_id: { type: "string", description: "User ID to kick" },
        reason: { type: "string", description: "Optional reason for the kick" },
      },
      required: ["roomId", "user_id"],
    },
  },
];

export async function handleRoomTool(
  client: TuwunelClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_joined_rooms": {
      return client.get("/joined_rooms");
    }
    case "create_room": {
      const { name, topic, preset, invite, room_alias_name } = args as {
        name?: string;
        topic?: string;
        preset?: string;
        invite?: string[];
        room_alias_name?: string;
      };
      const body: Record<string, unknown> = {};
      if (name !== undefined) body.name = name;
      if (topic !== undefined) body.topic = topic;
      if (preset !== undefined) body.preset = preset;
      if (invite !== undefined) body.invite = invite;
      if (room_alias_name !== undefined) body.room_alias_name = room_alias_name;
      return client.post("/createRoom", body);
    }
    case "join_room": {
      const { roomIdOrAlias } = args as { roomIdOrAlias: string };
      return client.post(`/join/${encodeURIComponent(roomIdOrAlias)}`);
    }
    case "leave_room": {
      const { roomId } = args as { roomId: string };
      return client.post(`/rooms/${encodeURIComponent(roomId)}/leave`);
    }
    case "get_room_state": {
      const { roomId } = args as { roomId: string };
      return client.get(`/rooms/${encodeURIComponent(roomId)}/state`);
    }
    case "set_room_name": {
      const { roomId, name } = args as { roomId: string; name: string };
      return client.put(
        `/rooms/${encodeURIComponent(roomId)}/state/m.room.name`,
        { name }
      );
    }
    case "set_room_topic": {
      const { roomId, topic } = args as { roomId: string; topic: string };
      return client.put(
        `/rooms/${encodeURIComponent(roomId)}/state/m.room.topic`,
        { topic }
      );
    }
    case "invite_to_room": {
      const { roomId, user_id } = args as { roomId: string; user_id: string };
      return client.post(
        `/rooms/${encodeURIComponent(roomId)}/invite`,
        { user_id }
      );
    }
    case "kick_from_room": {
      const { roomId, user_id, reason } = args as {
        roomId: string;
        user_id: string;
        reason?: string;
      };
      const body: Record<string, unknown> = { user_id };
      if (reason !== undefined) body.reason = reason;
      return client.post(
        `/rooms/${encodeURIComponent(roomId)}/kick`,
        body
      );
    }
    default:
      throw new Error(`Unknown room tool: ${toolName}`);
  }
}
