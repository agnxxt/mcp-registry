# n8n MCP Server

MCP server for the n8n workflow automation API. Provides 29 tools covering workflows, executions, credentials, tags, users, and variables.

## Setup

```bash
npm install
npm run build
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_URL` | Yes | Base URL of your n8n instance (e.g. `https://n8n.example.com`) |
| `N8N_API_KEY` | Yes | n8n API key (Settings > API > Create API Key) |

## MCP Configuration

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/n8n-mcp-server/dist/index.js"],
      "env": {
        "N8N_URL": "https://n8n.example.com",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tools (29 total)

### Workflows (8)
- `list_workflows` - List all workflows with filtering
- `get_workflow` - Get a workflow by ID
- `create_workflow` - Create a new workflow
- `update_workflow` - Update a workflow
- `delete_workflow` - Delete a workflow
- `activate_workflow` - Activate a workflow
- `deactivate_workflow` - Deactivate a workflow
- `transfer_workflow` - Transfer workflow to another project

### Executions (5)
- `list_executions` - List executions with filtering
- `get_execution` - Get execution details
- `delete_execution` - Delete an execution record
- `run_workflow` - Manually trigger a workflow
- `stop_execution` - Stop a running execution

### Credentials (5)
- `list_credentials` - List all credentials
- `get_credential` - Get credential metadata
- `create_credential` - Create a new credential
- `update_credential` - Update a credential
- `delete_credential` - Delete a credential

### Tags (4)
- `list_tags` - List all tags
- `get_tag` - Get a tag by ID
- `create_tag` - Create a new tag
- `delete_tag` - Delete a tag

### Users (3)
- `list_users` - List all users
- `get_user` - Get a user by ID
- `get_current_user` - Get the authenticated user

### Variables (4)
- `list_variables` - List environment variables
- `create_variable` - Create a variable
- `update_variable` - Update a variable
- `delete_variable` - Delete a variable

## Development

```bash
npm run dev
```
