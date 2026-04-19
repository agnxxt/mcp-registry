export class SurrealDbClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    const url = process.env.SURREALDB_URL;
    const user = process.env.SURREALDB_USER;
    const pass = process.env.SURREALDB_PASS;
    const ns = process.env.SURREALDB_NS;
    const db = process.env.SURREALDB_DB;

    if (!url || !user || !pass || !ns || !db) {
      throw new Error(
        "Missing required environment variables: SURREALDB_URL, SURREALDB_USER, SURREALDB_PASS, SURREALDB_NS, SURREALDB_DB"
      );
    }

    this.baseUrl = url.replace(/\/+$/, "");
    const auth = Buffer.from(`${user}:${pass}`).toString("base64");

    this.headers = {
      Authorization: `Basic ${auth}`,
      "surreal-ns": ns,
      "surreal-db": db,
      Accept: "application/json",
    };
  }

  async request(
    method: string,
    path: string,
    body?: string | object,
    extraHeaders?: Record<string, string>
  ): Promise<unknown> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = { ...this.headers, ...extraHeaders };

    let requestBody: string | undefined;
    if (body !== undefined) {
      if (typeof body === "string") {
        requestBody = body;
      } else {
        requestBody = JSON.stringify(body);
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  }
}
