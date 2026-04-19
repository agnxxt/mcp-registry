# GlitchTip MCP Server

MCP Server for [GlitchTip](https://glitchtip.com/) error tracking platform. Provides tools to manage organizations, projects, issues, events, teams, and alerts.

## Environment Variables

| Variable | Description |
|---|---|
| `GLITCHTIP_URL` | GlitchTip instance URL (e.g. `https://glitchtip.example.com`) |
| `GLITCHTIP_API_TOKEN` | API bearer token for authentication |

## Tools (14)

### Organizations
- `list_organizations` - List all organizations
- `get_organization` - Get organization details by slug

### Projects
- `list_projects` - List all projects in an organization
- `create_project` - Create a new project under a team

### Issues
- `list_issues` - List issues with filtering (query, sort, status)
- `get_issue` - Get issue details by ID
- `update_issue` - Update issue status (resolve, ignore, unresolve)
- `delete_issue` - Delete an issue

### Events
- `list_issue_events` - List all events for an issue
- `get_event` - Get a specific event by ID

### Teams
- `list_teams` - List all teams in an organization
- `create_team` - Create a new team

### Alerts
- `list_alerts` - List alert rules for a project
- `create_alert` - Create a new alert rule

## Setup

```bash
npm install
npm run build
```

## MCP Configuration

```json
{
  "mcpServers": {
    "glitchtip": {
      "command": "node",
      "args": ["path/to/glitchtip-mcp-server/dist/index.js"],
      "env": {
        "GLITCHTIP_URL": "https://glitchtip.example.com",
        "GLITCHTIP_API_TOKEN": "your-api-token"
      }
    }
  }
}
```
