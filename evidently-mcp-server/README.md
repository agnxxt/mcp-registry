# Evidently MCP Server

MCP server for the [Evidently AI](https://www.evidentlyai.com/) monitoring and reporting API.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EVIDENTLY_URL` | Yes | Base URL of your Evidently instance (e.g. `https://evidently.example.com`) |
| `EVIDENTLY_TOKEN` | No | Bearer token for authentication |

## Tools (~12)

### Projects
- `evidently_list_projects` - List all projects
- `evidently_get_project` - Get project by ID
- `evidently_create_project` - Create a new project
- `evidently_delete_project` - Delete a project
- `evidently_update_project` - Update project name/description

### Snapshots
- `evidently_list_snapshots` - List snapshots for a project
- `evidently_get_snapshot` - Get a specific snapshot
- `evidently_add_snapshot` - Add a report snapshot to a project
- `evidently_delete_snapshot` - Delete a snapshot

### Dashboard
- `evidently_get_dashboard` - Get project dashboard with optional time range
- `evidently_list_dashboard_panels` - List dashboard panels
- `evidently_add_dashboard_panel` - Add a panel to the dashboard

## Usage

```bash
EVIDENTLY_URL=https://your-evidently.com EVIDENTLY_TOKEN=optional-token npx @mcphub/evidently-mcp-server
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
