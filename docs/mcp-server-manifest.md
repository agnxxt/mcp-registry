# MCP Server Manifest

Every new MCP server package should include an `mcp-server.json` manifest at the root of its package folder:

```text
packages/<server-id>/mcp-server.json
```

The manifest makes the MCP registry searchable, validateable, and safer to consume programmatically.

Existing imported server folders can be migrated gradually. Normal validation warns about missing manifests; strict validation enforces them.

## Required fields

| Field | Purpose |
| --- | --- |
| `schemaVersion` | Manifest schema version. Use `1.0.0`. |
| `id` | Stable lowercase registry id. Should match the package folder name. |
| `name` | Human-readable MCP server name. |
| `version` | Server package version. SemVer or date-based versions are accepted. |
| `description` | Short explanation of what the server exposes. |
| `status` | One of `experimental`, `active`, `maintenance`, or `deprecated`. |
| `license` | License identifier or license note. |
| `entrypoints` | Package, README, source, Dockerfile, or config paths. |
| `runtime` | Runtime type, platforms, and optional Docker image. |
| `transport` | Supported MCP transport types. |
| `capabilities` | Tools, resources, and prompts exposed by the server. |
| `permissions` | Network, filesystem, shell, browser, and secret requirements. |
| `maintainers` | At least one maintainer contact. |

## Example

```json
{
  "schemaVersion": "1.0.0",
  "id": "example-mcp-server",
  "name": "Example MCP Server",
  "version": "0.1.0",
  "description": "A minimal example MCP server manifest for the AGenNext MCP registry.",
  "status": "experimental",
  "homepage": "https://github.com/AGenNext/mcp-registry/tree/main/packages/example-mcp-server",
  "repository": "https://github.com/AGenNext/mcp-registry",
  "license": "MIT",
  "tags": ["example", "starter"],
  "categories": ["developer-tools"],
  "entrypoints": {
    "package": "package.json",
    "readme": "README.md",
    "source": "src/index.ts",
    "dockerfile": "Dockerfile"
  },
  "runtime": {
    "type": "node",
    "minimumVersion": ">=20",
    "packageManager": "npm",
    "platforms": ["macos", "linux", "windows", "docker"],
    "dockerImage": "agentnxt/example-mcp-server"
  },
  "transport": {
    "types": ["stdio"],
    "default": "stdio"
  },
  "capabilities": {
    "tools": [
      {
        "name": "echo",
        "description": "Return the provided text for connectivity testing."
      }
    ],
    "resources": [],
    "prompts": []
  },
  "dependencies": [],
  "permissions": {
    "network": "none",
    "filesystem": "none",
    "shell": "none",
    "browser": "none",
    "secrets": [],
    "notes": "This example server requires no external access."
  },
  "maintainers": [
    {
      "name": "AGenNext",
      "github": "AGenNext"
    }
  ],
  "security": {
    "reviewed": false,
    "reviewNotes": "Example manifest only."
  }
}
```

## Transport values

- `stdio` - server communicates over standard input/output.
- `sse` - server exposes server-sent events.
- `streamable-http` - server exposes streamable HTTP transport.
- `websocket` - server communicates over WebSocket.
- `other` - custom or uncommon transport; explain in `transport.notes`.

## Permission values

Use the least permissive accurate value.

### `network`

- `none` - does not require network access.
- `optional` - can use network access, but has local-only behavior.
- `required` - cannot function without network access.

### `filesystem`

- `none` - does not read or write local files.
- `read` - reads local files or mounted volumes.
- `read-write` - writes files, edits projects, stores state, or creates artifacts.

### `shell`

- `none` - does not execute shell commands.
- `optional` - can execute commands for enhanced workflows.
- `required` - depends on shell execution.

### `browser`

- `none` - does not control or inspect a browser.
- `optional` - can use browser automation for optional workflows.
- `required` - depends on browser automation.

### `secrets`

List required environment variable names only. Never include secret values.

## Validation

The schema lives at:

```text
schemas/mcp-server.schema.json
```

Run migration-friendly validation:

```bash
npm run validate:registry
```

Run strict validation:

```bash
npm run validate:registry -- --strict
```

## Best practices

- Keep `id` stable forever after publishing.
- Document every exposed MCP tool in `capabilities.tools`.
- Prefer least-privilege permissions and clear secret names.
- Add `security.dataAccessNotes` for servers that access customer data, cloud APIs, local files, or databases.
- Use `status: deprecated` before removing a server.
- Keep README setup instructions aligned with manifest runtime, transport, and permissions.
