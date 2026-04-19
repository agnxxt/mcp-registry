import { AxiosInstance } from "axios";
import { buildQuery, ok, err } from "../client.js";

type GetClient = () => AxiosInstance;

export function registerMethodTools(server: any, getClient: GetClient) {
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
  // call_method - GET /method/{dotted_path}
  // ═══════════════════════════════════════════════════════════════

  tool("call_method", "Call a whitelisted Frappe method via GET with optional query parameters", {
    type: "object",
    required: ["method"],
    properties: {
      method: { type: "string", description: "Dotted method path (e.g. 'frappe.client.get_count')" },
      params: { type: "object", description: "Query parameters as key-value pairs" },
    },
  }, async ({ method, params }) => {
    const query = params ? buildQuery(params) : "";
    const res = await getClient().get(`/method/${method}${query}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // post_method - POST /method/{dotted_path}
  // ═══════════════════════════════════════════════════════════════

  tool("post_method", "Call a whitelisted Frappe method via POST with a request body", {
    type: "object",
    required: ["method"],
    properties: {
      method: { type: "string", description: "Dotted method path (e.g. 'erpnext.selling.doctype.sales_order.sales_order.make_delivery_note')" },
      body: { type: "object", description: "Request body as key-value pairs" },
    },
  }, async ({ method, body }) => {
    const res = await getClient().post(`/method/${method}`, body ?? {});
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_api_info - GET /method/frappe.client.get_api
  // ═══════════════════════════════════════════════════════════════

  tool("get_api_info", "Get API metadata for a DocType including whitelisted methods and field info", {
    type: "object",
    required: ["doctype"],
    properties: {
      doctype: { type: "string", description: "The DocType to get API info for" },
    },
  }, async ({ doctype }) => {
    const res = await getClient().get(`/method/frappe.client.get_api${buildQuery({ doctype })}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // search_link - GET /method/frappe.client.search_link
  // ═══════════════════════════════════════════════════════════════

  tool("search_link", "Search for link field values (autocomplete) for a DocType", {
    type: "object",
    required: ["doctype", "txt"],
    properties: {
      doctype: { type: "string", description: "The DocType to search in" },
      txt: { type: "string", description: "Search text" },
      filters: { type: "string", description: "JSON object of additional filters" },
      page_length: { type: "number", description: "Max number of results (default 20)" },
    },
  }, async ({ doctype, txt, filters, page_length }) => {
    const params: Record<string, unknown> = { doctype, txt };
    if (filters) params.filters = filters;
    if (page_length !== undefined) params.page_length = page_length;
    const res = await getClient().get(`/method/frappe.client.search_link${buildQuery(params)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_value - POST /method/frappe.client.get_value
  // ═══════════════════════════════════════════════════════════════

  tool("get_value", "Get a specific field value from a document matching filters", {
    type: "object",
    required: ["doctype", "fieldname"],
    properties: {
      doctype: { type: "string", description: "The DocType to query" },
      fieldname: { type: "string", description: "Field name or JSON array of field names to return" },
      filters: { type: "string", description: "JSON object of filter conditions" },
    },
  }, async ({ doctype, fieldname, filters }) => {
    const body: Record<string, unknown> = { doctype, fieldname };
    if (filters) body.filters = filters;
    const res = await getClient().post("/method/frappe.client.get_value", body);
    return res.data;
  });
}
