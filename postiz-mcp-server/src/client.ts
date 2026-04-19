import { PostizConfig, ApiResponse } from "./types.js";

export class PostizClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: PostizConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async request(
    method: string,
    path: string,
    body?: unknown,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse> {
    const url = new URL(`${this.baseUrl}/api${path}`);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Postiz API error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as ApiResponse;
    }

    return { success: true, status: response.status };
  }

  async get(
    path: string,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse> {
    return this.request("GET", path, undefined, queryParams);
  }

  async post(path: string, body?: unknown): Promise<ApiResponse> {
    return this.request("POST", path, body);
  }

  async put(path: string, body?: unknown): Promise<ApiResponse> {
    return this.request("PUT", path, body);
  }

  async delete(path: string): Promise<ApiResponse> {
    return this.request("DELETE", path);
  }
}
