import { AxiosInstance } from "axios";
import { buildQuery, ok, err } from "../client.js";

type GetClient = () => AxiosInstance;

export function registerMetaTools(server: any, getClient: GetClient) {
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
  // get_doctype_meta - GET /method/frappe.client.get_meta
  // ═══════════════════════════════════════════════════════════════

  tool("get_doctype_meta", "Get full metadata (fields, permissions, links) for a DocType", {
    type: "object",
    required: ["doctype"],
    properties: {
      doctype: { type: "string", description: "The DocType to get metadata for (e.g. 'Sales Order')" },
    },
  }, async ({ doctype }) => {
    const res = await getClient().get(`/method/frappe.client.get_meta${buildQuery({ doctype })}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_doctype_list - GET /resource/DocType
  // ═══════════════════════════════════════════════════════════════

  tool("get_doctype_list", "List available DocTypes with optional filters", {
    type: "object",
    properties: {
      filters: { type: "string", description: "JSON array of filter conditions (e.g. [[\"module\",\"=\",\"Selling\"]])" },
      fields: { type: "string", description: "JSON array of fields to return (e.g. [\"name\",\"module\"])" },
      limit_page_length: { type: "number", description: "Number of results (default 20, use 0 for all)" },
      order_by: { type: "string", description: "Order by clause" },
    },
  }, async (params) => {
    const res = await getClient().get(`/resource/DocType${buildQuery(params)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_print_format - GET /method/frappe.utils.print_format.download_pdf
  // ═══════════════════════════════════════════════════════════════

  tool("get_print_format", "Download a document as PDF using a print format (returns base64-encoded PDF info)", {
    type: "object",
    required: ["doctype", "name"],
    properties: {
      doctype: { type: "string", description: "The DocType (e.g. 'Sales Invoice')" },
      name: { type: "string", description: "The document name/ID" },
      format: { type: "string", description: "Print format name (uses default if omitted)" },
      letterhead: { type: "string", description: "Letter Head name (uses default if omitted)" },
    },
  }, async ({ doctype, name, format, letterhead }) => {
    const params: Record<string, unknown> = { doctype, name };
    if (format) params.format = format;
    if (letterhead) params.letterhead = letterhead;
    const res = await getClient().get(
      `/method/frappe.utils.print_format.download_pdf${buildQuery(params)}`,
      { responseType: "arraybuffer" }
    );
    const base64 = Buffer.from(res.data).toString("base64");
    return {
      message: `PDF generated for ${doctype} ${name}`,
      content_type: "application/pdf",
      size_bytes: res.data.byteLength,
      base64_preview: base64.substring(0, 200) + "...",
    };
  });

  // ═══════════════════════════════════════════════════════════════
  // get_report_builder - GET /method/frappe.desk.reportview.get
  // ═══════════════════════════════════════════════════════════════

  tool("get_report_builder", "Query data using Frappe's Report Builder / reportview API", {
    type: "object",
    required: ["doctype"],
    properties: {
      doctype: { type: "string", description: "The DocType to query" },
      filters: { type: "string", description: "JSON array of filter conditions" },
      fields: { type: "string", description: "JSON array of fields (supports aggregations like 'count(name)')" },
      order_by: { type: "string", description: "Order by clause" },
      group_by: { type: "string", description: "Group by clause" },
      limit_start: { type: "number", description: "Offset for pagination" },
      limit_page_length: { type: "number", description: "Number of results" },
      with_comment_count: { type: "boolean", description: "Include comment count per row" },
    },
  }, async ({ doctype, ...params }) => {
    const query = buildQuery({ doctype, ...params });
    const res = await getClient().get(`/method/frappe.desk.reportview.get${query}`);
    return res.data;
  });
}
