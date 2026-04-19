import { AxiosInstance } from "axios";
import { buildQuery, ok, err } from "../client.js";

type GetClient = () => AxiosInstance;

export function registerDocumentTools(server: any, getClient: GetClient) {
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
  // list_documents - GET /resource/{doctype}
  // ═══════════════════════════════════════════════════════════════

  tool("list_documents", "List documents of a given DocType with optional filters, fields, ordering and pagination", {
    type: "object",
    required: ["doctype"],
    properties: {
      doctype: { type: "string", description: "The DocType to list (e.g. 'Sales Order', 'Customer')" },
      filters: { type: "string", description: "JSON array of filter conditions, e.g. [[\"status\",\"=\",\"Open\"]]" },
      fields: { type: "string", description: "JSON array of field names to return, e.g. [\"name\",\"status\"]" },
      order_by: { type: "string", description: "Order by clause, e.g. 'creation desc'" },
      limit_start: { type: "number", description: "Offset for pagination (default 0)" },
      limit_page_length: { type: "number", description: "Number of results to return (default 20)" },
    },
  }, async ({ doctype, ...params }) => {
    const query = buildQuery(params);
    const res = await getClient().get(`/resource/${encodeURIComponent(doctype)}${query}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_document - GET /resource/{doctype}/{name}
  // ═══════════════════════════════════════════════════════════════

  tool("get_document", "Get a single document by DocType and name", {
    type: "object",
    required: ["doctype", "name"],
    properties: {
      doctype: { type: "string", description: "The DocType (e.g. 'Sales Order')" },
      name: { type: "string", description: "The document name/ID" },
    },
  }, async ({ doctype, name }) => {
    const res = await getClient().get(`/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // create_document - POST /resource/{doctype}
  // ═══════════════════════════════════════════════════════════════

  tool("create_document", "Create a new document of a given DocType", {
    type: "object",
    required: ["doctype", "data"],
    properties: {
      doctype: { type: "string", description: "The DocType to create (e.g. 'Customer')" },
      data: { type: "object", description: "Document fields as key-value pairs" },
    },
  }, async ({ doctype, data }) => {
    const res = await getClient().post(`/resource/${encodeURIComponent(doctype)}`, data);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // update_document - PUT /resource/{doctype}/{name}
  // ═══════════════════════════════════════════════════════════════

  tool("update_document", "Update an existing document by DocType and name", {
    type: "object",
    required: ["doctype", "name", "data"],
    properties: {
      doctype: { type: "string", description: "The DocType (e.g. 'Sales Order')" },
      name: { type: "string", description: "The document name/ID" },
      data: { type: "object", description: "Fields to update as key-value pairs" },
    },
  }, async ({ doctype, name, data }) => {
    const res = await getClient().put(
      `/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
      data
    );
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // delete_document - DELETE /resource/{doctype}/{name}
  // ═══════════════════════════════════════════════════════════════

  tool("delete_document", "Delete a document by DocType and name", {
    type: "object",
    required: ["doctype", "name"],
    properties: {
      doctype: { type: "string", description: "The DocType (e.g. 'Sales Order')" },
      name: { type: "string", description: "The document name/ID" },
    },
  }, async ({ doctype, name }) => {
    const res = await getClient().delete(
      `/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`
    );
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_count - GET /method/frappe.client.get_count
  // ═══════════════════════════════════════════════════════════════

  tool("get_count", "Get the count of documents of a DocType matching optional filters", {
    type: "object",
    required: ["doctype"],
    properties: {
      doctype: { type: "string", description: "The DocType to count" },
      filters: { type: "string", description: "JSON array of filter conditions" },
    },
  }, async ({ doctype, filters }) => {
    const params: Record<string, unknown> = { doctype };
    if (filters) params.filters = filters;
    const res = await getClient().get(`/method/frappe.client.get_count${buildQuery(params)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_list - GET /method/frappe.client.get_list
  // ═══════════════════════════════════════════════════════════════

  tool("get_list", "Get a list of documents using frappe.client.get_list with advanced options", {
    type: "object",
    required: ["doctype"],
    properties: {
      doctype: { type: "string", description: "The DocType to query" },
      filters: { type: "string", description: "JSON array of filter conditions" },
      fields: { type: "string", description: "JSON array of fields to return" },
      limit: { type: "number", description: "Max number of results" },
      order_by: { type: "string", description: "Order by clause" },
      group_by: { type: "string", description: "Group by clause" },
    },
  }, async ({ doctype, ...params }) => {
    const query = buildQuery({ doctype, ...params });
    const res = await getClient().get(`/method/frappe.client.get_list${query}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // run_doc_method - POST /method/run_doc_method
  // ═══════════════════════════════════════════════════════════════

  tool("run_doc_method", "Run a whitelisted method on a specific document", {
    type: "object",
    required: ["dt", "dn", "method"],
    properties: {
      dt: { type: "string", description: "DocType of the document" },
      dn: { type: "string", description: "Name of the document" },
      method: { type: "string", description: "Method name to call on the document" },
      args: { type: "object", description: "Arguments to pass to the method" },
    },
  }, async ({ dt, dn, method, args }) => {
    const body: Record<string, unknown> = {
      docs: JSON.stringify({ doctype: dt, name: dn }),
      method,
    };
    if (args) body.args = JSON.stringify(args);
    const res = await getClient().post("/method/run_doc_method", body);
    return res.data;
  });
}
