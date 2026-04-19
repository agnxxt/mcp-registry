import { LagoConfig } from "./types.js";

export class LagoClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: LagoConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async get(path: string, params?: Record<string, any>): Promise<any> {
    const url = new URL(`${this.baseUrl}/api/v1${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Lago API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    return response.json();
  }

  async post(path: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Lago API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async put(path: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Lago API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    return response.json();
  }

  async delete(path: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Lago API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
}
