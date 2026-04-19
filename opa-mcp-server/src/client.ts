import { OPAConfig } from "./types.js";

export class OPAClient {
  private baseUrl: string;
  private token?: string;

  constructor(config: OPAConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "") + "/v1";
    this.token = config.token;
  }

  private getHeaders(contentType: string = "application/json"): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      Accept: "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    queryParams?: Record<string, string | number | boolean | undefined>,
    contentType?: string
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) {
        url += `?${qs}`;
      }
    }

    const options: RequestInit = {
      method,
      headers: this.getHeaders(contentType),
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      if (contentType === "text/plain") {
        options.body = body as string;
      } else {
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, options);
    const text = await response.text();

    let data: T;
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = text as unknown as T;
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === "object" && data !== null && "message" in data
          ? (data as Record<string, unknown>).message
          : text;
      throw new Error(`OPA API error ${response.status}: ${errorMessage}`);
    }

    return data;
  }

  async get<T = unknown>(
    path: string,
    queryParams?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    return this.request<T>("GET", path, undefined, queryParams);
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  async putRaw<T = unknown>(path: string, body: string): Promise<T> {
    return this.request<T>("PUT", path, body, undefined, "text/plain");
  }

  async patch<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  async delete<T = unknown>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}
