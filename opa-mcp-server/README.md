# OPA MCP Server

MCP server for the [Open Policy Agent (OPA)](https://www.openpolicyagent.org/) REST API.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPA_URL` | Yes | Base URL of your OPA instance (e.g. `https://opa.example.com`) |
| `OPA_TOKEN` | No | Bearer token for authentication |

## Tools (~12)

### Policies
- `opa_list_policies` - List all loaded policies
- `opa_get_policy` - Get a policy by ID
- `opa_create_policy` - Create/update a policy (raw Rego text, sent as text/plain)
- `opa_delete_policy` - Delete a policy

### Data
- `opa_get_data` - Get a data document at a path
- `opa_create_data` - Create/overwrite data at a path
- `opa_patch_data` - Patch data using JSON Patch (RFC 6902)
- `opa_delete_data` - Delete data at a path

### Query
- `opa_query` - Evaluate a policy decision with input
- `opa_compile` - Partially evaluate a query (compile API)
- `opa_health` - Check OPA health status
- `opa_config` - Get active OPA configuration

## Usage

```bash
OPA_URL=https://your-opa.com OPA_TOKEN=optional-token npx @mcphub/opa-mcp-server
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
