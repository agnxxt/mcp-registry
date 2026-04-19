import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WuzapiClient } from "../client.js";

export const messageTools: Tool[] = [
  {
    name: "send_text",
    description: "Send a text message via WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Recipient phone number (with country code, no + prefix)" },
        message: { type: "string", description: "Text message content" },
      },
      required: ["phone", "message"],
    },
  },
  {
    name: "send_image",
    description: "Send an image via WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Recipient phone number" },
        image: { type: "string", description: "Image URL or base64-encoded image data" },
        caption: { type: "string", description: "Optional caption for the image" },
      },
      required: ["phone", "image"],
    },
  },
  {
    name: "send_document",
    description: "Send a document file via WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Recipient phone number" },
        document: { type: "string", description: "Document URL or base64-encoded data" },
        filename: { type: "string", description: "Filename for the document" },
      },
      required: ["phone", "document"],
    },
  },
  {
    name: "send_audio",
    description: "Send an audio file via WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Recipient phone number" },
        audio: { type: "string", description: "Audio URL or base64-encoded audio data" },
      },
      required: ["phone", "audio"],
    },
  },
  {
    name: "send_video",
    description: "Send a video via WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Recipient phone number" },
        video: { type: "string", description: "Video URL or base64-encoded video data" },
        caption: { type: "string", description: "Optional caption for the video" },
      },
      required: ["phone", "video"],
    },
  },
  {
    name: "send_contact",
    description: "Send a contact card via WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Recipient phone number" },
        contactPhone: { type: "string", description: "Phone number of the contact to share" },
        contactName: { type: "string", description: "Display name of the contact to share" },
      },
      required: ["phone", "contactPhone", "contactName"],
    },
  },
];

export async function handleMessageTool(
  client: WuzapiClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "send_text": {
      const { phone, message } = args as { phone: string; message: string };
      return client.post("/send/text", { phone, message });
    }
    case "send_image": {
      const { phone, image, caption } = args as {
        phone: string;
        image: string;
        caption?: string;
      };
      return client.post("/send/image", { phone, image, caption });
    }
    case "send_document": {
      const { phone, document, filename } = args as {
        phone: string;
        document: string;
        filename?: string;
      };
      return client.post("/send/document", { phone, document, filename });
    }
    case "send_audio": {
      const { phone, audio } = args as { phone: string; audio: string };
      return client.post("/send/audio", { phone, audio });
    }
    case "send_video": {
      const { phone, video, caption } = args as {
        phone: string;
        video: string;
        caption?: string;
      };
      return client.post("/send/video", { phone, video, caption });
    }
    case "send_contact": {
      const { phone, contactPhone, contactName } = args as {
        phone: string;
        contactPhone: string;
        contactName: string;
      };
      return client.post("/send/contact", { phone, contactPhone, contactName });
    }
    default:
      throw new Error(`Unknown message tool: ${toolName}`);
  }
}
