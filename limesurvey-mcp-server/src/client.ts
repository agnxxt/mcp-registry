export class LimeSurveyClient {
  private baseUrl: string;
  private username: string;
  private password: string;
  private sessionKey: string | null = null;

  constructor(url: string, username: string, password: string) {
    this.baseUrl = url.replace(/\/+$/, "") + "/index.php/admin/remotecontrol";
    this.username = username;
    this.password = password;
  }

  private async rpc(method: string, params: any[]): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        method,
        params,
        id: 1,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `LimeSurvey RPC error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`LimeSurvey RPC error: ${JSON.stringify(data.error)}`);
    }

    return data.result;
  }

  private async getSessionKey(): Promise<string> {
    if (this.sessionKey) {
      return this.sessionKey;
    }

    const result = await this.rpc("get_session_key", [
      this.username,
      this.password,
    ]);

    if (typeof result === "object" && result.status) {
      throw new Error(
        `Failed to get session key: ${JSON.stringify(result.status)}`
      );
    }

    this.sessionKey = result as string;
    return this.sessionKey;
  }

  /** Call a LimeSurvey JSON-RPC method. Session key is automatically prepended. */
  async call(method: string, ...params: any[]): Promise<any> {
    const sessionKey = await this.getSessionKey();
    return this.rpc(method, [sessionKey, ...params]);
  }
}
