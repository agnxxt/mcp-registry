import { WooCommerceConfig, ApiResponse } from "./types.js";

export class WooCommerceClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(config: WooCommerceConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    const credentials = Buffer.from(
      `${config.consumerKey}:${config.consumerSecret}`
    ).toString("base64");
    this.authHeader = `Basic ${credentials}`;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: this.authHeader,
      "Content-Type": "application/json",
    };
  }

  async request(
    method: string,
    path: string,
    body?: unknown,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse> {
    const url = new URL(`${this.baseUrl}/wp-json/wc/v3${path}`);

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
      throw new Error(
        `WooCommerce API error ${response.status}: ${errorText}`
      );
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

  async delete(
    path: string,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse> {
    return this.request("DELETE", path, undefined, queryParams);
  }
}
