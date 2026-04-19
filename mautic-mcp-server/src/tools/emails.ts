import type { MauticClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_emails",
    description: "List all emails in Mautic.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search string to filter emails",
        },
        start: {
          type: "number",
          description: "Starting row index for pagination (default 0)",
        },
        limit: {
          type: "number",
          description: "Number of emails to return (default 30)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.search) params.search = String(args.search);
      if (args.start !== undefined) params.start = String(args.start);
      if (args.limit !== undefined) params.limit = String(args.limit);
      return client.get("/emails", params);
    },
  },
  {
    name: "get_email",
    description: "Get a single email by ID, including stats and content.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Email ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.get(`/emails/${args.id}`),
  },
  {
    name: "create_email",
    description:
      "Create a new email in Mautic. Can be a template email or a segment (list) email.",
    inputSchema: {
      type: "object",
      required: ["name", "subject"],
      properties: {
        name: { type: "string", description: "Internal email name" },
        subject: { type: "string", description: "Email subject line" },
        customHtml: {
          type: "string",
          description: "Full HTML content of the email",
        },
        plainText: {
          type: "string",
          description: "Plain text version of the email",
        },
        emailType: {
          type: "string",
          enum: ["template", "list"],
          description:
            "Email type: 'template' for transactional/API sends, 'list' for segment-based sends",
        },
        isPublished: {
          type: "boolean",
          description: "Whether the email is published",
        },
        lists: {
          type: "array",
          items: { type: "number" },
          description:
            "Array of segment IDs to send to (required if emailType is 'list')",
        },
        fromName: {
          type: "string",
          description: "Sender name override",
        },
        fromAddress: {
          type: "string",
          description: "Sender email address override",
        },
        replyToAddress: {
          type: "string",
          description: "Reply-to email address",
        },
        language: {
          type: "string",
          description: "Language code (e.g. en)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        name: args.name,
        subject: args.subject,
      };
      const optionalFields = [
        "customHtml",
        "plainText",
        "emailType",
        "isPublished",
        "lists",
        "fromName",
        "fromAddress",
        "replyToAddress",
        "language",
      ];
      for (const f of optionalFields) {
        if (args[f] !== undefined) body[f] = args[f];
      }
      return client.post("/emails/new", body);
    },
  },
  {
    name: "send_email_to_contact",
    description:
      "Send a template email to a specific contact. The email must be of type 'template'.",
    inputSchema: {
      type: "object",
      required: ["id", "contactId"],
      properties: {
        id: { type: "number", description: "Email ID" },
        contactId: {
          type: "number",
          description: "Contact ID to send the email to",
        },
        tokens: {
          type: "object",
          description:
            "Key-value pairs of token replacements for the email content (e.g. {contactfield=firstname})",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (args.tokens !== undefined) body.tokens = args.tokens;
      return client.post(
        `/emails/${args.id}/contact/${args.contactId}/send`,
        Object.keys(body).length > 0 ? body : undefined
      );
    },
  },
  {
    name: "send_email_to_segment",
    description:
      "Send a segment (list) email to its assigned segments. The email must be of type 'list' and published.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "number",
          description: "Email ID (must be a list/segment email)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/emails/${args.id}/send`),
  },
];
