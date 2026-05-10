# MetaMCP as Registry Manager

This document describes how **MetaMCP** (`metatool-ai/metamcp`) serves as the central MCP manager for all servers in the AGenNext/mcp-registry.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    AGenNext/mcp-registry                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │               MetaMCP (Control Plane)               │     │
│  │  • Version tracking    • Auth & secrets mgmt        │     │
│  │  • Namespace routing   • Rate limiting              │     │
│  │  • New server listing  • Middleware layer           │     │
│  │  • SSE / HTTP / OpenAPI endpoints                   │     │
│  └──────────────┬──────────────────────────────────────┘     │
│                 │ manages                                     │
│     ┌───────────┼────────────────────────────────┐           │
│     ▼           ▼           ▼                    ▼           │
│  n8n-mcp   slack-mcp   github-mcp   ... 58+ registry servers │
└──────────────────────────────────────────────────────────────┘
```

## Responsibilities

### 1. Version Management

Every `registry-entry.json` in this repo includes a `version` field. MetaMCP:

- Tracks the **currently running version** of each server
- Compares against the **latest version in registry-entry.json**
- Surfaces an "update available" badge in its dashboard
- One-click update: pulls new image, restarts server, logs version change

Version bump workflow:
```
Developer bumps version in registry-entry.json → PR merged →
MetaMCP operators see badge → click Update → done
```

### 2. Registry Authentication

MetaMCP manages credentials and secrets for every server:

- Stores per-server env vars/secrets (never in git)
- Supports `${ENV_VAR}` references resolved at runtime from MetaMCP's container env
- Issues **API keys** (`sk_mt_...`) or **OAuth tokens** to clients per endpoint
- Supports **OIDC/SSO** (Auth0, Azure AD, Keycloak, Okta, Google) for enterprise deployments
- **Multi-tenancy**: public vs. private scopes, per-user API keys

### 3. New MCP Listing Workflow

When a new server is added to this registry:

```
1. PR opened: add <server-name>/registry-entry.json
2. PR reviewed and merged
3. MetaMCP operator opens UI → MCP Servers → New Server
4. Pastes config from registry-entry.json
5. Creates/assigns a Namespace
6. Creates an Endpoint (chooses auth: API key or OAuth)
7. Publishes endpoint URL to team/consumers
```

Alternatively, MetaMCP can be configured to auto-discover new servers from a registry feed (see `registry/` folder).

### 4. Middleware and Traffic Management

Applied at the Namespace level, wrapping all servers assigned to it:

| Middleware | Description |
|---|---|
| **Filter inactive tools** | Removes disabled tools from LLM context |
| **Rate limiting** | Endpoint-level (shared counter) and per-user limits |
| **Tool overrides** | Rename/redescribe tools per namespace without touching server code |
| **Custom annotations** | Attach MCP annotations (e.g. `readOnlyHint`) to any tool |

### 5. Endpoint Types

MetaMCP exposes every namespace as three endpoint types:

| Type | URL pattern | Best for |
|---|---|---|
| SSE | `/metamcp/<NAME>/sse` | Cursor, most MCP clients |
| Streamable HTTP | `/metamcp/<NAME>/mcp` | Claude Desktop (via mcp-proxy) |
| OpenAPI | `/metamcp/<NAME>/openapi` | Open WebUI, REST consumers |

## Configuration Reference

### Environment Variables (`.env`)

```env
# Required
APP_URL=http://localhost:12005
DATABASE_URL=postgresql://metamcp:metamcp@metamcp-db:5432/metamcp
BETTER_AUTH_SECRET=<random-secret>

# Optional: OIDC SSO
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_DISCOVERY_URL=https://your-provider.com/.well-known/openid-configuration

# Optional: Registration controls
# DISABLE_UI_REGISTRATION=true
# DISABLE_SSO_REGISTRATION=false

# Logging: all | info | errors-only | none
LOG_LEVEL=errors-only
```

### Connecting Claude Desktop

```json
{
  "mcpServers": {
    "registry": {
      "command": "uvx",
      "args": [
        "mcp-proxy",
        "--transport", "streamablehttp",
        "http://localhost:12008/metamcp/<YOUR_ENDPOINT>/mcp"
      ],
      "env": {
        "API_ACCESS_TOKEN": "sk_mt_..."
      }
    }
  }
}
```

### Connecting Cursor

```json
{
  "mcpServers": {
    "registry": {
      "url": "http://localhost:12008/metamcp/<YOUR_ENDPOINT>/sse"
    }
  }
}
```

## Links

- MetaMCP repository: https://github.com/metatool-ai/metamcp
- MetaMCP documentation: https://docs.metamcp.com
- Docker image: `ghcr.io/metatool-ai/metamcp:latest`
- Registry entry: `metamcp/registry-entry.json`
