import axios, { AxiosInstance } from "axios";
import { ERPNextConfig } from "./types.js";

export function createERPNextClient(config: ERPNextConfig): AxiosInstance {
  return axios.create({
    baseURL: `${config.url}/api`,
    headers: {
      Authorization: `token ${config.apiKey}:${config.apiSecret}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      if (typeof v === "object") {
        q.append(k, JSON.stringify(v));
      } else {
        q.append(k, String(v));
      }
    }
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function ok(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function err(e: unknown) {
  let message = "Unknown error";
  if (isAxiosError(e)) {
    message = `HTTP ${e.response?.status}: ${JSON.stringify(e.response?.data ?? e.message)}`;
  } else if (e instanceof Error) {
    message = e.message;
  }
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  };
}

function isAxiosError(e: unknown): e is { response?: { status: number; data: unknown }; message: string } {
  return typeof e === "object" && e !== null && "isAxiosError" in e;
}
