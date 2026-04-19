# Temporal MCP Server

MCP Server for Temporal workflow orchestration platform.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TEMPORAL_URL` | Yes | Temporal server URL |
| `TEMPORAL_NAMESPACE` | No | Namespace (default: "default") |
| `TEMPORAL_API_KEY` | No | API key for Bearer auth |

## Tools (16)

### Namespaces
- `temporal_list_namespaces` - List all namespaces
- `temporal_get_namespace` - Get namespace details

### Workflows
- `temporal_list_workflows` - List workflow executions
- `temporal_get_workflow` - Get workflow details
- `temporal_terminate_workflow` - Terminate a workflow
- `temporal_cancel_workflow` - Cancel a workflow
- `temporal_signal_workflow` - Send signal to workflow
- `temporal_query_workflow` - Query a workflow
- `temporal_get_workflow_history` - Get workflow event history

### Schedules
- `temporal_list_schedules` - List schedules
- `temporal_get_schedule` - Get schedule details
- `temporal_create_schedule` - Create a schedule
- `temporal_delete_schedule` - Delete a schedule

### Task Queues
- `temporal_get_task_queue` - Get task queue info
- `temporal_get_search_attributes` - Get search attributes
- `temporal_get_cluster_info` - Get cluster info

## Usage

```json
{
  "mcpServers": {
    "temporal": {
      "command": "node",
      "args": ["path/to/temporal-mcp-server/dist/index.js"],
      "env": {
        "TEMPORAL_URL": "http://localhost:8233",
        "TEMPORAL_NAMESPACE": "default",
        "TEMPORAL_API_KEY": "optional-api-key"
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
