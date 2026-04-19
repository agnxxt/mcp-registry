# Skyvern MCP Server

MCP Server for Skyvern browser automation platform.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SKYVERN_URL` | Yes | Skyvern instance URL |
| `SKYVERN_API_KEY` | Yes | API key for authentication |

## Authentication

Uses `x-api-key` header for all requests.

## Tools (12)

### Tasks
- `skyvern_create_task` - Create a browser automation task
- `skyvern_get_task` - Get task details
- `skyvern_list_tasks` - List all tasks
- `skyvern_cancel_task` - Cancel a running task
- `skyvern_get_task_steps` - Get task steps

### Workflows
- `skyvern_create_workflow` - Create a workflow
- `skyvern_run_workflow` - Run a workflow
- `skyvern_get_workflow` - Get workflow details
- `skyvern_list_workflows` - List all workflows
- `skyvern_delete_workflow` - Delete a workflow
- `skyvern_get_workflow_run` - Get workflow run details
- `skyvern_list_workflow_runs` - List workflow runs

## Usage

```json
{
  "mcpServers": {
    "skyvern": {
      "command": "node",
      "args": ["path/to/skyvern-mcp-server/dist/index.js"],
      "env": {
        "SKYVERN_URL": "http://localhost:8000",
        "SKYVERN_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Build

```bash
npm install
npm run build
```
