export class ZabbixClient {
  readonly baseUrl: string;
  private user: string;
  private password: string;
  private authToken: string | null = null;
  private requestId = 1;

  constructor(url: string, user: string, password: string) {
    this.baseUrl = url.replace(/\/$/, "");
    this.user = user;
    this.password = password;
  }

  private get endpoint(): string {
    return `${this.baseUrl}/api_jsonrpc.php`;
  }

  private async login(): Promise<string> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "user.login",
        params: {
          user: this.user,
          password: this.password,
        },
        id: this.requestId++,
      }),
    });

    if (!res.ok) {
      throw new Error(`Zabbix API HTTP ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { result?: string; error?: { message: string; data: string } };

    if (data.error) {
      throw new Error(`Zabbix login failed: ${data.error.message} - ${data.error.data}`);
    }

    if (!data.result) {
      throw new Error("Zabbix login returned no auth token");
    }

    return data.result;
  }

  private async ensureAuth(): Promise<string> {
    if (!this.authToken) {
      this.authToken = await this.login();
    }
    return this.authToken;
  }

  async call(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    // apiinfo.version does not require auth
    const needsAuth = method !== "apiinfo.version";

    const body: Record<string, unknown> = {
      jsonrpc: "2.0",
      method,
      params,
      id: this.requestId++,
    };

    if (needsAuth) {
      body.auth = await this.ensureAuth();
    }

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Zabbix API HTTP ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { result?: unknown; error?: { message: string; data: string } };

    if (data.error) {
      // If auth expired, retry once
      if (data.error.data?.includes("Not authorized") || data.error.data?.includes("Session terminated")) {
        this.authToken = null;
        body.auth = await this.ensureAuth();
        const retry = await fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const retryData = (await retry.json()) as { result?: unknown; error?: { message: string; data: string } };
        if (retryData.error) {
          throw new Error(`Zabbix API error: ${retryData.error.message} - ${retryData.error.data}`);
        }
        return retryData.result;
      }
      throw new Error(`Zabbix API error: ${data.error.message} - ${data.error.data}`);
    }

    return data.result;
  }
}
