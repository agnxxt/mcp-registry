# Langflow MCP Server

MCP Server for Langflow AI flow management platform.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LANGFLOW_URL` | Yes | Langflow instance URL |
| `LANGFLOW_API_KEY` | Yes | API key for authentication |

## Tools (18)

### Flows
- `langflow_list_flows` - List all flows
- `langflow_get_flow` - Get a flow by ID
- `langflow_create_flow` - Create a new flow
- `langflow_update_flow` - Update a flow
- `langflow_delete_flow` - Delete a flow
- `langflow_run_flow` - Run a flow
- `langflow_get_task_status` - Get task status

### Components
- `langflow_list_components` - List available components
- `langflow_get_component` - Get component details

### Folders
- `langflow_list_folders` - List all folders
- `langflow_create_folder` - Create a folder
- `langflow_update_folder` - Update a folder
- `langflow_delete_folder` - Delete a folder

### Store
- `langflow_store_list_components` - List store components
- `langflow_store_get_component` - Get store component
- `langflow_store_install_component` - Install from store
- `langflow_upload_flow` - Upload a flow
- `langflow_download_flow` - Download a flow

## Usage

```json
{
  "mcpServers": {
    "langflow": {
      "command": "node",
      "args": ["path/to/langflow-mcp-server/dist/index.js"],
      "env": {
        "LANGFLOW_URL": "http://localhost:7860",
        "LANGFLOW_API_KEY": "your-api-key"
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
