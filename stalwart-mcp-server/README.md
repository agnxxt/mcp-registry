# Stalwart MCP Server

MCP Server for [Stalwart](https://stalw.art/) mail server. Provides tools to manage accounts, domains, mail queue, and server settings.

## Environment Variables

| Variable | Description |
|---|---|
| `STALWART_URL` | Stalwart server URL (e.g. `https://mail.example.com`) |
| `STALWART_USERNAME` | Admin username for Basic auth |
| `STALWART_PASSWORD` | Admin password for Basic auth |

## Tools (14)

### Accounts
- `list_accounts` - List all mail accounts
- `get_account` - Get account details by name
- `create_account` - Create a new mail account
- `update_account` - Update an existing account
- `delete_account` - Delete an account

### Domains
- `list_domains` - List all configured domains
- `create_domain` - Register a new domain
- `delete_domain` - Delete a domain

### Queue
- `list_queue_messages` - List messages in mail queue
- `get_queue_message` - Get queued message details
- `delete_queue_message` - Delete a queued message
- `retry_queue_message` - Retry delivery of a queued message
- `get_queue_reports` - Get DSN reports

### Settings
- `get_settings` - Get server configuration
- `update_settings` - Update server configuration

## Setup

```bash
npm install
npm run build
```

## MCP Configuration

```json
{
  "mcpServers": {
    "stalwart": {
      "command": "node",
      "args": ["path/to/stalwart-mcp-server/dist/index.js"],
      "env": {
        "STALWART_URL": "https://mail.example.com",
        "STALWART_USERNAME": "admin",
        "STALWART_PASSWORD": "your-password"
      }
    }
  }
}
```
