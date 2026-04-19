import { AxiosInstance } from "axios";
import { buildQuery, ok, err } from "../client.js";

type GetClient = () => AxiosInstance;

export function registerFileTools(server: any, getClient: GetClient) {
  const tool = (name: string, desc: string, schema: object, fn: (a: any) => Promise<unknown>) => {
    server.tool(name, desc, schema, async (args: any) => {
      try {
        return ok(await fn(args));
      } catch (e) {
        return err(e);
      }
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // upload_file - POST /method/upload_file
  // ═══════════════════════════════════════════════════════════════

  tool("upload_file", "Upload a file to ERPNext. Provide file content as base64 or a URL to fetch from", {
    type: "object",
    required: ["filename"],
    properties: {
      filename: { type: "string", description: "Name of the file (e.g. 'invoice.pdf')" },
      filedata: { type: "string", description: "Base64-encoded file content" },
      file_url: { type: "string", description: "URL to fetch the file from (alternative to filedata)" },
      doctype: { type: "string", description: "Attach to this DocType (optional)" },
      docname: { type: "string", description: "Attach to this document name (optional)" },
      is_private: { type: "boolean", description: "Whether the file is private (default false)" },
      folder: { type: "string", description: "Folder path (e.g. 'Home/Attachments')" },
    },
  }, async ({ filename, filedata, file_url, doctype, docname, is_private, folder }) => {
    const body: Record<string, unknown> = { filename };
    if (filedata) body.filedata = filedata;
    if (file_url) body.file_url = file_url;
    if (doctype) body.doctype = doctype;
    if (docname) body.docname = docname;
    if (is_private !== undefined) body.is_private = is_private ? 1 : 0;
    if (folder) body.folder = folder;
    const res = await getClient().post("/method/upload_file", body);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // list_files - GET /resource/File
  // ═══════════════════════════════════════════════════════════════

  tool("list_files", "List files stored in ERPNext with optional filters", {
    type: "object",
    properties: {
      filters: { type: "string", description: "JSON array of filter conditions (e.g. [[\"attached_to_doctype\",\"=\",\"Sales Order\"]])" },
      fields: { type: "string", description: "JSON array of fields to return" },
      limit_page_length: { type: "number", description: "Number of results (default 20)" },
      order_by: { type: "string", description: "Order by clause (e.g. 'creation desc')" },
    },
  }, async (params) => {
    const res = await getClient().get(`/resource/File${buildQuery(params)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_file - GET /resource/File/{name}
  // ═══════════════════════════════════════════════════════════════

  tool("get_file", "Get metadata for a specific file by its name/ID", {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", description: "The File document name/ID" },
    },
  }, async ({ name }) => {
    const res = await getClient().get(`/resource/File/${encodeURIComponent(name)}`);
    return res.data;
  });
}
