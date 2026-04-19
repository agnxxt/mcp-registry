import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { PostizClient } from "../client.js";

export const mediaTools: Tool[] = [
  {
    name: "list_media",
    description: "List all media files in Postiz",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "upload_media",
    description: "Upload a media file to Postiz (provide a URL or base64 encoded content)",
    inputSchema: {
      type: "object" as const,
      properties: {
        url: { type: "string", description: "URL of the media to upload" },
        filename: { type: "string", description: "Filename for the uploaded media" },
        content: { type: "string", description: "Base64 encoded media content (alternative to url)" },
        contentType: { type: "string", description: "MIME type of the media (e.g. image/png, video/mp4)" },
      },
      required: [],
    },
  },
];

export async function handleMediaTool(
  client: PostizClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_media":
      return client.get("/media");
    case "upload_media": {
      const body: Record<string, unknown> = {};
      if (args.url) body.url = args.url;
      if (args.filename) body.filename = args.filename;
      if (args.content) body.content = args.content;
      if (args.contentType) body.contentType = args.contentType;
      return client.post("/media", body);
    }
    default:
      throw new Error(`Unknown media tool: ${name}`);
  }
}
