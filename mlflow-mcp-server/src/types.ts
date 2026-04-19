export interface MLflowConfig {
  baseUrl: string;
  token?: string;
}

export interface Experiment {
  experiment_id: string;
  name: string;
  artifact_location?: string;
  lifecycle_stage?: string;
  last_update_time?: number;
  creation_time?: number;
  tags?: ExperimentTag[];
}

export interface ExperimentTag {
  key: string;
  value: string;
}

export interface Run {
  info: RunInfo;
  data?: RunData;
}

export interface RunInfo {
  run_id: string;
  run_uuid?: string;
  experiment_id: string;
  run_name?: string;
  user_id?: string;
  status: string;
  start_time?: number;
  end_time?: number;
  artifact_uri?: string;
  lifecycle_stage?: string;
}

export interface RunData {
  metrics?: Metric[];
  params?: Param[];
  tags?: RunTag[];
}

export interface Metric {
  key: string;
  value: number;
  timestamp: number;
  step?: number;
}

export interface Param {
  key: string;
  value: string;
}

export interface RunTag {
  key: string;
  value: string;
}

export interface RegisteredModel {
  name: string;
  creation_timestamp?: number;
  last_updated_timestamp?: number;
  description?: string;
  latest_versions?: ModelVersion[];
  tags?: ModelTag[];
}

export interface ModelVersion {
  name: string;
  version: string;
  creation_timestamp?: number;
  last_updated_timestamp?: number;
  current_stage?: string;
  source?: string;
  run_id?: string;
  status?: string;
  description?: string;
  tags?: ModelTag[];
}

export interface ModelTag {
  key: string;
  value: string;
}

export interface FileInfo {
  path: string;
  is_dir: boolean;
  file_size?: number;
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
