# Camunda MCP Server

MCP Server for Camunda 8 process orchestration platform.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CAMUNDA_URL` | Yes | Camunda cluster URL |
| `CAMUNDA_CLIENT_ID` | Yes | OAuth2 client ID |
| `CAMUNDA_CLIENT_SECRET` | Yes | OAuth2 client secret |

## Authentication

Uses OAuth2 client credentials flow. The server automatically obtains and refreshes Bearer tokens via `POST {url}/auth/token`.

## Tools (20)

### Process Definitions
- `camunda_search_process_definitions` - Search process definitions
- `camunda_get_process_definition` - Get a process definition by key

### Process Instances
- `camunda_create_process_instance` - Create a new process instance
- `camunda_search_process_instances` - Search process instances
- `camunda_get_process_instance` - Get a process instance by key
- `camunda_cancel_process_instance` - Cancel a running process instance

### User Tasks
- `camunda_search_user_tasks` - Search user tasks
- `camunda_get_user_task` - Get a user task by key
- `camunda_complete_user_task` - Complete a user task
- `camunda_assign_user_task` - Assign a user task

### Incidents
- `camunda_search_incidents` - Search incidents
- `camunda_resolve_incident` - Resolve an incident

### Variables
- `camunda_search_variables` - Search variables
- `camunda_update_variable` - Update a variable

### Decisions
- `camunda_search_decision_definitions` - Search decision definitions
- `camunda_evaluate_decision` - Evaluate a decision

### Jobs
- `camunda_search_jobs` - Search jobs
- `camunda_activate_jobs` - Activate jobs
- `camunda_complete_job` - Complete a job
- `camunda_fail_job` - Report a job failure

## Usage

```json
{
  "mcpServers": {
    "camunda": {
      "command": "node",
      "args": ["path/to/camunda-mcp-server/dist/index.js"],
      "env": {
        "CAMUNDA_URL": "https://your-cluster.camunda.io",
        "CAMUNDA_CLIENT_ID": "your-client-id",
        "CAMUNDA_CLIENT_SECRET": "your-client-secret"
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
