export class ArgillaClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(url: string, apiKey: string) {
    this.baseUrl = url.replace(/\/+$/, "") + "/api/v1";
    this.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      "X-Argilla-Api-Key": this.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async get(path: string, params?: Record<string, any>): Promise<any> {
    const url = new URL(`${this.baseUrl}${path}`);
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
        `Argilla API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    return response.json();
  }

  async post(path: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Argilla API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async put(path: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Argilla API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async patch(path: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Argilla API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async delete(path: string, body?: any): Promise<any> {
    const options: RequestInit = {
      method: "DELETE",
      headers: this.getHeaders(),
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Argilla API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
}
