import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvolutionClient } from "../client.js";

export const messageTools: Tool[] = [
  {
    name: "send_text",
    description: "Send a text message via Evolution API WhatsApp instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        number: { type: "string", description: "Recipient phone number (with country code)" },
        text: { type: "string", description: "Message text" },
      },
      required: ["instanceName", "number", "text"],
    },
  },
  {
    name: "send_media",
    description: "Send a media message (image, video, audio, document) via Evolution API",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        number: { type: "string", description: "Recipient phone number (with country code)" },
        mediatype: { type: "string", description: "Media type: image, video, audio, document" },
        media: { type: "string", description: "URL or base64 of the media" },
        caption: { type: "string", description: "Optional caption for the media" },
      },
      required: ["instanceName", "number", "mediatype", "media"],
    },
  },
  {
    name: "send_location",
    description: "Send a location message via Evolution API",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        number: { type: "string", description: "Recipient phone number (with country code)" },
        latitude: { type: "number", description: "Latitude coordinate" },
        longitude: { type: "number", description: "Longitude coordinate" },
        locName: { type: "string", description: "Location name/label" },
      },
      required: ["instanceName", "number", "latitude", "longitude"],
    },
  },
];

export async function handleMessageTool(
  client: EvolutionClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "send_text":
      return client.post(`/message/sendText/${args.instanceName}`, {
        number: args.number,
        text: args.text,
      });
    case "send_media": {
      const body: Record<string, unknown> = {
        number: args.number,
        mediatype: args.mediatype,
        media: args.media,
      };
      if (args.caption) body.caption = args.caption;
      return client.post(`/message/sendMedia/${args.instanceName}`, body);
    }
    case "send_location": {
      const body: Record<string, unknown> = {
        number: args.number,
        latitude: args.latitude,
        longitude: args.longitude,
      };
      if (args.locName) body.name = args.locName;
      return client.post(`/message/sendLocation/${args.instanceName}`, body);
    }
    default:
      throw new Error(`Unknown message tool: ${name}`);
  }
}
