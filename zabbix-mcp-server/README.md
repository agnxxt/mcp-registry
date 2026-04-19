# Zabbix MCP Server

MCP Server for [Zabbix](https://www.zabbix.com/) infrastructure monitoring. Communicates via Zabbix JSON-RPC API with automatic authentication and token caching.

## Environment Variables

| Variable | Description |
|---|---|
| `ZABBIX_URL` | Zabbix frontend URL (e.g. `https://zabbix.example.com`) |
| `ZABBIX_USER` | Zabbix username for API authentication |
| `ZABBIX_PASSWORD` | Zabbix password for API authentication |

## Tools (20)

### Hosts
- `list_hosts` - List monitored hosts
- `get_host` - Get host details by ID
- `create_host` - Create a new monitored host

### Items
- `list_items` - List monitoring items for a host
- `get_item` - Get item details by ID

### Triggers
- `list_triggers` - List triggers for a host
- `get_trigger` - Get trigger details by ID

### Events
- `list_events` - List recent events
- `acknowledge_event` - Acknowledge events with optional message

### Templates
- `list_templates` - List all available templates
- `get_template` - Get template details by ID

### Maintenance
- `list_maintenance` - List all maintenance periods
- `create_maintenance` - Create a maintenance period for hosts

### Miscellaneous
- `get_problems` - Get current active problems
- `get_history` - Get historical monitoring data
- `list_host_groups` - List all host groups
- `create_host_group` - Create a new host group
- `get_api_version` - Get Zabbix API version

## Setup

```bash
npm install
npm run build
```

## MCP Configuration

```json
{
  "mcpServers": {
    "zabbix": {
      "command": "node",
      "args": ["path/to/zabbix-mcp-server/dist/index.js"],
      "env": {
        "ZABBIX_URL": "https://zabbix.example.com",
        "ZABBIX_USER": "Admin",
        "ZABBIX_PASSWORD": "your-password"
      }
    }
  }
}
```
