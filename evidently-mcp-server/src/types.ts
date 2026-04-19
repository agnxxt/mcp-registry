export interface EvidentlyConfig {
  baseUrl: string;
  token?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Snapshot {
  id: string;
  project_id: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
  tags?: Record<string, string>;
}

export interface DashboardInfo {
  name?: string;
  panels?: PanelConfig[];
  [key: string]: unknown;
}

export interface PanelConfig {
  id?: string;
  title?: string;
  type?: string;
  size?: number;
  values?: Record<string, unknown>[];
  [key: string]: unknown;
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
