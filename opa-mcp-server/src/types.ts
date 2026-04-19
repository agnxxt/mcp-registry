export interface OPAConfig {
  baseUrl: string;
  token?: string;
}

export interface Policy {
  id: string;
  raw: string;
  ast?: Record<string, unknown>;
}

export interface PolicyList {
  result: Policy[];
}

export interface DataDocument {
  result: unknown;
}

export interface QueryResult {
  result: unknown;
  metrics?: Record<string, unknown>;
  decision_id?: string;
}

export interface CompileResult {
  result: {
    queries?: unknown[];
    support?: unknown[];
  };
}

export interface HealthResult {
  [key: string]: unknown;
}

export interface ConfigResult {
  result: Record<string, unknown>;
}

export interface PatchOperation {
  op: "add" | "remove" | "replace";
  path: string;
  value?: unknown;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}
