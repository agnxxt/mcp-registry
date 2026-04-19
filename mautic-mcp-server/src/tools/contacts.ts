import type { MauticClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_contacts",
    description:
      "List contacts in Mautic. Supports search, pagination, and sorting.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search string to filter contacts",
        },
        start: {
          type: "number",
          description: "Starting row index for pagination (default 0)",
        },
        limit: {
          type: "number",
          description: "Number of contacts to return (default 30)",
        },
        orderBy: {
          type: "string",
          description: "Field to order results by (e.g. email, firstname)",
        },
        orderByDir: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Order direction: asc or desc",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.search) params.search = String(args.search);
      if (args.start !== undefined) params.start = String(args.start);
      if (args.limit !== undefined) params.limit = String(args.limit);
      if (args.orderBy) params.orderBy = String(args.orderBy);
      if (args.orderByDir) params.orderByDir = String(args.orderByDir);
      return client.get("/contacts", params);
    },
  },
  {
    name: "get_contact",
    description: "Get a single contact by ID, including all custom fields.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Contact ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.get(`/contacts/${args.id}`),
  },
  {
    name: "create_contact",
    description:
      "Create a new contact in Mautic with standard and custom fields.",
    inputSchema: {
      type: "object",
      properties: {
        firstname: { type: "string", description: "First name" },
        lastname: { type: "string", description: "Last name" },
        email: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number" },
        company: { type: "string", description: "Company name" },
        position: { type: "string", description: "Job title / position" },
        city: { type: "string", description: "City" },
        state: { type: "string", description: "State or region" },
        country: { type: "string", description: "Country" },
        zipcode: { type: "string", description: "Zip/postal code" },
        address1: { type: "string", description: "Street address line 1" },
        address2: { type: "string", description: "Street address line 2" },
        website: { type: "string", description: "Website URL" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags to assign to the contact",
        },
        ipAddress: {
          type: "string",
          description: "IP address to associate with the contact",
        },
        overwriteWithBlank: {
          type: "boolean",
          description: "If true, blank values overwrite existing values",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      const fields = [
        "firstname",
        "lastname",
        "email",
        "phone",
        "company",
        "position",
        "city",
        "state",
        "country",
        "zipcode",
        "address1",
        "address2",
        "website",
        "tags",
        "ipAddress",
        "overwriteWithBlank",
      ];
      for (const f of fields) {
        if (args[f] !== undefined) body[f] = args[f];
      }
      return client.post("/contacts/new", body);
    },
  },
  {
    name: "update_contact",
    description:
      "Update an existing contact by ID. Only provided fields are updated.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Contact ID" },
        firstname: { type: "string", description: "First name" },
        lastname: { type: "string", description: "Last name" },
        email: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number" },
        company: { type: "string", description: "Company name" },
        position: { type: "string", description: "Job title / position" },
        city: { type: "string", description: "City" },
        state: { type: "string", description: "State or region" },
        country: { type: "string", description: "Country" },
        zipcode: { type: "string", description: "Zip/postal code" },
        address1: { type: "string", description: "Street address line 1" },
        address2: { type: "string", description: "Street address line 2" },
        website: { type: "string", description: "Website URL" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags to assign to the contact",
        },
        overwriteWithBlank: {
          type: "boolean",
          description: "If true, blank values overwrite existing values",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const { id, ...body } = args;
      return client.patch(`/contacts/${id}/edit`, body);
    },
  },
  {
    name: "delete_contact",
    description: "Delete a contact by ID. This action is irreversible.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Contact ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.delete(`/contacts/${args.id}/delete`),
  },
  {
    name: "add_points",
    description: "Add points to a contact.",
    inputSchema: {
      type: "object",
      required: ["id", "points"],
      properties: {
        id: { type: "number", description: "Contact ID" },
        points: { type: "number", description: "Number of points to add" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/contacts/${args.id}/points/plus/${args.points}`),
  },
  {
    name: "subtract_points",
    description: "Subtract points from a contact.",
    inputSchema: {
      type: "object",
      required: ["id", "points"],
      properties: {
        id: { type: "number", description: "Contact ID" },
        points: {
          type: "number",
          description: "Number of points to subtract",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/contacts/${args.id}/points/minus/${args.points}`),
  },
];
